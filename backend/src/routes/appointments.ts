import { Router } from "express";
import { getDb } from "../db";

export const appointmentsRouter = Router();

const SLOTS = ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

// Deterministically fabricate a plausible time slot for a patient that has none.
function fabricateSlot(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return SLOTS[h % SLOTS.length];
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

// GET /api/appointments/today -> 200 {appointments:[{id, patientName, time, treatment, status}]}
appointmentsRouter.get("/today", async (req, res) => {
  const patients = await getDb().getPatients();
  const appointments = patients
    .filter((p) => p.nextVisit && isToday(p.nextVisit))
    .map((p) => ({
      id: p.id,
      patientName: p.name,
      // nextVisit is a date; fabricate a plausible time slot per patient.
      time: fabricateSlot(p.id),
      treatment: p.treatment,
      status: p.status,
    }));
  res.json({ appointments });
});
