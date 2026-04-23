export function interpolateTemplate(
  template: string,
  context: Record<string, unknown>
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, rawPath) => {
    const keys = rawPath.split(".");
    let current: unknown = context;

    for (const key of keys) {
      if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        current = "";
        break;
      }
    }

    if (typeof current === "string") {
      return current;
    }

    if (current === undefined || current === null) {
      return "";
    }

    return JSON.stringify(current);
  });
}

export function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

