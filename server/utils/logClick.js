import supabase from '../config/supabase.js';
import useragent from 'useragent';
import geoip from 'geoip-lite';

async function logClick(shortCode, req) {
  // Parse user agent
  const agent = useragent.parse(req.headers['user-agent'] || '');
  
  // Parse device type
  const ua = req.headers['user-agent']?.toLowerCase() || '';
  let deviceType = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'mobile';
  }
  
  // Get IP geolocation (offline, free)
  const ip = req.ip || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  
  // Detect bots (basic)
  const botPatterns = /bot|crawler|spider|crawling|googlebot|bingbot/i;
  const isBot = botPatterns.test(ua);
  
  const {data, error} = await supabase
    .from('clicks')
    .insert({
      url_id: shortCode,
      clicked_at: new Date(),
      user_agent: req.headers['user-agent'] || null,
      referrer: req.headers['referer'] || null,
      ip_address: ip,
      
      // Parsed data
      browser: agent.family || null,           // "Chrome", "Firefox", etc.
      device_type: deviceType,
      os: agent.os.family || null,             // "Windows", "iOS", etc.
      
      // Geolocation
      country: geo?.country || null,           // "US", "GB", etc.
      city: geo?.city || null,                 // "New York", "London", etc.
      
      // Bot detection
      is_bot: isBot
    })
    .select()
  if (error) {throw error || "Could not add click"}
  else {"Click added: ", data}
}


export default logClick