import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Taskline</h1>
      <p>Kanban boards with room chat and WebRTC voice.</p>
      <p>
        <Link href="/login">Login</Link> · <Link href="/signup">Sign up</Link> ·{" "}
        <Link href="/boards">Boards</Link>
      </p>
    </main>
  );
}
