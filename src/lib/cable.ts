import { createConsumer, type Subscription } from "@rails/actioncable";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface PresenceEvent {
  event: "joined" | "left";
  user: { id: number; email: string };
}

export interface ChatMessagePayload {
  message: {
    id: number;
    body: string;
    created_at: string;
    user: { id: number; email: string };
  };
}

export interface SignalPayload {
  from: number;
  type: string;
  payload: unknown;
}

export function connectCable(token: string) {
  return createConsumer(`${API_URL.replace("http", "ws")}/cable?token=${encodeURIComponent(token)}`);
}

export function subscribePresence(
  consumer: ReturnType<typeof createConsumer>,
  boardId: number,
  onEvent: (event: PresenceEvent) => void,
): Subscription {
  return consumer.subscriptions.create(
    { channel: "PresenceChannel", board_id: boardId },
    { received: (data: PresenceEvent) => onEvent(data) },
  );
}

export function subscribeRoom(
  consumer: ReturnType<typeof createConsumer>,
  boardId: number,
  roomId: number,
  handlers: { received?: (data: ChatMessagePayload) => void },
): Subscription {
  return consumer.subscriptions.create(
    { channel: "RoomChannel", board_id: boardId, room_id: roomId },
    { received: (data: ChatMessagePayload) => handlers.received?.(data) },
  );
}

export function speak(subscription: Subscription, body: string): void {
  subscription.perform("speak", { body });
}
