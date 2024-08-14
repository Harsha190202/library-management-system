"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  const { data: session, status } = useSession();
  const handleLogout = () => signOut();

  return (
    <nav className={styles.header}>
      <section className={styles.logo}>
        <Link href="/">BOOKGROUND</Link>
      </section>
      <section className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/store">Store</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/user">User</Link>
        <Link href="/about-us">About-Us</Link>
      </section>
      <section className={styles.sign}>{session ? <button onClick={handleLogout}>SIGN-OUT</button> : <Link href="/sign-in">SIGN-IN</Link>}</section>
    </nav>
  );
}
