// Helper type guard method to check whether an optional list contains data.
//
// This is a very simple check, but because of how commonly it's needed
// it's been made into a simple function, to reduce the repetition.
export function checkList<T>(lst: T[] | undefined | null): lst is T[] {
  return lst != undefined && lst != null && lst.length > 0;
}

// Equivalent to Python's str.capitalize (return the string with first letter capitalized)
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Remove a specific prefix from a given string
//
// If the string doesn't start with that prefix, throw an error.
export function removePrefix(s: string, prefix: string): string {
  if (s.startsWith(prefix)) {
    return s.slice(prefix.length);
  }
  throw new Error(`The string '${s}' doesn't start with '${prefix}'`);
}
