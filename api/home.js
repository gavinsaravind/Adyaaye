// Finds the homepage hero video files on the original Adyaaye store.
module.exports = async (req, res) => {
  try {
    const r = await fetch('https://adyaaye.com/', { headers: { 'user-agent': 'Mozilla/5.0' } });
    const html = (await r.text()).replace(/&amp;/g, '&').replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    const found = [...new Set((html.match(/(?:https?:)?\/\/[^"'\s<>()\\]+?\.mp4[^"'\s<>()\\]*/g) || []))]
      .map((u) => (u.startsWith('//') ? 'https:' + u : u));
    const pick = (id) => found.find((u) => u.includes(id));
    const desktop = pick('67607b817eed42ccbdb970ffba69c3ed') || found[0] || null;
    const mobile = pick('00a01e481d194163b8b66c06b73c1d70') || found[1] || desktop;
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ desktop, mobile, count: found.length });
  } catch (e) {
    res.status(200).json({ desktop: null, mobile: null });
  }
};
