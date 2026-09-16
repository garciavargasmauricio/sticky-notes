import type { PointerEvent } from "react";

interface TrashZoneProps {
  isActive: boolean;

  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
}

export function TrashZone({ isActive, onPointerDown }: TrashZoneProps) {
  return (
    <div
      className={`trash-zone ${isActive ? "trash-zone--active" : ""}`}
      onPointerDown={onPointerDown}
      aria-label="Trash zone"
    >
      <span className="trash-zone__icon" aria-hidden="true">
        🗑️
      </span>

      <span className="trash-zone__label">
        {isActive ? "Release to delete" : "Drop here to delete"}
      </span>
    </div>
  );
}
