import "./TrashZone.css";

interface TrashZoneProps {
  isActive: boolean;
}

export function TrashZone({ isActive }: TrashZoneProps) {
  return (
    <div className="trash-zone" aria-label="Trash zone">
      <span className="trash-zone__icon" aria-hidden="true">
        🗑️
      </span>

      <span className="trash-zone__label">
        {isActive ? "Release to delete" : "Drop here to delete"}
      </span>
    </div>
  );
}
