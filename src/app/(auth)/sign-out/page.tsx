"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button style={{ color: "white", backgroundColor: "black", textAlign: "center", height: "50px", width: "200px", borderRadius: "10px" }} onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
