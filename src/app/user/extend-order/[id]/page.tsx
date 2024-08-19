"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ExtendOrder.module.css";

export default function ExtendOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [orderData, setOrderData] = useState<any>(null);
  const [extensionDays, setExtensionDays] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      const res = await fetch(`/api/admin/get-order/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
      } else {
        alert("Failed to fetch order data");
      }
      setLoading(false);
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/user/extend-order/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ extensionDays }),
    });

    if (res.ok) {
      alert("Order extended successfully");
      router.push(`/user`);
    } else {
      alert("An error occurred while extending the order.");
    }
    setLoading(false);
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (!orderData) {
    return <p>Order not found.</p>;
  }

  const { request, requestTime, duedate } = orderData;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Extend Order</h1>
      {request ? (
        <p className={styles.requestStatus}>There is already a request for this order. Current request duration: {requestTime} days.</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="itemName">Item Name:</label>
            <input type="text" id="itemName" value={orderData.item.name} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate">Current Due Date:</label>
            <input type="text" id="dueDate" value={new Date(orderData.duedate).toLocaleDateString()} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="extensionDays">Number of Days for Extension:</label>
            <input type="number" id="extensionDays" value={extensionDays} onChange={(e) => setExtensionDays(Number(e.target.value))} min="1" required />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Submitting..." : "Extend Order"}
          </button>
        </form>
      )}
    </div>
  );
}
