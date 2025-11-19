const ytdl = require('ytdl-core');
module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });
  const { url } = req.body || {};
  if(!url) return res.status(400).json({ error: 'Missing url' });
  try{
    if(!ytdl.validateURL(url)) return res.status(400).json({ error: 'Invalid YouTube URL' });
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo').filter(f=>f.container === 'mp4');
    const best = formats.sort((a,b)=>(b.bitrate||0)-(a.bitrate||0))[0];
    if(!best) return res.status(404).json({ error: 'No downloadable mp4 format found' });
    return res.json({ type: 'video', url: best.url, title: info.videoDetails.title, thumbnail: info.videoDetails.thumbnails?.pop()?.url });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
};
