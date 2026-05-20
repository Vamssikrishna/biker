import { Car, MapPin, Sparkles, Star } from "lucide-react";

export default function VehicleCard({ vehicle, onBook }) {
  return (
    <article className="glass group overflow-hidden rounded-3xl">
      <div className="relative h-48 overflow-hidden">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />
        {vehicle.recommendationScore ? (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold">
            <Sparkles size={14} /> AI {vehicle.recommendationScore}
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-mint">{vehicle.type}</p>
            <h3 className="mt-1 text-xl font-black">
              {vehicle.brand} {vehicle.model}
            </h3>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">
            <Star size={14} className="fill-amber text-amber" /> {vehicle.rating}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-white/65">{vehicle.description || "Verified vehicle ready for doorstep delivery."}</p>
        <div className="flex items-center justify-between text-sm text-white/70">
          <span className="flex items-center gap-1">
            <MapPin size={15} /> {vehicle.location?.city || "Nearby"}
          </span>
          <span className="flex items-center gap-1">
            <Car size={15} /> {vehicle.availability}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Starts at</p>
            <p className="text-2xl font-black">₹{vehicle.pricePerHour}/hr</p>
          </div>
          {onBook ? (
            <button className="btn-primary" onClick={() => onBook(vehicle)}>
              Book now
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
