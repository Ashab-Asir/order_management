import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
} from "../../features/products/productSlice";
import ProductForm from "../../components/forms/ProductForm";
import { motion } from "framer-motion";
import { Package, PlusCircle } from "lucide-react";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { adminList, loading, error } = useSelector((s) => s.products);
  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
  };

  const openEdit = (product) => {
    setMode("edit");
    setSelected(product);
  };

  const closeForm = () => {
    setMode(null);
    setSelected(null);
  };

  const handleSubmit = (data) => {
    if (mode === "create") {
      dispatch(createProduct(data)).then(() => closeForm());
    } else if (mode === "edit" && selected) {
      dispatch(updateProduct({ id: selected.id, data })).then(() =>
        closeForm()
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-slate-900 shadow-md shadow-emerald-500/40">
              <Package className="h-4 w-4" />
            </span>
            Products
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your catalog: prices, weights, and availability.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-900 rounded-full text-sm font-medium shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4" />
          Add Product
        </button>
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
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Unit weight</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-slate-950/60">
            {adminList.map((p, idx) => (
              <tr
                key={p.id}
                className={`border-t border-slate-800/80 ${
                  idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-950/20"
                } hover:bg-slate-900/60 transition-colors`}
              >
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-50">{p.name}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {p.description}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className="text-emerald-300 font-semibold">
                    {p.price} tk
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-300">
                  {p.unit_weight_grams} g
                </td>
                <td className="px-3 py-2">
                  {p.is_enabled ? (
                    <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                      • Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-slate-700/40 text-slate-200 border border-slate-500/60">
                      • Disabled
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    className="text-xs px-3 py-1.5 border border-slate-600/70 rounded-full text-slate-100 hover:bg-slate-800/80 transition-colors"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {adminList.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {mode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 w-full max-w-lg shadow-2xl shadow-emerald-500/20"
          >
            <h2 className="font-semibold mb-4 text-lg">
              {mode === "create" ? "Create Product" : "Edit Product"}
            </h2>
            <ProductForm
              initialValue={selected}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
