"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserPage.module.css";
import { useSession } from "next-auth/react";

export default function UserPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        alert("Failed to fetch user data");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>User not found.</p>;
  }

  const handleExtend = (id: number) => {
    router.push(`/user/extend-order/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{userData.username}&apos;s Orders</h1>
      <p>Email: {userData.email}</p>

      <h2 className={styles.subheading}>Order History</h2>
      {userData.orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className={styles.orderList}>
          {userData.orders.map((order: any) => (
            <li key={order.id} className={`${styles.orderItem} ${order.pending ? styles.pending : styles.completed}`}>
              <p>Order ID: {order.id}</p>
              <p>Item Name:{order.item.name}</p>
              <p>Due Date: {new Date(order.duedate).toLocaleDateString()}</p>
              <p>Request Time: {order.requestTime} Days</p>
              {order.request ? <p className={styles.request}>Request for extension pending</p> : <p className={styles.noRequest}>No request for extension</p>}
              {order.pending && (
                <button onClick={() => handleExtend(order.id)} className={styles.pendingbutton}>
                  Extend Order
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
