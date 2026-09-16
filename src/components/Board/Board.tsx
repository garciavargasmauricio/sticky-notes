import { useRef, useState, type PointerEvent } from "react";

import { useNotes } from "../../hooks/useNotes";

import { StickyNote } from "../StickyNote/StickyNote";
import { TrashZone } from "../TrashZone/TrashZone";

import "./Board.css";

interface NotePosition {
  x: number;
  y: number;
}

export function Board() {
  const boardRef = useRef<HTMLElement | null>(null);

  const {
    notes,
    createNote,
    moveNote,
    resizeNote,
    updateNoteText,
    deleteNote,
    bringToFront,
  } = useNotes();

  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);

  const [isOverTrash, setIsOverTrash] = useState(false);

  const isOverTrashRef = useRef(false);

  function handleDragStart(id: string) {
    setDraggingNoteId(id);

    setIsOverTrash(false);

    isOverTrashRef.current = false;
  }

  function handleDragMove(id: string, position: NotePosition) {
    moveNote(id, position);

    const board = boardRef.current;

    if (!board) {
      return;
    }

    const trashZone = board.querySelector(".trash-zone");

    if (!(trashZone instanceof HTMLElement)) {
      return;
    }

    const note = notes.find((item) => item.id === id);

    if (!note) {
      return;
    }

    const boardRect = board.getBoundingClientRect();

    const trashRect = trashZone.getBoundingClientRect();

    const noteLeft = boardRect.left + position.x;

    const noteTop = boardRect.top + position.y;

    const noteRight = noteLeft + note.size.width;

    const noteBottom = noteTop + note.size.height;

    const isOver =
      noteLeft < trashRect.right &&
      noteRight > trashRect.left &&
      noteTop < trashRect.bottom &&
      noteBottom > trashRect.top;

    isOverTrashRef.current = isOver;

    setIsOverTrash(isOver);
  }

  function handleDragEnd(id: string) {
    if (isOverTrashRef.current) {
      deleteNote(id);
    }

    setDraggingNoteId(null);

    setIsOverTrash(false);

    isOverTrashRef.current = false;
  }

  function handleDragCancel(id: string) {
    setDraggingNoteId(null);

    setIsOverTrash(false);

    isOverTrashRef.current = false;
  }

  return (
    <main ref={boardRef} className="board">
      <button
        className="board__new-note-button"
        type="button"
        onClick={() => createNote()}
      >
        + New Note
      </button>

      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onMove={handleDragMove}
          onResize={resizeNote}
          onTextChange={updateNoteText}
          onBringToFront={bringToFront}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        />
      ))}

      <TrashZone isActive={draggingNoteId !== null && isOverTrash} />
    </main>
  );
}
