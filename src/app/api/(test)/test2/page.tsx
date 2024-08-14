"use client";

import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div>
      <h2>{session?.user.username}</h2>
      <h3>{session?.user.email}</h3>
      <h3>{session?.user.role}</h3>
    </div>
  );
}
