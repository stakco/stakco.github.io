/**
 * Stakco Daily Puzzle
 * Resolves today's puzzle the same way the main Play app does:
 *   play.json → <userId>/user.config → <userId>/<activeAlbum>.album.json → today's puzzle
 *
 * Auto-apply: any <stakco-puzzle-container daily> on the page gets its
 * user-id / puzzle-id / puzzle-type set once today's puzzle is resolved.
 *
 *   <script type="module" src="https://stakcos.com/assets/1.0.0/components/stakco-daily-puzzle.js"></script>
 *   <stakco-puzzle-container layers="3" tolerance="2" daily></stakco-puzzle-container>
 *
 * Optional attributes on the container:
 *   daily-subdomain – resolve a specific play.json entry instead of "@" (the main daily puzzle)
 *
 * Events (dispatched on the container):
 *   daily-resolved – detail: { userId, puzzleId, title, albumName, index }
 *   daily-error    – detail: { error }
 *
 * Also exports resolveDailyPuzzle() for pages that need the data directly.
 */

const GCS_BASE = 'https://storage.googleapis.com/stakco-images';

async function fetchJSON(path) {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${GCS_BASE}/${path}${sep}_t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

/** Pick the puzzle index for an album, matching the Play app's rules. */
export function calculatePuzzleIndex(album, progressIndex = 0) {
  const puzzles = album.Puzzles || album.puzzles || [];
  const count = puzzles.length;
  if (!count) return -1;
  const type = album.Type || album.type || '';

  if (type === 'SEQUENTIAL') return Math.min(progressIndex, count - 1);
  if (type === 'FREEPLAY') return 0;

  if (type === 'GENAI') {
    const today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd (UTC), same as Play
    const pid = p => p.PuzzleId || p.puzzleId || '';
    const exact = puzzles.findIndex(p => pid(p).startsWith(today));
    if (exact >= 0) return exact;
    // Otherwise the most recent dated puzzle that isn't in the future
    let best = 0, bestDate = '';
    puzzles.forEach((p, i) => {
      const d = pid(p).slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today && d > bestDate) { best = i; bestDate = d; }
    });
    return best;
  }

  // DAILY / unknown: rotate through the album by day
  const dayIndex = Math.floor(Date.now() / 86400000);
  return dayIndex % count;
}

/** Resolve today's puzzle. Returns { userId, puzzleId, title, albumName, index }. */
export async function resolveDailyPuzzle(subdomain = '@') {
  const playConfig = await fetchJSON('play.json');
  const entry = playConfig[subdomain];
  if (!entry) throw new Error(`"${subdomain}" not found in play.json`);
  const userId = entry.user_id || entry.UserId;
  if (!userId) throw new Error('No user for daily puzzle');

  const userConfig = await fetchJSON(`${userId}/user.config`);
  const activeAlbum = userConfig.active_album || userConfig.ActiveAlbum;
  if (!activeAlbum) throw new Error('No active album');

  const album = await fetchJSON(`${userId}/${activeAlbum}.album.json`);
  const index = calculatePuzzleIndex(album);
  const puzzles = album.Puzzles || album.puzzles || [];
  const puzzle = puzzles[index];
  if (!puzzle) throw new Error('Album has no puzzles');

  return {
    userId,
    puzzleId: puzzle.PuzzleId || puzzle.puzzleId,
    title: puzzle.Title || puzzle.title || '',
    albumName: album.Name || album.name || '',
    index
  };
}

/** Fill one <stakco-puzzle-container daily> with today's puzzle. */
async function applyToContainer(container) {
  try {
    const info = await resolveDailyPuzzle(container.getAttribute('daily-subdomain') || '@');
    // Set puzzle-id last: the container reloads its images when this changes
    container.setAttribute('puzzle-type', 'user');
    container.setAttribute('user-id', info.userId);
    container.setAttribute('puzzle-id', info.puzzleId);
    container.dispatchEvent(new CustomEvent('daily-resolved', { detail: info, bubbles: true }));
  } catch (error) {
    console.error('StakcoDailyPuzzle:', error);
    container.dispatchEvent(new CustomEvent('daily-error', { detail: { error }, bubbles: true }));
  }
}

function applyAll() {
  document.querySelectorAll('stakco-puzzle-container[daily]').forEach(applyToContainer);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAll);
} else {
  applyAll();
}
