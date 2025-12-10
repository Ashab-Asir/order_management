
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders } from "../../features/orders/orderSlice";
import { ClipboardList, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { adminOrders, loading, error } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminOrders());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/40">
              <ClipboardList className="h-4 w-4 text-slate-950" />
            </span>
            <h1 className="text-xl font-semibold text-slate-50">All Orders</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Monitor all user orders, discounts applied, and total revenue.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-teal-500/40 transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60"
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && <p className="text-sm text-slate-300">Loading orders...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="mt-2 rounded-2xl border border-slate-800/80 bg-[#020617] shadow-[0_0_0_1px_rgba(15,23,42,0.9)] overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr className="text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Subtotal</th>
              <th className="px-4 py-2 text-left">Discount</th>
              <th className="px-4 py-2 text-left">Grand total</th>
              <th className="px-4 py-2 text-left">Created at</th>
            </tr>
          </thead>
          <tbody>
            {adminOrders.map((o, idx) => (
              <tr
                key={o.id}
                className={`border-t border-slate-800/70 ${
                  idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-950/20"
                } hover:bg-slate-900/60 transition-colors`}
              >
                <td className="px-4 py-3 text-slate-100 font-medium">
                  #{o.id}
                </td>

                <td className="px-4 py-3 text-xs text-slate-300">
                  {o.user_id}
                </td>

                <td className="px-4 py-3 text-slate-200">
                  {Number(o.subtotal).toFixed(2)}{" "}
                  <span className="text-xs text-slate-400">tk</span>
                </td>

                <td className="px-4 py-3 text-emerald-300">
                  -{Number(o.total_discount).toFixed(2)}{" "}
                  <span className="text-xs text-emerald-200/80">tk</span>
                </td>

                <td className="px-4 py-3 font-semibold text-teal-300">
                  {Number(o.grand_total).toFixed(2)}{" "}
                  <span className="text-xs text-teal-200/80">tk</span>
                </td>

                <td className="px-4 py-3 text-[11px] text-slate-400">
                  {new Date(o.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {adminOrders.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No orders have been placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
