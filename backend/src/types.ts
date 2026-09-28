// Shared shapes between the repository implementations and the API.

export type PatientStatus = "active" | "completed" | "follow-up";

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  treatment: string;
  status: PatientStatus;
  nextVisit: string; // ISO date string
  notes: string;
  createdAt: string; // ISO date string
}

export interface Doctor {
  email: string;
  name: string;
  passwordHash: string;
}

export interface CreatePatientInput {
  name: string;
  age: number;
  phone: string;
  email?: string;
  treatment: string;
  status: PatientStatus;
  nextVisit: string;
  notes: string;
}

export type UpdatePatientInput = Partial<Omit<CreatePatientInput, never>>;

// Minimal repository interface. Two implementations exist:
//  - mongoose  (MongoDB Atlas when MONGODB_URI is set and reachable)
//  - json-file (offline fallback, persisted to <backend-root>/data/db.json)
export interface Db {
  mode: "mongo" | "json";
  getDoctorByEmail(email: string): Promise<Doctor | null>;
  upsertDoctor(doctor: Doctor): Promise<Doctor>;
  getPatients(): Promise<Patient[]>;
  getPatientById(id: string): Promise<Patient | null>;
  createPatient(input: CreatePatientInput): Promise<Patient>;
  updatePatient(id: string, patch: UpdatePatientInput): Promise<Patient | null>;
  deletePatient(id: string): Promise<boolean>;
  close(): Promise<void>;
  /** Quick summary used for startup diagnostics (doctor/patient counts). */
  getCounts(): Promise<{ doctors: number; patients: number }>;
}

export function isPatientStatus(v: unknown): v is PatientStatus {
  return v === "active" || v === "completed" || v === "follow-up";
}
