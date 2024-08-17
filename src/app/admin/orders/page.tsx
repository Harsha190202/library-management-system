"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./order.module.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  async function fetchOrders() {
    const response = await fetch("/api/admin/get-orders");
    const data = await response.json();
    setOrders(data);
    setLoading(false);
  }

  async function handleReceived(orderId: number) {
    try {
      const response = await fetch("/api/admin/order-received", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        await fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("An error occurred:", error);
      alert("Failed to update order.");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (filterId) {
      filtered = filtered.filter((order: { id: number }) => order.id.toString().includes(filterId));
    }

    if (filterStatus !== "all") {
      const status = filterStatus === "true";
      filtered = filtered.filter((order: { pending: boolean }) => order.pending === status);
    }

    setFilteredOrders(filtered);
  }, [filterId, filterStatus, orders]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.filterContainer}>
        <input type="text" placeholder="Filter by Order ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} className={styles.filterInput} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={styles.filterSelect}>
          <option value="all">All</option>
          <option value="true">Pending</option>
          <option value="false">Completed</option>
        </select>
      </div>

      {filteredOrders.map((order: { id: number; duedate: string; pending: boolean }) => (
        <div key={order.id} className={`${styles.orderItem} ${order.pending ? styles.orderItemPending : ""}`}>
          <div>
            <h2>Order ID: {order.id}</h2>
            <p>Due Date: {new Date(order.duedate).toLocaleDateString()}</p>
            <p>Status: {order.pending ? "Pending" : "Completed"}</p>
          </div>

          <Link href={`/orders/manage/${order.id}`} className={styles.orderLink}>
            Check Extend Request
          </Link>
          <button className={styles.orderButton} onClick={() => handleReceived(order.id)} disabled={!order.pending}>
            Item Received
          </button>
        </div>
      ))}
    </section>
  );
}
