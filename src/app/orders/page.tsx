"use client";

import Loader from "@/components/Loader";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Added Link import
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[100px] pb-20 px-6 max-w-7xl mx-auto flex justify-center bg-[#080808]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-20 px-6 bg-[#080808] font-quicksand text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#C9B27B]">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <p className="text-gray-400 mb-6 text-lg">You have no orders yet.</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-[#C9B27B] text-black font-semibold rounded hover:bg-[#b09b6b] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-lg hover:border-[#C9B27B]/30 transition-colors"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-4 border-b border-zinc-800">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Placed</p>
                    <p className="font-medium text-white">
                      {format(new Date(order.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
                    <p className="font-mono text-sm text-zinc-300">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                    <p className="font-medium text-[#C9B27B]">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: order.currency || "USD",
                      }).format(order.total)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                        order.status === "delivered"
                          ? "bg-green-900/20 text-green-400 border-green-900/50"
                          : order.status === "cancelled"
                          ? "bg-red-900/20 text-red-400 border-red-900/50"
                          : "bg-blue-900/20 text-blue-400 border-blue-900/50"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm py-2">
                       <div className="flex items-center gap-3">
                            <span className="bg-zinc-800 text-zinc-400 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                                {item.quantity}
                            </span>
                            <span className="text-zinc-200">
                                {item.title}
                            </span>
                       </div>
                      <span className="font-medium text-zinc-400">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.currency || "USD",
                        }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
