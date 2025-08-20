"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Card } from "@/lib/api";

export function DraggableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: isDragging ? 0.6 : 1 }
    : undefined;

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {card.title}
    </li>
  );
}
