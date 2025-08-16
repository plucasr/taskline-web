"use client";

import { useEffect, useState } from "react";
import { connectCable, subscribePresence, type PresenceEvent } from "@/lib/cable";

export function Presence({ token, boardId, selfId }: { token: string; boardId: number; selfId: number }) {
  const [online, setOnline] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    const consumer = connectCable(token);
    const seen = new Map<number, string>();
    const subscription = subscribePresence(consumer, boardId, (event: PresenceEvent) => {
      if (event.event === "joined") {
        seen.set(event.user.id, event.user.email);
      } else {
        seen.delete(event.user.id);
      }
      setOnline(new Map(seen));
    });

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [token, boardId]);

  return (
    <p>
      Online:{" "}
      {[...online.entries()].map(([id, email]) => (
        <span key={id}>{id === selfId ? "you" : email} </span>
      ))}
      {online.size === 0 && "just you"}
    </p>
  );
}
