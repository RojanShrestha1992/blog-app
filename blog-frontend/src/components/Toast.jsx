import React from "react";

const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const typeStyles =
    type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-indigo-200 bg-indigo-50 text-indigo-700";

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-100 w-full max-w-sm" style={{ zIndex: 9999 }}>
      <div
        className={`pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm ${typeStyles}`}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="rounded-md px-1.5 py-0.5 text-base leading-none transition hover:bg-indigo-200/40"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;