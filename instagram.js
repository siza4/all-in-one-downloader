const fetch = require('node-fetch');
const cheerio = require('cheerio');
async function fetchText(url){ return (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text(); }
module.exports = async (req,res)=>{ 
  if(req.method!=='POST') return res.status(405).json({ error:'Only POST' });
  const { url } = req.body || {};
  if(!url) return res.status(400).json({ error:'Missing url' });
  try{
    const html = await fetchText(url);
    const $ = cheerio.load(html);
    const ogVideo = $('meta[property="og:video"]').attr('content') || $('meta[property="og:video:url"]').attr('content');
    if(ogVideo) return res.json({ type:'video', url: ogVideo });
    const m = html.match(/https:\\/\\/[a-zA-Z0-9._\\/-]+\\.mp4[^"'\\s<]*/);
    if(m) return res.json({ type:'video', url: m[0] });
    return res.status(404).json({ error:'Could not find instagram video' });
  }catch(err){ console.error(err); return res.status(500).json({ error:'Server error' }); }
};
