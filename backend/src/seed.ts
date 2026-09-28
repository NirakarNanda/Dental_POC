import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { getDb, initDb } from "./db";
import type { CreatePatientInput, PatientStatus } from "./types";

dotenv.config();

// Seed script: creates the demo doctor account and ~12 realistic dental
// patients. Works in BOTH modes (Atlas and offline JSON-file fallback).

const DOCTOR_EMAIL = (process.env.ADMIN_EMAIL ?? "doctor@pearlsmile.dental").trim() || "doctor@pearlsmile.dental";
const DOCTOR_PASSWORD = (process.env.ADMIN_PASSWORD ?? "demo1234").trim() || "demo1234";
const DOCTOR_NAME = "Dr. Ananya Sharma";

interface SeedPatient extends Omit<CreatePatientInput, "status"> {
  status: PatientStatus;
}

function isoOffset(days: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const PATIENTS: SeedPatient[] = [
  {
    name: "Rohan Mehta",
    age: 34,
    phone: "+91 98110 23456",
    email: "rohan.mehta@example.com",
    treatment: "Teeth Cleaning",
    status: "active",
    nextVisit: isoOffset(0, 9, 30),
    notes: "Routine scaling; mild gingivitis observed.",
  },
  {
    name: "Priya Iyer",
    age: 28,
    phone: "+91 98840 11223",
    treatment: "Teeth Whitening",
    status: "active",
    nextVisit: isoOffset(0, 11, 0),
    notes: "In-office whitening session 2 of 3.",
  },
  {
    name: "Arjun Nair",
    age: 16,
    phone: "+91 97420 55667",
    treatment: "Braces & Orthodontics",
    status: "active",
    nextVisit: isoOffset(0, 15, 30),
    notes: "Monthly brace tightening; wear retainer as advised.",
  },
  {
    name: "Kavya Reddy",
    age: 45,
    phone: "+91 90000 77889",
    email: "kavya.r@example.com",
    treatment: "Root Canal",
    status: "active",
    nextVisit: isoOffset(0, 17, 0),
    notes: "RCT on lower right molar; crown fitting next.",
  },
  {
    name: "Aditya Sharma",
    age: 7,
    phone: "+91 99870 44332",
    treatment: "Pediatric Dentistry",
    status: "active",
    nextVisit: isoOffset(1, 10, 0),
    notes: "Fluoride application; checkup for loose tooth.",
  },
  {
    name: "Sunita Desai",
    age: 58,
    phone: "+91 98200 66778",
    email: "sunita.desai@example.com",
    treatment: "Dental Implants",
    status: "active",
    nextVisit: isoOffset(2, 12, 30),
    notes: "Implant review; upper left premolar site healing well.",
  },
  {
    name: "Vikram Malhotra",
    age: 41,
    phone: "+91 98111 90909",
    treatment: "Teeth Cleaning",
    status: "follow-up",
    nextVisit: isoOffset(3, 9, 0),
    notes: "Follow-up after deep cleaning; check pocket depth.",
  },
  {
    name: "Neha Kulkarni",
    age: 23,
    phone: "+91 97654 32109",
    email: "neha.k@example.com",
    treatment: "Braces & Orthodontics",
    status: "active",
    nextVisit: isoOffset(4, 16, 0),
    notes: "Aligner tray 14 of 22; IPR check.",
  },
  {
    name: "Suresh Patil",
    age: 52,
    phone: "+91 94220 12345",
    treatment: "Root Canal",
    status: "completed",
    nextVisit: isoOffset(5, 11, 30),
    notes: "Completed RCT; scheduled recall review.",
  },
  {
    name: "Anjali Gupta",
    age: 31,
    phone: "+91 99580 67890",
    email: "anjali.g@example.com",
    treatment: "Teeth Whitening",
    status: "completed",
    nextVisit: isoOffset(6, 14, 0),
    notes: "Completed whitening; shade guide B1 achieved.",
  },
  {
    name: "Ravi Menon",
    age: 60,
    phone: "+91 98470 24680",
    treatment: "Dental Implants",
    status: "follow-up",
    nextVisit: isoOffset(0, 13, 0),
    notes: "Post-op follow-up; mild swelling, advise warm saline rinse.",
  },
  {
    name: "Divya Bhatt",
    age: 12,
    phone: "+91 98765 13579",
    treatment: "Pediatric Dentistry",
    status: "active",
    nextVisit: isoOffset(7, 10, 30),
    notes: "Sealant application on first molars.",
  },
];

async function main(): Promise<void> {
  const db = await initDb();
  console.log(`[seed] db mode: ${db.mode}`);

  // Seed the demo doctor.
  const passwordHash = await bcrypt.hash(DOCTOR_PASSWORD, 10);
  const doctor = await db.upsertDoctor({ email: DOCTOR_EMAIL, name: DOCTOR_NAME, passwordHash });
  console.log(`[seed] doctor upserted: ${doctor.email} (${doctor.name})`);

  // Seed patients only when the store is empty (idempotent, safe to rerun).
  const existing = await db.getPatients();
  if (existing.length > 0) {
    console.log(`[seed] ${existing.length} patient(s) already present, skipping patient seed.`);
  } else {
    for (const p of PATIENTS) {
      await db.createPatient(p);
    }
    console.log(`[seed] created ${PATIENTS.length} patients.`);
  }

  await db.close();
  console.log("[seed] done.");
}

main().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
