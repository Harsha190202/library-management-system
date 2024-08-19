"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface Item {
  id: number;
  itemtype: string;
}

export default function Types() {
  const [type, setType] = useState<string>("");
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/get-types");
        const result: Item[] = await res.json();
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
      const res = await fetch("/api/admin/add-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemtype: type }),
      });
      const newItem: Item = await res.json();
      setData((prevData) => [...prevData, newItem]);
      setType("");
    } catch (error) {
      console.error("Error adding new type:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/delete-type`, {
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
        <h1>Give an input to place into types</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={(e) => setType(e.target.value)} placeholder="Insert a TYPE of item" value={type} />
          <button type="submit">Insert</button>
        </form>
      </div>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <div>{item.itemtype}</div>
            <button onClick={(event) => handleDelete(event, item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
