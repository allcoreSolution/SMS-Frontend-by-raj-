// Safe helpers so API shape differences never crash a page
export const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.tenants)) return res.tenants;
  if (Array.isArray(res?.schools)) return res.schools;
  return [];
};
export const num = (v) => {
  const n = Number(String(v ?? 0).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
export const inr = (v) => num(v).toLocaleString('en-IN');
