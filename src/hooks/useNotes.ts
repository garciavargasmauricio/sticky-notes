import { useCallback, useEffect, useState } from "react";

import type { Note, Position, Size } from "../types/note";

import { loadNotes, saveNotes } from "../utils/storage";
import {
  DEFAULT_SIZE,
  getNextZIndex,
  getRandomNoteColor,
} from "../utils/notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  // Coalesce rapid pointer and text updates into one storage write.
  useEffect(() => {
    const timeout = window.setTimeout(() => saveNotes(notes), 300);

    return () => window.clearTimeout(timeout);
  }, [notes]);

  const createNote = useCallback((
    position: Position,
    size: Size = DEFAULT_SIZE,
  ) => {
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
  }, []);

  const moveNote = useCallback((id: string, position: Position) => {
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
  }, []);

  const resizeNote = useCallback((id: string, size: Size) => {
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
  }, []);

  const updateNoteText = useCallback((id: string, text: string) => {
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
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }, []);

  const bringToFront = useCallback((id: string) => {
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
  }, []);

  const fitNotesToBoard = useCallback((bounds: Size) => {
    setNotes((currentNotes) => {
      let changed = false;
      const fitted = currentNotes.map((note) => {
        const size = {
          width: Math.min(note.size.width, bounds.width),
          height: Math.min(note.size.height, bounds.height),
        };
        const position = {
          x: Math.max(0, Math.min(note.position.x, bounds.width - size.width)),
          y: Math.max(0, Math.min(note.position.y, bounds.height - size.height)),
        };
        if (size.width === note.size.width && size.height === note.size.height &&
            position.x === note.position.x && position.y === note.position.y) return note;
        changed = true;
        return { ...note, size, position };
      });
      return changed ? fitted : currentNotes;
    });
  }, []);

  return {
    notes,
    fitNotesToBoard,
    createNote,
    moveNote,
    resizeNote,
    updateNoteText,
    deleteNote,
    bringToFront,
  };
}
