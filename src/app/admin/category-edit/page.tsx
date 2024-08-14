"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface Category {
  id: number;
  name: string;
}

export default function Types() {
  const [category, setCategory] = useState<string>("");
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/get-categories");
        const result: Category[] = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/admin/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: category }),
      });
      const newCategory: Category = await res.json();
      setData((prevData) => [...prevData, newCategory]);
      setCategory("");
    } catch (error) {
      console.error("Error adding new type:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/admin/delete-category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const result = await res.json();
        console.error("Failed to delete item:", result.error);
        return;
      }

      setData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <section>
      <div>
        <h1>Give an input to place into categories</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={(e) => setCategory(e.target.value)} placeholder="Insert a category / genre of item" value={category} />
          <button type="submit">Insert</button>
        </form>
      </div>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <div>{item.name}</div>
            <button onClick={(event) => handleDelete(event, item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
