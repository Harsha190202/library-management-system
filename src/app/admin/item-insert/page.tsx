"use client";

import { useEffect, useState } from "react";
import styles from "../item-insert/insert.module.css";

export default function Iteminsert() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    quantity: string;
    category: number | null;
    type: number | null;
    image: File | null;
  }>({
    title: "",
    author: "",
    quantity: "",
    category: null,
    type: null,
    image: null,
  });

  const [errors, setErrors] = useState<{
    title: string;
    quantity: string;
    category: string;
    type: string;
    image: string;
  }>({
    title: "",
    quantity: "",
    category: "",
    type: "",
    image: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/get-categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

    fetch("/api/admin/get-types")
      .then((response) => response.json())
      .then((data) => setTypes(data))
      .catch((error) => console.error("Error fetching types:", error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      quantity: "",
      category: "",
      type: "",
      image: "",
    };

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.image) newErrors.image = "Image is required";

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("author", formData.author);
      submissionData.append("quantity", formData.quantity);
      submissionData.append("category", String(formData.category));
      submissionData.append("type", String(formData.type));
      if (formData.image) {
        submissionData.append("image", formData.image, formData.image.name);
      }

      try {
        const response = await fetch("/api/admin/inventory/add-item", {
          method: "POST",
          body: submissionData,
        });

        if (response.ok) {
          setSuccessMessage("Item submitted successfully!");
          setErrorMessage(null);
          setFormData({
            title: "",
            author: "",
            quantity: "",
            category: null,
            type: null,
            image: null,
          });

          (document.getElementById("imageInput") as HTMLInputElement).value = "";

          const categoryRadio = document.querySelector(`input[name="category"]:checked`);
          const typeRadio = document.querySelector(`input[name="type"]:checked`);
          if (categoryRadio) (categoryRadio as HTMLInputElement).checked = false;
          if (typeRadio) (typeRadio as HTMLInputElement).checked = false;
        } else {
          setErrorMessage("Failed to submit item");
          setSuccessMessage(null);
        }
      } catch (error) {
        setErrorMessage("Error submitting form");
        setSuccessMessage(null);
      }
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <section className={styles.section}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.flexrow}>
          <h3>Title</h3>
          <input className={styles.inputtext} type="text" name="title" value={formData.title} onChange={handleInputChange} />
        </div>
        {errors.title && <p className={styles.error}>{errors.title}</p>}
        <div className={styles.flexrow}>
          <h3>Author</h3>
          <input className={styles.inputtext} type="text" name="author" value={formData.author} onChange={handleInputChange} />
        </div>

        <div className={styles.flexrow}>
          <h3>Quantity</h3>
          <input className={styles.inputtext} type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
        </div>
        {errors.quantity && <p className={styles.error}>{errors.quantity}</p>}

        <label className={styles.flexrow}>
          <h3 className={styles.image}>Image</h3>
          <input id="imageInput" type="file" accept=".png, .jpg, .jpeg, .webp" name="image" onChange={handleFileChange} />
        </label>
        {errors.image && <p className={styles.error}>{errors.image}</p>}

        <fieldset className={styles.fieldset}>
          <legend>Category</legend>
          <div className={styles.flexcolumn}>
            {categories.map((category: { id: number; name: string }) => (
              <label key={category.id} className={styles.labelType}>
                <input type="radio" name="category" value={category.id} onChange={handleRadioChange} className={styles.radioType} />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
        {errors.category && <p className={styles.error}>{errors.category}</p>}

        <fieldset className={styles.fieldset}>
          <legend>Type</legend>
          <div className={styles.flexcolumn}>
            {types.map((type: { id: number; itemtype: string }) => (
              <label key={type.id} className={styles.labelType}>
                <input type="radio" name="type" value={type.id} onChange={handleRadioChange} className={styles.radioType} />
                {type.itemtype}
              </label>
            ))}
          </div>
        </fieldset>
        {errors.type && <p className={styles.error}>{errors.type}</p>}

        <button type="submit" className={styles.button}>
          SUBMIT
        </button>

        <div className={styles.flexrow}>
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
      </form>
    </section>
  );
}
