import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  Percent,
  ListChecks,
  LogOut,
} from "lucide-react";

export default function Layout({ children }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-900 shadow-md shadow-emerald-400/40"
      : "text-slate-200 hover:bg-white/5 hover:text-white";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      <Toaster position="top-right" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-white"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/40">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span>Order Management</span>
              <span className="text-[11px] text-slate-400">
                Smart promos • Smooth checkout
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden sm:flex flex-col items-end text-xs">
                  <span className="text-slate-200 font-medium">
                    {user?.name || user.email}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-emerald-400">
                    {user.role}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-xs font-semibold text-slate-900 shadow-md">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800/80 hover:border-emerald-500/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {user && (
        <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap gap-2 text-sm">
            <Link
              to="/orders/new"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${isActive(
                "/orders/new"
              )}`}
            >
              <ShoppingCart className="h-4 w-4" />
              New Order
            </Link>
            <Link
              to="/orders"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${isActive(
                "/orders"
              )}`}
            >
              <ListChecks className="h-4 w-4" />
              My Orders
            </Link>

            {user.role === "ADMIN" && (
              <>
                <Link
                  to="/admin/products"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${isActive(
                    "/admin/products"
                  )}`}
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  to="/admin/promotions"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${isActive(
                    "/admin/promotions"
                  )}`}
                >
                  <Percent className="h-4 w-4" />
                  Promotions
                </Link>
                <Link
                  to="/admin/orders"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${isActive(
                    "/admin/orders"
                  )}`}
                >
                  <ListChecks className="h-4 w-4" />
                  All Orders
                </Link>
              </>
            )}
          </div>
        </nav>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pb-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
