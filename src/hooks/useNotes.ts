import { useEffect, useState } from "react";

import type { Note, Position, Size } from "../types/note";

import { loadNotes, saveNotes } from "../utils/storage";
import {
  DEFAULT_POSITION,
  DEFAULT_SIZE,
  getNextZIndex,
  getRandomNoteColor,
} from "../utils/notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  // Keep the notes persisted between sessions.
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  function createNote(
    position: Position = DEFAULT_POSITION,
    size: Size = DEFAULT_SIZE,
  ) {
    setNotes((currentNotes) => {
      const newNote: Note = {
        id: crypto.randomUUID(),

        position: {
          ...position,
        },

        size: {
          ...size,
        },

        text: "",

        color: getRandomNoteColor(),

        // Use the highest current z-index so the new note appears on top.
        zIndex: getNextZIndex(currentNotes),
      };

      return [...currentNotes, newNote];
    });
  }

  function moveNote(id: string, position: Position) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              position,
            }
          : note,
      ),
    );
  }

  function resizeNote(id: string, size: Size) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              size,
            }
          : note,
      ),
    );
  }

  function updateNoteText(id: string, text: string) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              text,
            }
          : note,
      ),
    );
  }

  function deleteNote(id: string) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }

  function bringToFront(id: string) {
    setNotes((currentNotes) => {
      const nextZIndex = getNextZIndex(currentNotes);

      return currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              zIndex: nextZIndex,
            }
          : note,
      );
    });
  }

  return {
    notes,
    createNote,
    moveNote,
    resizeNote,
    updateNoteText,
    deleteNote,
    bringToFront,
  };
}
