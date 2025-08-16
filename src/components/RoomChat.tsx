"use client";

import { useEffect, useRef, useState } from "react";
import { listRooms, createRoom, listMessages, type Room, type RoomMessage } from "@/lib/api";
import { connectCable, subscribeRoom, speak, type ChatMessagePayload } from "@/lib/cable";

export function RoomChat({ token, boardId }: { token: string; boardId: number }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const consumerRef = useRef<{ disconnect: () => void } | null>(null);

  useEffect(() => {
    listRooms(token, boardId).then(setRooms).catch(() => setRooms([]));
  }, [token, boardId]);

  useEffect(() => {
    if (!activeRoom) {
      return;
    }

    listMessages(token, boardId, activeRoom.id).then(setMessages).catch(() => setMessages([]));

    const consumer = connectCable(token);
    consumerRef.current = consumer;
    const subscription = subscribeRoom(consumer, boardId, activeRoom.id, {
      received: (data: ChatMessagePayload) => {
        setMessages((current) =>
          current.some((m) => m.id === data.message.id) ? current : [...current, data.message],
        );
      },
    });
    subscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [token, boardId, activeRoom]);

  function onSend(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !subscriptionRef.current) {
      return;
    }
    speak(subscriptionRef.current as never, body);
    setDraft("");
  }

  async function onCreateRoom(event: React.FormEvent) {
    event.preventDefault();
    const name = newRoom.trim();
    if (!name) {
      return;
    }
    const room = await createRoom(token, boardId, name);
    setRooms([...rooms, room]);
    setActiveRoom(room);
    setNewRoom("");
  }

  return (
    <aside>
      <h3>Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <button onClick={() => setActiveRoom(room)}>{room.name}</button>
          </li>
        ))}
      </ul>
      <form onSubmit={onCreateRoom}>
        <input placeholder="New room" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
        <button type="submit">Create</button>
      </form>

      {activeRoom && (
        <section>
          <h4>{activeRoom.name}</h4>
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <strong>{message.user?.email ?? "unknown"}</strong>: {message.body}
              </li>
            ))}
          </ul>
          <form onSubmit={onSend}>
            <input
              placeholder="Message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </section>
      )}
    </aside>
  );
}
