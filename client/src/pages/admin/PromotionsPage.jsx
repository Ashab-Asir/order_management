import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminPromotions,
  createPromotion,
} from "../../features/promotions/promotionSlice";
import PromotionForm from "../../components/forms/PromotionForm";
import api from "../../api/axiosClient";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Percent, PlusCircle, ToggleLeft, ToggleRight } from "lucide-react";

export default function PromotionsPage() {
  const dispatch = useDispatch();
  const { adminList, loading, error } = useSelector((s) => s.promotions);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminPromotions());
  }, [dispatch]);

  const handleCreate = (data) => {
    dispatch(createPromotion(data))
      .unwrap()
      .then(() => {
        toast.success("Promotion created");
        setShowCreateForm(false);
      })
      .catch((err) => {
        toast.error(err || "Failed to create promotion");
      });
  };

  const handleToggle = async (promo) => {
    try {
      await api.patch(`/promotions/${promo.id}/enabled`, {
        is_enabled: !promo.is_enabled,
      });
      toast.success(
        !promo.is_enabled ? "Promotion enabled" : "Promotion disabled"
      );
      dispatch(fetchAdminPromotions());
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update promotion status"
      );
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/promotions/${editingPromo.id}`, {
        title: editingPromo.title,
        start_date: editingPromo.start_date,
        end_date: editingPromo.end_date,
        is_enabled: editingPromo.is_enabled,
      });
      toast.success("Promotion updated");
      setEditingPromo(null);
      dispatch(fetchAdminPromotions());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update promotion");
    }
  };

  const handleChangeEdit = (field, value) => {
    setEditingPromo((prev) => ({ ...prev, [field]: value }));
  };

  const renderTypeBadge = (p) => {
    if (p.type === "WEIGHTED")
      return (
        <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/40">
          Weighted (Slabs)
        </span>
      );
    if (p.type === "PERCENTAGE")
      return (
        <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
          Percentage
        </span>
      );
    return (
      <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/40">
        Fixed / item
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-slate-900 shadow-md shadow-emerald-500/40">
              <Percent className="h-4 w-4" />
            </span>
            Promotions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure discount rules and control active promo windows.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-900 rounded-full text-sm font-medium shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4" />
          Add Promotion
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
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Value / Slabs</th>
              <th className="px-3 py-2 text-left">Window</th>
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
                  <div className="font-medium text-slate-50">{p.title}</div>
                  {p.type === "WEIGHTED" && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {p.slabs?.length || 0} slab
                      {p.slabs?.length === 1 ? "" : "s"} configured
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">{renderTypeBadge(p)}</td>
                <td className="px-3 py-2 text-sm">
                  {p.type === "WEIGHTED"
                    ? "Weighted slabs"
                    : p.type === "PERCENTAGE"
                    ? `${p.value}%`
                    : `${p.value} tk / item`}
                </td>
                <td className="px-3 py-2 text-[11px] text-slate-300">
                  {new Date(p.start_date).toLocaleString()} <br />
                  {new Date(p.end_date).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  {p.is_enabled ? (
                    <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[11px] px-2 py-1 rounded-full bg-slate-700/40 text-slate-200 border border-slate-500/60">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    className="text-xs px-3 py-1.5 border border-slate-600/70 rounded-full text-slate-100 hover:bg-slate-800/80 transition-colors"
                    onClick={() => setEditingPromo(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-slate-600/70 hover:bg-slate-800/80 transition-colors"
                    onClick={() => handleToggle(p)}
                  >
                    {p.is_enabled ? (
                      <>
                        <ToggleRight className="h-3.5 w-3.5 text-emerald-400" />
                        Disable
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-3.5 w-3.5 text-slate-300" />
                        Enable
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {adminList.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="6"
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  No promotions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 w-full max-w-xl shadow-2xl shadow-emerald-500/20"
          >
            <h2 className="font-semibold mb-4">Create Promotion</h2>
            <PromotionForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
            />
          </motion.div>
        </div>
      )}

      {editingPromo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 w-full max-w-md shadow-2xl shadow-emerald-500/20"
          >
            <h2 className="font-semibold mb-4">Edit Promotion</h2>
            <form className="space-y-3" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  className="w-full border border-slate-700/80 bg-slate-900/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                  value={editingPromo.title}
                  onChange={(e) => handleChangeEdit("title", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Start date</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-slate-700/80 bg-slate-900/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                    value={editingPromo.start_date.slice(0, 16)}
                    onChange={(e) =>
                      handleChangeEdit("start_date", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">End date</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-slate-700/80 bg-slate-900/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                    value={editingPromo.end_date.slice(0, 16)}
                    onChange={(e) =>
                      handleChangeEdit("end_date", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editingPromo.is_enabled}
                  onChange={(e) =>
                    handleChangeEdit("is_enabled", e.target.checked)
                  }
                />
                <span className="text-sm">Enabled</span>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPromo(null)}
                  className="px-3 py-1.5 rounded-full border border-slate-700/80 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-900 text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
