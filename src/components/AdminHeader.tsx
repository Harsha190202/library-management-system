"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./adminheader.module.css";

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className={styles.header}>
      <section className={styles.logo}>
        <Link href="/">BOOKGROUND</Link>
      </section>
      <section className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/store">Store</Link>
      </section>
      <section className={styles.sign}>{status === "loading" ? <p>Loading...</p> : session ? <button onClick={handleLogout}>SIGN-OUT</button> : <Link href="/sign-in">SIGN-IN</Link>}</section>
    </nav>
  );
}
