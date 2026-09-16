import type { Position, Size } from "../types/note";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectanglesOverlap(
  first: Rectangle,
  second: Rectangle,
): boolean {
  const firstRight = first.x + first.width;

  const firstBottom = first.y + first.height;

  const secondRight = second.x + second.width;

  const secondBottom = second.y + second.height;

  return (
    first.x < secondRight &&
    firstRight > second.x &&
    first.y < secondBottom &&
    firstBottom > second.y
  );
}

export function noteToRectangle(position: Position, size: Size): Rectangle {
  return {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  };
}
