"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBoard, createCard, type BoardDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Presence } from "@/components/Presence";
import { RoomChat } from "@/components/RoomChat";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { session, loading } = useAuth();
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [error, setError] = useState("");
  const [cardTitles, setCardTitles] = useState<Record<number, string>>({});

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
      <div style={{ display: "flex", gap: 16 }}>
        {board.columns.map((column) => (
          <section key={column.id} style={{ minWidth: 220 }}>
            <h2>{column.name}</h2>
            <ul>
              {column.cards.map((card) => (
                <li key={card.id}>{card.title}</li>
              ))}
            </ul>
            <input
              placeholder="Add card"
              value={cardTitles[column.id] ?? ""}
              onChange={(e) => setCardTitles({ ...cardTitles, [column.id]: e.target.value })}
            />
            <button onClick={() => onAddCard(column.id)}>Add</button>
          </section>
        ))}
      </div>
      <RoomChat token={session.token} boardId={board.id} />
    </main>
  );
}
