export default function StatCard({ label, value, hint }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      {hint ? <p className="mt-2 text-sm text-mint">{hint}</p> : null}
    </div>
  );
}
