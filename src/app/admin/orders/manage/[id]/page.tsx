"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./OrderDetails.module.css";

export default function OrderDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [orderData, setOrderData] = useState({
    request: false,
    requestTime: 0,
    duedate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const res = await fetch(`/api/admin/get-order/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrderData(data);
        } else {
          setError("Failed to fetch order data");
        }
      } catch (err) {
        setError("An error occurred");
      }
      setLoading(false);
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const handleDecision = async (grant: boolean) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const res = await fetch(`/api/admin/extend-order/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grant }),
      });

      if (res.ok) {
        // Refresh the data after a successful update
        const updatedData = await res.json();
        setOrderData(updatedData);
      } else {
        setError("An error occurred while processing the request.");
      }
    } catch (err) {
      setError("An error occurred");
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const { request, requestTime, duedate } = orderData;

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Order Management</h2>
        <div className={styles.info}>
          <p>Current Due Date: {new Date(duedate).toLocaleString()}</p>
          {request ? (
            <div>
              <p>There is an extended request for this order.</p>
              <p>Request Time: {requestTime} Days</p>
              <div className={styles.buttons}>
                <button className={`${styles.grantButton} ${styles.button}`} onClick={() => handleDecision(true)} disabled={loading}>
                  Grant Request
                </button>
                <button className={`${styles.denyButton} ${styles.button}`} onClick={() => handleDecision(false)} disabled={loading}>
                  Deny Request
                </button>
              </div>
            </div>
          ) : (
            <p>There is no extended request for this order.</p>
          )}
        </div>
      </div>
    </div>
  );
}
