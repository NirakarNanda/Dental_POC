import { CLINIC_NAME } from "./clinic";
import { formatDateLong, formatTime12 } from "./slots";

/** Strip everything but digits — wa.me wants a plain international number. */
export function toWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export interface ReminderDetails {
  patientName: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:MM 24h
  treatment: string;
}

export function reminderMessage(a: ReminderDetails): string {
  return (
    `Hello ${a.patientName}, this is a friendly reminder from ${CLINIC_NAME} ` +
    `about your dental appointment on ${formatDateLong(a.date)} at ${formatTime12(a.time)} ` +
    `(${a.treatment}). Please reply to confirm. Thank you!`
  );
}

/** Returns the wa.me URL, or null when there's no usable phone number. */
export function whatsappUrl(phone: string, message: string): string | null {
  const digits = toWhatsAppNumber(phone);
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
