"use client";
import { useState, useEffect } from "react";
import styles from "./order.module.css";
import { useRouter } from "next/navigation";

export default function Items() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState<{ [key: number]: string }>({});
  const [types, setTypes] = useState<{ [key: number]: string }>({});
  const [selectedid, setSelectedid] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    name: "",
    categoryId: "",
    typeId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/inventory/get-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!res.ok) {
        throw new Error("Response was not ok.");
      }

      const items = await res.json();
      setData(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/insert-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, selectedid }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to place order.");
      }

      setMessage(result.message || "Order placed successfully");
      setTimeout(() => {
        setMessage(null);
      }, 5000);

      setUsername("");
      setSelectedid(0);
    } catch (error: any) {
      setMessage(error.message || "Error placing order.");

      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await fetch("/api/admin/get-categories");
        if (!categoryRes.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryRes.json();
        const categoryMap = categoryData.reduce((map: any, category: any) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCategories(categoryMap);

        const typeRes = await fetch("/api/admin/get-types");
        if (!typeRes.ok) throw new Error("Failed to fetch types");
        const typeData = await typeRes.json();
        const typeMap = typeData.reduce((map: any, type: any) => {
          map[type.id] = type.itemtype;
          return map;
        }, {});
        setTypes(typeMap);

        await handleSubmit(new Event("submit") as any);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.section}>
      <form className={styles.orderform} onSubmit={handlePlaceOrder}>
        <h1>Select one book from below to rent it:</h1>
        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <h3>SELECTED BOOK ID: {selectedid}</h3>
        <button className={styles.button} disabled={loading} type="submit">
          {loading ? "Page Load..." : "Place Order"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" placeholder="Book Name" value={filters.name} onChange={handleChange} />

        <select name="categoryId" value={filters.categoryId} onChange={handleChange}>
          <option value="">Select Category</option>
          {Object.entries(categories).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select name="typeId" value={filters.typeId} onChange={handleChange}>
          <option value="">Select Type</option>
          {Object.entries(types).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <button type="submit">Filter</button>
      </form>

      {loading && <p>Loading...</p>}
      <section className={styles.grid}>
        {data.length > 0
          ? data
              .filter((item: { quantity: number }) => item.quantity > 0)
              .map((item: { id: number; name: string; author: string | null; image: string; rating: number; typeId: number; categoryId: number; quantity: number; numberOfRatings: number }) => (
                <div key={item.id} className={`${styles.item} ${selectedid === item.id ? styles.selecteditem : ""}`} onClick={() => setSelectedid(item.id)}>
                  <h2>{item.name}</h2>
                  <img src={item.image} alt={item.name} style={{ width: "200px", height: "250px" }} />
                  <p>Category: {categories[item.categoryId] || "Unknown"}</p>
                  <p>Type: {types[item.typeId] || "Unknown"}</p>
                  {item.numberOfRatings > 0 && <p> Rating: {item.rating} </p>}
                </div>
              ))
          : !loading && <p>No items available</p>}
      </section>
    </section>
  );
}
