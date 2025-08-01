const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface Board {
  id: number;
  name: string;
}

export async function listBoards(token: string): Promise<Board[]> {
  const response = await fetch(`${API_URL}/api/v1/boards`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to list boards: ${response.status}`);
  }
  return response.json() as Promise<Board[]>;
}
