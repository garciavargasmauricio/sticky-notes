import type { Note, Position, Size } from "../types/note";

export const DEFAULT_SIZE: Size = {
  width: 220,
  height: 160,
};

export const DEFAULT_POSITION: Position = {
  x: 100,
  y: 100,
};

export const NOTE_COLORS = ["#fef08a", "#bfdbfe", "#bbf7d0", "#fbcfe8"];

export function getRandomNoteColor(): string {
  const randomIndex = Math.floor(Math.random() * NOTE_COLORS.length);

  return NOTE_COLORS[randomIndex];
}

export function getNextZIndex(notes: Note[]): number {
  if (notes.length === 0) {
    return 1;
  }

  return Math.max(...notes.map((note) => note.zIndex)) + 1;
}
