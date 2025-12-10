import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../features/orders/orderSlice";
import { motion } from "framer-motion";
import { ReceiptText, TicketPercent, Wallet } from "lucide-react";

export default function UserOrdersPage() {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const summary = useMemo(() => {
    const count = myOrders.length;
    const spent = myOrders.reduce(
      (sum, o) => sum + Number(o.grand_total || 0),
      0
    );
    const saved = myOrders.reduce(
      (sum, o) => sum + Number(o.total_discount || 0),
      0
    );
    return { count, spent, saved };
  }, [myOrders]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-slate-900 shadow-md shadow-emerald-500/40">
              <ReceiptText className="h-4 w-4" />
            </span>
            My Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your spending and see how much you saved with promotions.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total Orders</span>
            <ReceiptText className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-50 mt-1">
            {summary.count}
          </p>
        </div>
        <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total Spent</span>
            <Wallet className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <p className="text-2xl font-semibold text-emerald-400 mt-1">
            {summary.spent.toFixed(2)}{" "}
            <span className="text-xs text-slate-400">tk</span>
          </p>
        </div>
        <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total Saved</span>
            <TicketPercent className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <p className="text-2xl font-semibold text-amber-300 mt-1">
            {summary.saved.toFixed(2)}{" "}
            <span className="text-xs text-slate-400">tk</span>
          </p>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-300">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900/80 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700/70 overflow-hidden"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr className="text-xs uppercase tracking-wide text-slate-300">
              <th className="px-3 py-2 text-left">Order ID</th>
              <th className="px-3 py-2 text-left">Subtotal</th>
              <th className="px-3 py-2 text-left">Discount</th>
              <th className="px-3 py-2 text-left">Grand total</th>
              <th className="px-3 py-2 text-left">Created at</th>
            </tr>
          </thead>
          <tbody className="bg-slate-950/60">
            {myOrders.map((o, idx) => (
              <tr
                key={o.id}
                className={`border-t border-slate-800/80 ${
                  idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-950/20"
                } hover:bg-slate-900/60 transition-colors`}
              >
                <td className="px-3 py-2">#{o.id}</td>
                <td className="px-3 py-2">{o.subtotal} tk</td>
                <td className="px-3 py-2 text-amber-300">
                  -{o.total_discount} tk
                </td>
                <td className="px-3 py-2 font-semibold text-emerald-400">
                  {o.grand_total} tk
                </td>
                <td className="px-3 py-2 text-[11px] text-slate-400">
                  {new Date(o.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {myOrders.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  You have no orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
