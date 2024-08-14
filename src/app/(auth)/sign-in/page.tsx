"use client";
import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import quotes from "@/Lib/quotes";
import { signIn } from "next-auth/react";

export default function Login() {
  const [flag, setFlag] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<string>("");
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const random = Math.floor(Math.random() * quotes.length);
    setSelectedQuote(quotes[random]);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = formdata;

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError(res.error === "Configuration" ? "Invalid username or password." : res.error);
    } else {
      setError(null);
      router.push("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <section className={styles.quote}>
        <div>{selectedQuote}</div>
      </section>
      <section className={styles.form}>
        <form className={styles.formdata} onSubmit={handleSubmit}>
          <h2>Username</h2>
          <input type="text" id="username" onChange={handleChange} />
          <h2>Password</h2>
          <div className={styles.div}>
            <input type={flag ? "password" : "text"} id="password" onChange={handleChange} />
            <span onClick={() => setFlag((prevFlag) => !prevFlag)}>{flag ? "Show" : "Hide"}</span>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit">Sign In</button>
        </form>
        <h5>
          If you don&apos;t have an account please{" "}
          <Link style={{ color: "blue" }} href="/sign-up">
            Sign Up
          </Link>
        </h5>
      </section>
    </div>
  );
}
