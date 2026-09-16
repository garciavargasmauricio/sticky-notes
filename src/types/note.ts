export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Note {
  id: string;
  position: Position;
  size: Size;
  text: string;
  color: string;
  zIndex: number;
}
