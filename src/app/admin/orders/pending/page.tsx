"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./PendingOrders.module.css";

export default function PendingOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      const res = await fetch("/api/admin/pending-orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        alert("Failed to fetch pending orders");
      }
      setLoading(false);
    };

    fetchPendingOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Pending Orders</h2>
      {orders.length === 0 ? (
        <p>No pending orders at the moment.</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <p>Order ID: {order.id}</p>
              <p>Username: {order.user.username}</p>
              <p>Item Name:{order.item.name}</p>
              <p>Due Date:{new Date(order.duedate).toLocaleDateString()}</p>
              <Link href={`/admin/orders/manage/${order.id}`} className={styles.orderLink}>
                Manage Order
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
