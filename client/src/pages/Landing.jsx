import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BrainCircuit, MapPinned, ShieldCheck, Sparkles, Truck, WalletCards } from "lucide-react";

const features = [
  ["P2P rentals", "Owners list unused bikes and cars while customers book nearby verified vehicles."],
  ["Doorstep delivery", "Riders pick up from owners and deliver to the customer's live location."],
  ["AI operations", "Recommendations, dynamic pricing, fraud scoring, demand prediction, and rider matching."],
  ["Secure handover", "OTP verification, role permissions, reviews, deposits, and admin verification."]
];

export default function Landing() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="glass inline-flex rounded-full px-4 py-2 text-sm font-bold text-mint">
            AI-powered vehicle rental and delivery
          </span>
          <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
            Rent the right ride, delivered to your door.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/65">
            RideBridge connects customers, vehicle owners, and delivery riders through a smart MERN platform built for real urban mobility problems.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="btn-primary" to="/vehicles">
              Explore vehicles
            </Link>
            <Link className="btn-ghost" to="/register">
              List your vehicle
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="glass relative rounded-[2rem] p-5 shadow-glow"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <img
            className="h-[30rem] w-full rounded-[1.5rem] object-cover"
            src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1100&q=80"
            alt="Car rental"
          />
          <div className="absolute -bottom-6 left-8 right-8 grid grid-cols-3 gap-3">
            {[
              [MapPinned, "Live ETA"],
              [BrainCircuit, "AI Match"],
              [ShieldCheck, "OTP Safe"]
            ].map(([Icon, label]) => (
              <div key={label} className="glass rounded-2xl p-4 text-center font-bold">
                <Icon className="mx-auto mb-2 text-mint" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 md:grid-cols-4">
          {features.map(([title, text], index) => (
            <motion.div
              key={title}
              className="glass rounded-3xl p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Sparkles className="mb-6 text-mint" />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm text-white/60">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="ai" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="glass grid gap-8 rounded-[2rem] p-8 md:grid-cols-3">
          {[
            [BrainCircuit, "Recommendation and dynamic pricing engine"],
            [Truck, "AI rider assignment with route-aware scoring"],
            [WalletCards, "Fraud alerts, demand prediction, and smart support"]
          ].map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-4 text-lg font-bold">
              <Icon className="text-mint" size={34} /> {text}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
