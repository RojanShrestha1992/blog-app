import React from "react";

const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const typeStyles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-100 w-full max-w-sm">
      <div
        className={`pointer-events-auto flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-lg ${typeStyles}`}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="rounded-md px-1.5 py-0.5 text-base leading-none transition hover:bg-black/10"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;