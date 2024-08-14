"use client";
import styles from "./signup.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    if (res.ok) {
      router.push("/sign-in");
    } else {
      const response = await res.json();
      setSubmitError(response.error || "An error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src="/books.jfif" alt="books" width={300} height={300} />
      </div>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <h1>Library Management System</h1>
        <div className={styles.tabs}>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={formData.username} onChange={handleChange} />
        </div>
        <div className={styles.tabs}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className={styles.tabs}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className={styles.tabs}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
          <button className={styles.button} type="submit">
            Sign Up
          </button>
        </div>
        {submitError && <p>{submitError}</p>}

        <h3>
          If you already have an account{" "}
          <Link href="/sign-in" style={{ color: "blue" }}>
            Sign in here
          </Link>
        </h3>
      </form>
    </div>
  );
}
