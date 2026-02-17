"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data.orders || []);
    } catch (err) {
        console.error("Failed to fetch orders", err);
    } finally {
        setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
      try {
          const res = await fetch("/api/admin/orders", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, status: newStatus }),
          });
          
          if (!res.ok) throw new Error("Failed to update");
          
          toast.success("Order status updated");
          fetchOrders(); // Refresh
      } catch (err) {
          toast.error("Failed to update status");
      }
  };

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
      </div>
      
      <div className="rounded-md border bg-white">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order #</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Total</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
                {orders.map((order) => (
                    <tr key={order._id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{order.orderNumber}</td>
                        <td className="p-4 align-middle">{order.email}</td>
                        <td className="p-4 align-middle">
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="p-4 align-middle">
                            <select 
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </td>
                        <td className="p-4 align-middle text-right font-medium">
                            ${order.total.toFixed(2)}
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
           {orders.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
