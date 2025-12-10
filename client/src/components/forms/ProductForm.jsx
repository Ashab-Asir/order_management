import { useState, useEffect } from "react";

export default function ProductForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit_weight_grams: "",
    is_enabled: true,
  });

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        description: initialValue.description || "",
        price: initialValue.price,
        unit_weight_grams: initialValue.unit_weight_grams,
        is_enabled: Boolean(initialValue.is_enabled),
      });
    }
  }, [initialValue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      unit_weight_grams: Number(form.unit_weight_grams),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Price (tk)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Unit weight (grams)</label>
          <input
            type="number"
            name="unit_weight_grams"
            value={form.unit_weight_grams}
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
      <div className="flex gap-2 justify-end">
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
