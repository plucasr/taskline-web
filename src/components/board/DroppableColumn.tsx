"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

export function DroppableColumn({ id, children }: { id: number; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      style={{
        minWidth: 220,
        outline: isOver ? "2px solid #4ade80" : undefined,
        outlineOffset: 4,
        borderRadius: 4,
      }}
    >
      {children}
    </section>
  );
}
