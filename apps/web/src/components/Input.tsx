import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`min-h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/20 dark:border-white/15 dark:bg-white/10 ${className}`}
      {...rest}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={`min-h-24 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/20 dark:border-white/15 dark:bg-white/10 ${className}`}
      {...rest}
    />
  );
}
