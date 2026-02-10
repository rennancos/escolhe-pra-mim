function base(level, message, meta = {}) {
  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message, meta) => base("info", message, meta),
  warn: (message, meta) => base("warn", message, meta),
  error: (message, meta) => base("error", message, meta),
};

