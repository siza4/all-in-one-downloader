const fetch = require('node-fetch');
async function fetchText(url){
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
  return await r.text();
}
function extractMp4FromHtml(html){
  const scripts = html.match(/"playable_url":"(https:[^\\"]+\\.mp4)[^\\"]*"/);
  if(scripts && scripts[1]) return scripts[1].replace(/\\\\\//g,'/');
  const m = html.match(/https:\\/\\/[^"\s>]+\\.mp4[^"\s<]*/);
  if(m) return m[0];
  return null;
}
module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  const { url } = req.body || {};
  if(!url) return res.status(400).json({ error: 'Missing url' });
  try{
    const normalized = url.replace('www.facebook.com','mbasic.facebook.com').replace('m.facebook.com','mbasic.facebook.com');
    const html = await fetchText(normalized);
    const video = extractMp4FromHtml(html);
    if(!video) return res.status(404).json({ error: 'Could not resolve direct mp4 (try a different link or public video)' });
    return res.json({ type: 'video', url: video });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
