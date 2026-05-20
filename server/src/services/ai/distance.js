export function distanceKm(a = {}, b = {}) {
  if ([a.lat, a.lng, b.lat, b.lng].some((value) => value === undefined || value === null)) {
    return 999;
  }

  const toRad = (value) => (Number(value) * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return Number((2 * earthRadius * Math.asin(Math.sqrt(h))).toFixed(2));
}
