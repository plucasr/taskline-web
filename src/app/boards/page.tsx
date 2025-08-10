"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listBoards, createBoard, type Board } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function BoardsPage() {
  const router = useRouter();
  const { session, loading, signOut } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace("/login");
      return;
    }
    listBoards(session.token)
      .then(setBoards)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load boards"));
  }, [session, loading, router]);

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!session || !newName.trim()) {
      return;
    }
    const board = await createBoard(session.token, newName.trim());
    setBoards([...boards, board]);
    setNewName("");
  }

  if (loading || !session) {
    return <main>Loading…</main>;
  }

  return (
    <main>
      <h1>Boards</h1>
      <p>
        {session.user.email} · <button onClick={signOut}>Sign out</button>
      </p>
      {error && <p role="alert">{error}</p>}
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link href={`/boards/${board.id}`}>{board.name}</Link>
          </li>
        ))}
      </ul>
      <form onSubmit={onCreate}>
        <input
          placeholder="New board name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
