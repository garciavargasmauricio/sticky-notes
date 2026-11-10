const STORAGE_KEY = "sticky-notes";

export function loadNotes<T>(): T[] {
  try {
    const storedNotes = localStorage.getItem(STORAGE_KEY);

    if (!storedNotes) {
      return [];
    }

    const parsedNotes = JSON.parse(storedNotes);

    if (!Array.isArray(parsedNotes)) {
      return [];
    }

    return parsedNotes;
  } catch {
    return [];
  }
}

export function saveNotes<T>(notes: T[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Keep the board usable when storage is unavailable or full.
  }
}
