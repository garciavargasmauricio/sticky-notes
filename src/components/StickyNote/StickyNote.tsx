import { memo, useRef, type PointerEvent } from "react";

import type { Note, Position, Size } from "../../types/note";

import "./StickyNote.css";

interface StickyNoteProps {
  note: Note;

  onMove: (id: string, position: Position) => void;

  onResize: (id: string, size: Size) => void;

  onTextChange: (id: string, text: string) => void;

  onBringToFront: (id: string) => void;

  onDragStart: (id: string) => void;

  onDragEnd: (id: string) => void;

  onDragCancel: (id: string) => void;
}

interface DragState {
  startPointerX: number;
  startPointerY: number;

  startNoteX: number;
  startNoteY: number;
}

interface ResizeState {
  startPointerX: number;
  startPointerY: number;

  startWidth: number;
  startHeight: number;
}

const MIN_WIDTH = 160;
const MIN_HEIGHT = 120;

export const StickyNote = memo(function StickyNote({
  note,
  onMove,
  onResize,
  onTextChange,
  onBringToFront,
  onDragStart,
  onDragEnd,
  onDragCancel,
}: StickyNoteProps) {
  const dragState = useRef<DragState | null>(null);

  const resizeState = useRef<ResizeState | null>(null);

  function handleDragStart(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || dragState.current) return;

    // Keep receiving pointer events even if the cursor leaves the header.
    event.currentTarget.setPointerCapture(event.pointerId);

    onDragStart(note.id);

    dragState.current = {
      startPointerX: event.clientX,
      startPointerY: event.clientY,

      startNoteX: note.position.x,
      startNoteY: note.position.y,
    };
  }

  function handleDragMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;

    if (!drag) {
      return;
    }

    const deltaX = event.clientX - drag.startPointerX;

    const deltaY = event.clientY - drag.startPointerY;

    const board = event.currentTarget.parentElement!.parentElement!;
    onMove(note.id, {
      x: Math.max(0, Math.min(drag.startNoteX + deltaX, board.clientWidth - note.size.width)),
      y: Math.max(0, Math.min(drag.startNoteY + deltaY, board.clientHeight - note.size.height)),
    });
  }

  function handleDragEnd(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragState.current = null;

    onDragEnd(note.id);
  }

  function handleDragCancel(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragState.current = null;

    onDragCancel(note.id);
  }

  function handleResizeStart(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || resizeState.current) return;

    // Pointer capture keeps the resize active outside the handle.
    event.currentTarget.setPointerCapture(event.pointerId);

    resizeState.current = {
      startPointerX: event.clientX,
      startPointerY: event.clientY,

      startWidth: note.size.width,
      startHeight: note.size.height,
    };
  }

  function handleResizeMove(event: PointerEvent<HTMLDivElement>) {
    const resize = resizeState.current;

    if (!resize) {
      return;
    }

    const deltaX = event.clientX - resize.startPointerX;

    const deltaY = event.clientY - resize.startPointerY;

    const board = event.currentTarget.parentElement!.parentElement!;
    const newWidth = Math.min(board.clientWidth - note.position.x, Math.max(MIN_WIDTH, resize.startWidth + deltaX));

    const newHeight = Math.min(board.clientHeight - note.position.y, Math.max(MIN_HEIGHT, resize.startHeight + deltaY));

    onResize(note.id, {
      width: newWidth,
      height: newHeight,
    });
  }

  function handleResizeEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resizeState.current = null;
  }

  return (
    <article
      className="sticky-note"
      onPointerDown={(event) => {
        if (event.button === 0 && event.isPrimary) onBringToFront(note.id);
      }}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
      }}
    >
      <div
        className="sticky-note__header"
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragCancel}
        onLostPointerCapture={handleDragCancel}
      >
        <span>Sticky Note</span>
      </div>

      <textarea
        className="sticky-note__textarea"
        value={note.text}
        onChange={(event) => onTextChange(note.id, event.target.value)}
        placeholder="Write something..."
        aria-label="Sticky note content"
      />

      <div
        className="sticky-note__resize-handle"
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerCancel={handleResizeEnd}
        onLostPointerCapture={handleResizeEnd}
        aria-label="Resize note"
      />
    </article>
  );
});
