import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axiosClient";
import {
  addToCart,
  updateQuantity,
  clearCart,
  selectCartSummary,
} from "../../features/cart/cartSlice";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, TicketPercent } from "lucide-react";

export default function NewOrderPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const { items, subtotal } = useSelector(selectCartSummary);

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    load();
  }, []);

  useEffect(() => {
    const doPreview = async () => {
      if (items.length === 0) {
        setPreview(null);
        return;
      }
      setPreviewLoading(true);
      try {
        const payload = {
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        };
        const { data } = await api.post("/orders/preview", payload);
        setPreview(data);
      } catch (err) {
        setPreview(null);
        toast.error("Failed to preview order");
      } finally {
        setPreviewLoading(false);
      }
    };
    doPreview();
  }, [items]);

  const handleCreateOrder = async () => {
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };
      await api.post("/orders", payload);
      toast.success("Order created successfully");
      dispatch(clearCart());
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="p-2 md:p-0 space-y-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-slate-900 shadow-md shadow-emerald-500/40">
              <ShoppingBag className="h-4 w-4" />
            </span>
            Create New Order
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add products on the left, see live discounts and grand total on the
            right.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-600/70 text-slate-200 hover:bg-slate-800/80 transition-all duration-150"
          >
            Clear cart
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            Products
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-700/70 text-slate-300">
              {products.length} available
            </span>
          </h2>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {products.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.01, translateY: -2 }}
                className="bg-slate-900/70 border border-slate-700/70 rounded-xl p-3 flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {p.description} • {p.unit_weight_grams}g
                  </p>
                  <p className="text-sm font-semibold mt-1 text-emerald-400">
                    {p.price} tk <span className="text-[11px]">/ unit</span>
                  </p>
                </div>
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-900 rounded-full text-xs font-medium shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  onClick={() => dispatch(addToCart(p))}
                >
                  Add
                </button>
              </motion.div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-slate-400">
                No products available or all disabled.
              </p>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            Cart
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-700/70 text-slate-300">
              {items.length} item{items.length !== 1 && "s"}
            </span>
          </h2>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {items.length === 0 && (
              <p className="text-sm text-slate-400">
                Cart is empty. Start by adding a product.
              </p>
            )}
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                className="bg-slate-900/70 border border-slate-700/70 rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {quantity} × {product.price} tk
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button
                    className="border border-slate-700/80 px-2 rounded-full h-7 w-7 flex items-center justify-center hover:bg-slate-800/80 transition-colors"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: product.id,
                          quantity: quantity - 1,
                        })
                      )
                    }
                  >
                    -
                  </button>
                  <span className="w-5 text-center">{quantity}</span>
                  <button
                    className="border border-slate-700/80 px-2 rounded-full h-7 w-7 flex items-center justify-center hover:bg-slate-800/80 transition-colors"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: product.id,
                          quantity: quantity + 1,
                        })
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            layout
            className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 space-y-2 shadow-lg shadow-emerald-500/10"
          >
            <p className="font-semibold text-sm">
              Subtotal (without promo):{" "}
              <span className="text-emerald-400">{subtotal.toFixed(2)} tk</span>
            </p>

            {previewLoading && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Calculating discount...
              </p>
            )}

            {preview && !previewLoading && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-emerald-300">
                    <TicketPercent className="h-4 w-4" />
                    <span>Discount</span>
                  </div>
                  <span>-{preview.totalDiscount.toFixed(2)} tk</span>
                </div>
                <p className="font-semibold text-sm flex items-center justify-between">
                  <span>Grand total</span>
                  <span className="text-lg text-emerald-400">
                    {preview.grandTotal.toFixed(2)} tk
                  </span>
                </p>
                {preview.appliedPromotions.length > 0 ? (
                  <div className="text-[11px] text-slate-300">
                    <p className="font-semibold mb-1 flex items-center gap-1">
                      <TicketPercent className="h-3.5 w-3.5" />
                      Promotions applied
                    </p>
                    <ul className="list-disc ml-4 space-y-0.5">
                      {preview.appliedPromotions.map((p) => (
                        <li key={p.id}>
                          {p.title} ({p.type}) – saved{" "}
                          {p.totalDiscount.toFixed(2)} tk
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    No promotions applied to this cart.
                  </p>
                )}
              </>
            )}

            <button
              disabled={items.length === 0}
              onClick={handleCreateOrder}
              className="w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 text-slate-900 rounded-lg py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              Place Order
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
