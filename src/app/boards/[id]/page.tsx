"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  getBoard,
  createCard,
  moveCard,
  createColumn,
  type BoardDetail,
  type Card,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Presence } from "@/components/Presence";
import { RoomChat } from "@/components/RoomChat";
import { DraggableCard } from "@/components/board/DraggableCard";
import { DroppableColumn } from "@/components/board/DroppableColumn";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { session, loading } = useAuth();
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [error, setError] = useState("");
  const [cardTitles, setCardTitles] = useState<Record<number, string>>({});
  const [newColumn, setNewColumn] = useState("");

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace("/login");
      return;
    }
    getBoard(session.token, Number(params.id))
      .then(setBoard)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load board"));
  }, [session, loading, router, params.id]);

  async function onAddCard(columnId: number) {
    if (!session || !board) {
      return;
    }
    const title = cardTitles[columnId]?.trim();
    if (!title) {
      return;
    }
    const card = await createCard(session.token, board.id, columnId, title);
    setBoard({
      ...board,
      columns: board.columns.map((column) =>
        column.id === columnId ? { ...column, cards: [...column.cards, card] } : column,
      ),
    });
    setCardTitles({ ...cardTitles, [columnId]: "" });
  }

  async function onAddColumn(event: React.FormEvent) {
    event.preventDefault();
    if (!session || !board) {
      return;
    }
    const name = newColumn.trim();
    if (!name) {
      return;
    }
    const column = await createColumn(session.token, board.id, name, board.columns.length);
    setBoard({ ...board, columns: [...board.columns, { ...column, cards: [] }] });
    setNewColumn("");
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!session || !board || !over || active.id === over.id) {
      return;
    }

    const cardId = Number(active.id);
    const targetColumnId = Number(over.id);
    const fromColumn = board.columns.find((column) => column.cards.some((card) => card.id === cardId));
    const toColumn = board.columns.find((column) => column.id === targetColumnId);
    if (!fromColumn || !toColumn) {
      return;
    }

    const card = fromColumn.cards.find((item) => item.id === cardId) as Card;
    const previous = board;

    setBoard({
      ...board,
      columns: board.columns.map((column) => {
        if (column.id === fromColumn.id) {
          return { ...column, cards: column.cards.filter((item) => item.id !== cardId) };
        }
        if (column.id === toColumn.id) {
          return { ...column, cards: [...column.cards, { ...card, column_id: targetColumnId }] };
        }
        return column;
      }),
    });

    moveCard(session.token, board.id, fromColumn.id, cardId, targetColumnId, toColumn.cards.length).catch(
      (err) => {
        setBoard(previous);
        setError(err instanceof Error ? err.message : "Move failed");
      },
    );
  }

  if (loading || !session) {
    return <main>Loading…</main>;
  }
  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
      </main>
    );
  }
  if (!board) {
    return <main>Loading board…</main>;
  }

  return (
    <main>
      <h1>{board.name}</h1>
      <Presence token={session.token} boardId={board.id} selfId={session.user.id} />
      <DndContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 16 }}>
          {board.columns.map((column) => (
            <DroppableColumn key={column.id} id={column.id}>
              <h2>{column.name}</h2>
              <ul>
                {column.cards.map((card) => (
                  <DraggableCard key={card.id} card={card} />
                ))}
              </ul>
              <input
                placeholder="Add card"
                value={cardTitles[column.id] ?? ""}
                onChange={(e) => setCardTitles({ ...cardTitles, [column.id]: e.target.value })}
              />
              <button onClick={() => onAddCard(column.id)}>Add</button>
            </DroppableColumn>
          ))}
          <form onSubmit={onAddColumn}>
            <input
              placeholder="New column"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
        </div>
      </DndContext>
      <RoomChat token={session.token} boardId={board.id} />
    </main>
  );
}
