"use client";

/**
 * WhatsApp reminder button: a chat-bubble icon that opens a pre-filled
 * WhatsApp reminder for the appointment. Turns green on hover.
 */
export default function WhatsAppReminderButton({
  patientName,
  onClick,
}: {
  patientName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Send WhatsApp reminder"
      aria-label={`Send WhatsApp reminder to ${patientName}`}
      className="rounded-full border border-ink/15 p-2 text-ink/60 transition-colors hover:border-emerald-600/50 hover:text-emerald-700 dark:border-white/15 dark:text-white/60 dark:hover:border-emerald-400/50 dark:hover:text-emerald-300"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    </button>
  );
}
