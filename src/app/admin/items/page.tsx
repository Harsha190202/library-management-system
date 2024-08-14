"use client";
import { useState, useEffect } from "react";
import styles from "./items.module.css";

export default function Items() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState<{ [key: number]: string }>({});
  const [types, setTypes] = useState<{ [key: number]: string }>({});
  const [filters, setFilters] = useState({
    name: "",
    categoryId: "",
    typeId: "",
  });
  const [loading, setLoading] = useState(false);

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
        throw new Error("response was not ok.");
      }

      const items = await res.json();
      setData(items);
    } catch (error) {
      console.error("Error fetching items:", error);
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
      {data.length > 0
        ? data.map((item: { id: number; name: string; author: string | null; image: string; rating: number; typeId: number; categoryId: number; quantity: number; numberOfRatings: number }) => (
            <div key={item.id}>
              <h2>{item.name}</h2>
              <img src={item.image} alt={item.name} style={{ maxWidth: "250px", height: "250px" }} />
              <p>Author: {item.author}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Category: {categories[item.categoryId] || "Unknown"}</p>
              <p>Type: {types[item.typeId] || "Unknown"}</p>
              <p>Rating: {item.rating}</p>
              <p>Number of Ratings: {item.numberOfRatings}</p>
            </div>
          ))
        : !loading && <p>No items available</p>}
    </section>
  );
}
