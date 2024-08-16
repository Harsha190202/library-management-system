"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./item-edit.module.css";

export default function EditItemPage() {
  const router = useRouter();
  const { id } = useParams();
  const [item, setItem] = useState({
    name: "",
    author: "",
    categoryId: 0,
    typeId: 0,
    quantity: 0,
    rating: 0,
    image: "",
  });
  const [pitem, setPitem] = useState({
    name: "",
    author: "",
    categoryId: 0,
    typeId: 0,
    quantity: 0,
    rating: 0,
    image: "",
  });
  const [categories, setCategories] = useState<{ [key: number]: string }>({});
  const [types, setTypes] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, categoryRes, typeRes] = await Promise.all([fetch(`/api/admin/inventory/get-item/${id}`), fetch("/api/admin/get-categories"), fetch("/api/admin/get-types")]);

        if (!itemRes.ok) throw new Error("Failed to fetch item data");
        if (!categoryRes.ok) throw new Error("Failed to fetch categories");
        if (!typeRes.ok) throw new Error("Failed to fetch types");

        const itemres = await itemRes.json();
        const itemData = itemres.item;

        const categoryData = await categoryRes.json();
        const typeData = await typeRes.json();

        const categoryMap = categoryData.reduce((map: any, category: any) => {
          map[category.id] = category.name;
          return map;
        }, {});
        const typeMap = typeData.reduce((map: any, type: any) => {
          map[type.id] = type.itemtype;
          return map;
        }, {});

        setItem(itemData);
        setPitem(itemData);
        setCategories(categoryMap);
        setTypes(typeMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem({
      ...item,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/inventory/edit-item/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        throw new Error("Failed to update item");
      }

      router.push("/admin/items");
    } catch (error) {
      console.log("Error updating item:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(item);
  return (
    <section className={styles.section}>
      <h1>Edit Item</h1>
      <div className={styles.container}>
        <div className={styles.previousContent}>
          <h4>Name: {pitem.name}</h4>
          <h4>Author: {pitem.author}</h4>
          <h4>Category: {categories[pitem.categoryId]}</h4>
          <h4>Type: {types[pitem.typeId]}</h4>
          <h4>Quantity: {pitem.quantity}</h4>
          <h2>Previous Item Details</h2>
        </div>
        <div className={styles.editForm}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h4>
              <input type="text" name="name" placeholder="Item Name" value={item.name} onChange={handleChange} required />
            </h4>
            <h4>
              <input type="text" name="author" placeholder="Author" value={item.author || ""} onChange={handleChange} />
            </h4>
            <h4>
              <select name="categoryId" value={item.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {Object.entries(categories).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </h4>
            <h4>
              <select name="typeId" value={item.typeId} onChange={handleChange} required>
                <option value="">Select Type</option>
                {Object.entries(types).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </h4>

            <h4>
              <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={handleChange} required />
            </h4>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Item"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
