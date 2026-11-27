type PageCopy = string | string[] | { [key: string]: PageCopy };

function merge(defaults: PageCopy, value: unknown): PageCopy {
  if (typeof defaults === "string") {
    return typeof value === "string" && value.trim() ? value.trim() : defaults;
  }
  if (Array.isArray(defaults)) {
    if (!Array.isArray(value)) return defaults;
    const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return items.length ? items.map((item) => item.trim()) : defaults;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return defaults;

  const input = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
    key, merge(fallback, Object.hasOwn(input, key) ? input[key] : undefined),
  ]));
}

/** Overlay published plain text on the existing page, keeping fixed structure and usable defaults. */
export function mergePageCopy<T extends PageCopy>(defaults: T, value: unknown): T {
  return merge(defaults, value) as T;
}
