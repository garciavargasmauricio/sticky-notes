import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useNotes } from "../../hooks/useNotes";

import { StickyNote } from "../StickyNote/StickyNote";
import { TrashZone } from "../TrashZone/TrashZone";

import { noteToRectangle, rectanglesOverlap } from "../../utils/geometry";
import { DEFAULT_POSITION, DEFAULT_SIZE } from "../../utils/notes";
import type { Position } from "../../types/note";

import "./Board.css";

export function Board() {
  const boardRef = useRef<HTMLElement | null>(null);

  const {
    notes,
    fitNotesToBoard,
    createNote,
    moveNote,
    resizeNote,
    updateNoteText,
    deleteNote,
    bringToFront,
  } = useNotes();

  const notesRef = useRef(notes);
  useLayoutEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const fit = () => fitNotesToBoard({ width: board.clientWidth, height: board.clientHeight });
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(board);
    return () => observer.disconnect();
  }, [fitNotesToBoard]);

  function handleCreateNote() {
    const board = boardRef.current;
    if (!board) return;
    const offset = (notes.length % 10) * 24;
    const size = {
      width: Math.min(DEFAULT_SIZE.width, board.clientWidth),
      height: Math.min(DEFAULT_SIZE.height, board.clientHeight),
    };
    createNote({
      x: Math.max(0, Math.min(DEFAULT_POSITION.x + offset, board.clientWidth - size.width)),
      y: Math.max(0, Math.min(DEFAULT_POSITION.y + offset, board.clientHeight - size.height)),
    }, size);
  }

  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);

  const [isOverTrash, setIsOverTrash] = useState(false);

  const isOverTrashRef = useRef(false);

  const handleDragStart = useCallback((id: string) => {
    setDraggingNoteId(id);

    setIsOverTrash(false);

    isOverTrashRef.current = false;
  }, []);

  const handleDragMove = useCallback((id: string, position: Position) => {
    moveNote(id, position);

    const board = boardRef.current;

    if (!board) {
      return;
    }

    const trashZone = board.querySelector(".trash-zone");

    if (!(trashZone instanceof HTMLElement)) {
      return;
    }

    const note = notesRef.current.find((item) => item.id === id);

    if (!note) {
      return;
    }

    const boardRect = board.getBoundingClientRect();

    const trashRect = trashZone.getBoundingClientRect();

    const isOver = rectanglesOverlap(
      noteToRectangle({ x: boardRect.left + position.x, y: boardRect.top + position.y }, note.size),
      { x: trashRect.left, y: trashRect.top, width: trashRect.width, height: trashRect.height },
    );

    isOverTrashRef.current = isOver;

    setIsOverTrash(isOver);
  }, [moveNote]);

  const handleDragCancel = useCallback(() => {
    setDraggingNoteId(null);
    setIsOverTrash(false);
    isOverTrashRef.current = false;
  }, []);

  const handleDragEnd = useCallback((id: string) => {
    if (isOverTrashRef.current) {
      deleteNote(id);
    }
    handleDragCancel();
  }, [deleteNote, handleDragCancel]);

  return (
    <main ref={boardRef} className="board">
      <button
        className="board__new-note-button"
        type="button"
        onClick={handleCreateNote}
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
