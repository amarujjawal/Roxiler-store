import React from "react";
export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  maxLength,
  minLength,
  required = false,
  textarea = false,
  rows = 4,
}) {
  const commonClassName = [
    "mt-2 w-full rounded-xl border px-3.5 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-400",
    error ? "border-red-400 bg-red-500/5" : "border-white/10 bg-slate-900/30",
    error
      ? "focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
      : "focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30",
  ].join(" ");

  const props = {
    id: name,
    name,
    value,
    onChange,
    type,
    maxLength,
    minLength,
    required,
    placeholder,
    className: commonClassName,
    rows: textarea ? rows : undefined,
  };

  return (
    <label className="block text-sm text-slate-200">
      <span className="font-medium">{label}</span>
      {textarea ? <textarea {...props} /> : <input {...props} />}
      {error && (
        <span className="mt-1 block text-xs text-red-300">{error}</span>
      )}
    </label>
  );
}
