const fetch = require('node-fetch');
async function fetchText(url){ return (await fetch(url, { headers: { 'User-Agent':'Mozilla/5.0' } })).text(); }
module.exports = async (req,res)=>{ 
  if(req.method!=='POST') return res.status(405).json({ error:'Only POST' });
  const { url } = req.body || {};
  if(!url) return res.status(400).json({ error:'Missing url' });
  try{
    const html = await fetchText(url);
    const m = html.match(/"playAddr":"(https:[^\\"]+)"/);
    if(m && m[1]){ const video = m[1].replace(/\\u0026/g,'&').replace(/\\\//g,'/'); return res.json({ type:'video', url: video }); }
    return res.status(404).json({ error:'Could not resolve TikTok video url' });
  }catch(err){ console.error(err); return res.status(500).json({ error:'Server error' }); }
};
