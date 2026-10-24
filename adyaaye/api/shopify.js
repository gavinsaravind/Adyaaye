// Reads the live product catalogue from the original Adyaaye store so every
// product, price, image and description stays identical to adyaaye.com.
const ORIGIN = 'https://adyaaye.com';
const OK = [
  /^\/products\.json$/,
  /^\/collections\/[a-z0-9-]+\/products\.json$/,
  /^\/products\/[a-z0-9-]+\.json$/,
];

module.exports = async (req, res) => {
  const p = String(req.query.path || '');
  if (!OK.some((r) => r.test(p))) return res.status(400).json({ error: 'path not allowed' });
  const qs = new URLSearchParams();
  if (req.query.page) qs.set('page', String(req.query.page).replace(/\D/g, '') || '1');
  if (p.endsWith('products.json')) qs.set('limit', '250');
  try {
    const r = await fetch(`${ORIGIN}${p}?${qs}`, { headers: { accept: 'application/json' } });
    if (!r.ok) return res.status(r.status).json({ error: 'upstream ' + r.status });
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    res.status(200).json(await r.json());
  } catch (e) {
    res.status(502).json({ error: 'upstream unreachable' });
  }
};
