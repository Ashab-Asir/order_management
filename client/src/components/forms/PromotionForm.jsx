import { useState } from "react";

const emptySlab = {
  min_weight_kg: "",
  max_weight_kg: "",
  discount_per_unit: "",
};

export default function PromotionForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    type: "PERCENTAGE",
    value: "",
    start_date: "",
    end_date: "",
    is_enabled: true,
  });

  const [slabs, setSlabs] = useState([emptySlab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSlabChange = (index, field, value) => {
    setSlabs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addSlab = () => setSlabs((prev) => [...prev, emptySlab]);
  const removeSlab = (i) =>
    setSlabs((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      value: form.type === "WEIGHTED" ? null : Number(form.value),
      start_date: form.start_date,
      end_date: form.end_date,
      slabs:
        form.type === "WEIGHTED"
          ? slabs
              .filter((s) => s.min_weight_kg && s.discount_per_unit)
              .map((s) => ({
                min_weight_kg: Number(s.min_weight_kg),
                max_weight_kg: s.max_weight_kg ? Number(s.max_weight_kg) : null,
                discount_per_unit: Number(s.discount_per_unit),
              }))
          : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed amount per item</option>
            <option value="WEIGHTED">Weighted (slabs)</option>
          </select>
        </div>

        {form.type !== "WEIGHTED" && (
          <div>
            <label className="block text-sm mb-1">
              {form.type === "PERCENTAGE" ? "Percent (%)" : "Fixed amount"}
            </label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Start date</label>
          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End date</label>
          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_enabled"
          name="is_enabled"
          checked={form.is_enabled}
          onChange={handleChange}
        />
        <label htmlFor="is_enabled" className="text-sm">
          Enabled
        </label>
      </div>

      {form.type === "WEIGHTED" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">Weight slabs</p>
            <button
              type="button"
              onClick={addSlab}
              className="text-xs px-2 py-1 border rounded-lg"
            >
              + Add slab
            </button>
          </div>
          {slabs.map((slab, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 items-end border rounded-lg p-2"
            >
              <div>
                <label className="block text-xs mb-1">Min (kg)</label>
                <input
                  type="number"
                  value={slab.min_weight_kg}
                  onChange={(e) =>
                    handleSlabChange(index, "min_weight_kg", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Max (kg)</label>
                <input
                  type="number"
                  value={slab.max_weight_kg}
                  onChange={(e) =>
                    handleSlabChange(index, "max_weight_kg", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="empty = no limit"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">
                  Discount per 500g (tk)
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={slab.discount_per_unit}
                    onChange={(e) =>
                      handleSlabChange(
                        index,
                        "discount_per_unit",
                        e.target.value
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                  {slabs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlab(index)}
                      className="text-xs px-2 py-1 border rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-slate-900 text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}
