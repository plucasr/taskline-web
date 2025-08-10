const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error ?? body.errors?.join(", ") ?? `Request failed: ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface Session {
  token: string;
  user: { id: number; email: string };
}

export function signup(email: string, password: string): Promise<Session> {
  return request<Session>("/api/v1/signup", undefined, {
    method: "POST",
    body: JSON.stringify({ email, password, password_confirmation: password }),
  });
}

export function login(email: string, password: string): Promise<Session> {
  return request<Session>("/api/v1/login", undefined, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface Board {
  id: number;
  name: string;
}

export interface Card {
  id: number;
  title: string;
  description?: string;
  position: number;
}

export interface BoardColumn {
  id: number;
  name: string;
  position: number;
  cards: Card[];
}

export interface BoardDetail extends Board {
  columns: BoardColumn[];
}

export function listBoards(token: string): Promise<Board[]> {
  return request<Board[]>("/api/v1/boards", token);
}

export function getBoard(token: string, id: number): Promise<BoardDetail> {
  return request<BoardDetail>(`/api/v1/boards/${id}`, token);
}

export function createBoard(token: string, name: string): Promise<Board> {
  return request<Board>("/api/v1/boards", token, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function createCard(token: string, boardId: number, columnId: number, title: string): Promise<Card> {
  return request<Card>(`/api/v1/boards/${boardId}/columns/${columnId}/cards`, token, {
    method: "POST",
    body: JSON.stringify({ title, position: 0 }),
  });
}
