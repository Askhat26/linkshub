import { useState } from "react";
import { motion } from "framer-motion";
import { useValidateCoupon } from "@/hooks/useApi";
import { paymentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Crown, X, ArrowLeft, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const plans = [
  { id: "starter", name: "Starter", price: 0, features: ["5 Links", "Basic themes", "Linkora badge"] },
  { id: "pro", name: "Pro", price: 499, features: ["Unlimited links", "All 20 themes", "15 layouts", "Analytics", "Custom domain", "No badge"], popular: true },
  { id: "premium", name: "Premium", price: 999, features: ["Everything in Pro", "Priority support", "Digital card", "10 card templates", "White label"] },
] as const;

const UpgradePage = () => {
  const [selected, setSelected] = useState<(typeof plans)[number]["id"]>("pro");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  const validateCoupon = useValidateCoupon();

  const selectedPlan = plans.find((p) => p.id === selected)!;
  const basePrice = selectedPlan.price;

  const finalPrice = appliedDiscount ? basePrice * (1 - appliedDiscount / 100) : basePrice;

  const handleApplyCoupon = () => {
    setCouponError("");

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    validateCoupon.mutate(code, {
      onSuccess: (res) => {
        setAppliedDiscount(res.data.discountPercent);
        setCouponCode(code);
        toast.success(`${res.data.discountPercent}% discount applied!`);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error || err?.response?.data?.message || "Invalid coupon";
        setCouponError(msg);
      },
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const code = couponCode.trim().toUpperCase();
      const couponToSend = appliedDiscount ? code : undefined;

      const res = await paymentsApi.createOrder(selected, couponToSend);

      toast.success("Order created! Redirecting to payment...");
      console.log("Order:", res.data);

      // TODO: open Razorpay here
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Failed to create order";
      toast.error(msg);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-foreground">Upgrade Your Plan</h1>
            <p className="text-sm text-muted-foreground mt-2">Unlock premium features for your profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  setSelected(plan.id);
                  setAppliedDiscount(null);
                  setCouponCode("");
                  setCouponError("");
                }}
                className={`text-left p-6 rounded-2xl border transition-all relative ${
                  selected === plan.id ? "border-primary glass glow-border" : "border-border glass hover:border-primary/30"
                }`}
              >
                {"popular" in plan && plan.popular && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-display font-bold text-foreground">{plan.name}</h3>
                <p className="text-2xl font-display font-bold text-foreground mt-2">
                  ₹{plan.price}
                  <span className="text-sm text-muted-foreground font-normal">/mo</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {selectedPlan.price > 0 && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-primary" /> Have a coupon code?
              </h3>

              {appliedDiscount ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div>
                    <p className="text-sm font-medium text-emerald-400">{appliedDiscount}% discount applied!</p>
                    <p className="text-xs text-muted-foreground">Code: {couponCode.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                    placeholder="Enter coupon code"
                    className="bg-secondary/50 uppercase flex-1"
                  />
                  <Button onClick={handleApplyCoupon} variant="outline" disabled={!couponCode.trim() || validateCoupon.isPending}>
                    {validateCoupon.isPending ? "..." : "Apply"}
                  </Button>
                </div>
              )}

              {couponError && <p className="text-xs text-destructive">{couponError}</p>}
            </div>
          )}

          {selectedPlan.price > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{selectedPlan.name} plan</span>
                  <span className="text-foreground">₹{basePrice}/mo</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-₹{((basePrice * appliedDiscount) / 100).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{finalPrice.toFixed(2)}/mo</span>
                </div>
              </div>

              <Button className="w-full mt-4 glow-primary gap-1.5" onClick={handleUpgrade} disabled={upgrading}>
                <Crown className="w-4 h-4" /> {upgrading ? "Processing..." : `Upgrade to ${selectedPlan.name}`}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UpgradePage;