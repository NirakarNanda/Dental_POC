import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import type { CreatePatientInput, Db, Doctor, Patient, UpdatePatientInput } from "../types";

// Offline fallback store: in-memory with persistence to <backend-root>/data/db.json.
//
// The path is anchored to the backend package root derived from THIS module's
// location, never process.cwd(). This file lives at src/db/jsonRepo.ts under
// `tsx` dev and at dist/db/jsonRepo.js under compiled `node` prod — both are
// exactly two levels below the backend root, so seed and server always share
// the same db.json no matter which folder the user ran `npm run ...` from.
const BACKEND_ROOT = path.resolve(__dirname, "..", "..");
const DATA_DIR = path.join(BACKEND_ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

/** Exact db.json path used by the JSON store — useful for diagnostics. */
export const JSON_DB_FILE_PATH = DB_FILE;

interface FileDbShape {
  doctors: Doctor[];
  patients: Patient[];
}

function newId(): string {
  return randomUUID();
}

function toPatient(raw: Record<string, unknown>): Patient {
  return {
    id: String(raw.id ?? newId()),
    name: String(raw.name ?? ""),
    age: Number(raw.age ?? 0),
    phone: String(raw.phone ?? ""),
    email: raw.email != null && raw.email !== "" ? String(raw.email) : undefined,
    treatment: String(raw.treatment ?? ""),
    status: raw.status === "completed" || raw.status === "follow-up" ? raw.status : "active",
    nextVisit: String(raw.nextVisit ?? ""),
    notes: String(raw.notes ?? ""),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

export class JsonFileDb implements Db {
  readonly mode = "json" as const;
  private doctors: Doctor[] = [];
  private patients: Patient[] = [];
  private dirty = false;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      if (fs.existsSync(DB_FILE)) {
        const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf8")) as {
          doctors?: Doctor[];
          patients?: Record<string, unknown>[];
        };
        this.doctors = Array.isArray(raw.doctors) ? raw.doctors : [];
        this.patients = Array.isArray(raw.patients) ? raw.patients.map(toPatient) : [];
        console.log(`[db:json] loaded store: ${DB_FILE} (${this.doctors.length} doctor(s), ${this.patients.length} patient(s))`);
        return;
      }
      console.log(`[db:json] no store file yet at ${DB_FILE}; starting empty`);
    } catch (err) {
      console.warn("[db:json] could not read db.json, starting empty:", (err as Error).message);
    }
    this.doctors = [];
    this.patients = [];
  }

  private scheduleFlush(): void {
    this.dirty = true;
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      if (!this.dirty) return;
      this.dirty = false;
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const shape: FileDbShape = { doctors: this.doctors, patients: this.patients };
        fs.writeFileSync(DB_FILE, JSON.stringify(shape, null, 2), "utf8");
      } catch (err) {
        console.error("[db:json] failed to write db.json:", (err as Error).message);
      }
    }, 100);
    this.flushTimer.unref?.();
  }

  async getDoctorByEmail(email: string): Promise<Doctor | null> {
    const found = this.doctors.find((d) => d.email.toLowerCase() === email.toLowerCase());
    return found ?? null;
  }

  async upsertDoctor(doctor: Doctor): Promise<Doctor> {
    const idx = this.doctors.findIndex((d) => d.email.toLowerCase() === doctor.email.toLowerCase());
    if (idx >= 0) this.doctors[idx] = doctor;
    else this.doctors.push(doctor);
    this.scheduleFlush();
    return doctor;
  }

  async getPatients(): Promise<Patient[]> {
    return [...this.patients].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPatientById(id: string): Promise<Patient | null> {
    return this.patients.find((p) => p.id === id) ?? null;
  }

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    const now = new Date().toISOString();
    const patient: Patient = {
      id: newId(),
      name: input.name,
      age: input.age,
      phone: input.phone,
      email: input.email || undefined,
      treatment: input.treatment,
      status: input.status,
      nextVisit: input.nextVisit,
      notes: input.notes,
      createdAt: now,
    };
    this.patients.push(patient);
    this.scheduleFlush();
    return patient;
  }

  async updatePatient(id: string, patch: UpdatePatientInput): Promise<Patient | null> {
    const idx = this.patients.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const current = this.patients[idx];
    const updated: Patient = {
      ...current,
      name: patch.name ?? current.name,
      age: patch.age ?? current.age,
      phone: patch.phone ?? current.phone,
      email: patch.email !== undefined ? patch.email || undefined : current.email,
      treatment: patch.treatment ?? current.treatment,
      status: patch.status ?? current.status,
      nextVisit: patch.nextVisit ?? current.nextVisit,
      notes: patch.notes ?? current.notes,
    };
    this.patients[idx] = updated;
    this.scheduleFlush();
    return updated;
  }

  async deletePatient(id: string): Promise<boolean> {
    const idx = this.patients.findIndex((p) => p.id === id);
    if (idx < 0) return false;
    this.patients.splice(idx, 1);
    this.scheduleFlush();
    return true;
  }

  async getCounts(): Promise<{ doctors: number; patients: number }> {
    return { doctors: this.doctors.length, patients: this.patients.length };
  }

  async close(): Promise<void> {
    // Flush synchronously on shutdown.
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.dirty) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify({ doctors: this.doctors, patients: this.patients }, null, 2), "utf8");
      } catch (err) {
        console.error("[db:json] failed to flush db.json on close:", (err as Error).message);
      }
      this.dirty = false;
    }
  }
}
