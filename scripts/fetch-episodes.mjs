import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RSS_URL = 'https://anchor.fm/s/118458940/podcast/rss';
const OUT_DIR = path.join(__dirname, '../public/podcast');
const OUT_FILE = path.join(OUT_DIR, 'episodes.json');

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchEpisodes() {
  console.log('[fetch-episodes] Fetching podcast RSS from:', RSS_URL);
  let xml = '';
  try {
    const res = await fetch(RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NanoEmpireFeedBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch RSS: ${res.status} ${res.statusText}`);
    }
    xml = await res.text();
  } catch (err) {
    console.warn('[fetch-episodes] Warning: RSS fetch failed:', err.message);
    if (fs.existsSync(OUT_FILE)) {
      console.log('[fetch-episodes] Using existing episodes.json cache.');
      return;
    }
  }

  if (!xml && fs.existsSync(OUT_FILE)) {
    console.log('[fetch-episodes] No new XML, keeping existing episodes.json.');
    return;
  }

  const items = xml.split('<item>');
  items.shift(); // remove channel header

  const episodes = [];

  for (const item of items) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/s);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/s);
    const descMatch = item.match(/<description>(.*?)<\/description>/s);
    const itunesSummaryMatch = item.match(/<itunes:summary>(.*?)<\/itunes:summary>/s);
    const itunesDurationMatch = item.match(/<itunes:duration>(.*?)<\/itunes:duration>/s);
    const itunesEpisodeMatch = item.match(/<itunes:episode>(.*?)<\/itunes:episode>/s);
    const itunesSeasonMatch = item.match(/<itunes:season>(.*?)<\/itunes:season>/s);
    const enclosureMatch = item.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    const guidMatch = item.match(/<guid[^>]*>(.*?)<\/guid>/s);

    const title = cleanText(titleMatch ? titleMatch[1] : 'Untitled Episode');
    const pubDateRaw = pubDateMatch ? pubDateMatch[1].trim() : '';
    const audioUrl = enclosureMatch ? enclosureMatch[1] : '';
    const guid = cleanText(guidMatch ? guidMatch[1] : '');
    const duration = cleanText(itunesDurationMatch ? itunesDurationMatch[1] : '');
    const episodeNum = cleanText(itunesEpisodeMatch ? itunesEpisodeMatch[1] : '');

    let desc = cleanText(itunesSummaryMatch ? itunesSummaryMatch[1] : (descMatch ? descMatch[1] : ''));
    if (desc.length > 280) {
      desc = desc.slice(0, 277) + '...';
    }

    if (title && audioUrl) {
      episodes.push({
        id: guid || String(episodes.length + 1),
        title,
        pubDate: pubDateRaw,
        description: desc,
        audioUrl,
        duration,
        episode: episodeNum
      });
    }
  }

  if (episodes.length === 0 && fs.existsSync(OUT_FILE)) {
    console.warn('[fetch-episodes] Parsed 0 episodes from feed, retaining fallback cache.');
    return;
  }

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(episodes, null, 2), 'utf8');
  console.log(`[fetch-episodes] Successfully wrote ${episodes.length} episodes to ${OUT_FILE}`);
}

fetchEpisodes().catch((err) => {
  console.error('[fetch-episodes] Unexpected error:', err);
  // Do not fail build if fallback exists
  if (!fs.existsSync(OUT_FILE)) {
    process.exit(1);
  }
});
