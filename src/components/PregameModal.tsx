import { X, ExternalLink, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import imgModal from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";
import PlayerCard from './PlayerCard';

// Helper function to format rank with ordinal suffix
const formatRank = (rank: string): string => {
  if (!rank || rank === '-') return '';
  const num = parseInt(rank);
  if (isNaN(num)) return rank;
  
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

// Helper function to clean HTML from RSS feed content
const cleanHtmlContent = (html: string): string => {
  if (!html) return '';
  
  // Decode HTML entities (including numeric entities like &#39;)
  const decodeEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };
  
  // First decode any HTML entities in the raw text
  let cleaned = decodeEntities(html);
  
  // Strip HTML tags but preserve paragraph breaks
  cleaned = cleaned.replace(/<\/p>\s*<p>/gi, '\n\n');
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');
  
  // Decode entities again after stripping tags (in case tags contained entities)
  cleaned = decodeEntities(cleaned);
  
  // Manually replace common numeric and named entities that might have been missed
  cleaned = cleaned.replace(/&#39;/g, "'");
  cleaned = cleaned.replace(/&apos;/g, "'");
  cleaned = cleaned.replace(/&#8217;/g, "'");
  cleaned = cleaned.replace(/&rsquo;/g, "'");
  cleaned = cleaned.replace(/&#8216;/g, "'");
  cleaned = cleaned.replace(/&lsquo;/g, "'");
  cleaned = cleaned.replace(/&#8220;/g, '"');
  cleaned = cleaned.replace(/&ldquo;/g, '"');
  cleaned = cleaned.replace(/&#8221;/g, '"');
  cleaned = cleaned.replace(/&rdquo;/g, '"');
  cleaned = cleaned.replace(/&#8211;/g, '–');
  cleaned = cleaned.replace(/&ndash;/g, '–');
  cleaned = cleaned.replace(/&#8212;/g, '—');
  cleaned = cleaned.replace(/&mdash;/g, '—');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&#160;/g, ' ');
  
  // Remove common RSS artifacts
  cleaned = cleaned.replace(/\[.*?\]/g, ''); // Remove [brackets]
  cleaned = cleaned.replace(/Continue reading.*/gi, '');
  cleaned = cleaned.replace(/Read more.*/gi, '');
  
  // Remove promotional content and ads
  cleaned = cleaned.replace(/Subscribe to .* (Apple Podcasts|Spotify|YouTube|RSS).*/gi, '');
  cleaned = cleaned.replace(/Check out the rest of .*/gi, '');
  cleaned = cleaned.replace(/🖥️ Watch this full episode.*/gi, '');
  cleaned = cleaned.replace(/If you ever have .* questions, email us at .*/gi, '');
  cleaned = cleaned.replace(/We're bouncing around on today's episode.*/gi, '');
  
  // Remove podcast timestamps like (2:08) — Topic or (9:45)— Topic
  cleaned = cleaned.replace(/\(\d{1,2}:\d{2}(:\d{2})?\)\s*[—–-]\s*[^(]*/g, '');
  
  // Remove photo credits and image captions
  cleaned = cleaned.replace(/\(Photo by [^)]+\)/gi, '');
  cleaned = cleaned.replace(/Photo: [^.]*\./gi, '');
  cleaned = cleaned.replace(/Image: [^.]*\./gi, '');
  cleaned = cleaned.replace(/Getty Images.*/gi, '');
  
  // Remove email addresses
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
  
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
  
  // Remove standalone player/person names followed by team names and numbers (e.g., "Trae Young #11 of the Atlanta Hawks")
  cleaned = cleaned.replace(/[A-Z][a-z]+ [A-Z][a-z]+ #\d+ of the [^.]*?(looks on|during|against)[^.]*?\./g, '');
  
  // Clean up excessive spaces (but preserve paragraph breaks)
  cleaned = cleaned.replace(/ +/g, ' '); // Multiple spaces to single space
  cleaned = cleaned.replace(/\n +/g, '\n'); // Remove leading spaces in new lines
  cleaned = cleaned.replace(/ +\n/g, '\n'); // Remove trailing spaces before new lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
  
  return cleaned.trim();
};

interface PregameModalProps {
  game: {
    awayTeam: {
      code: string;
      name?: string;
      record: string;
      logo: string;
      color: string;
      ppg: string;
      ppgRank: string;
      oppg: string;
      oppgRank: string;
      streak?: string;
      id?: string;
    };
    homeTeam: {
      code: string;
      name: string;
      record: string;
      logo: string;
      color: string;
      ppg: string;
      ppgRank: string;
      oppg: string;
      oppgRank: string;
      streak?: string;
      id?: string;
    };
    time: string;
    network: string;
    spread: string;
    total: string;
    date?: string;
    arena?: string;
    city?: string;
    state?: string;
    eventId?: string;
  };
  onClose: () => void;
}

interface Starter {
  id: string;
  name: string;
  displayName: string;
  position: string;
  jerseyNumber: string;
  headshot: string;
  ppg: string;
  rpg: string;
  apg: string;
  injury?: {
    status: string;
    description: string;
  };
  // Additional stats from NBA Stats API
  gp?: string;      // Games played
  mpg?: string;     // Minutes per game
  fgPct?: string;   // Field goal %
  fg3Pct?: string;  // 3-point %
  ftPct?: string;   // Free throw %
  spg?: string;     // Steals per game
  bpg?: string;     // Blocks per game
  tov?: string;     // Turnovers per game
  pf?: string;      // Personal fouls per game
}

interface PlayerCardData {
  id: string;
  name: string;
  displayName: string;
  position: string;
  jerseyNumber: string;
  headshot: string;
  teamColor: string;
  teamLogo: string;
  teamCode: string;
  gameStats: {
    min: string;
    pts: string;
    reb: string;
    ast: string;
    fg: string;
    '3pt': string;
    ft: string;
    stl: string;
    blk: string;
    to: string;
    pf: string;
  };
  seasonStats?: {
    ppg: string;
    rpg: string;
    apg: string;
    fgPct: string;
    fg3Pct: string;
    ftPct: string;
  };
}

interface Injury {
  name: string;
  status: string;
  description: string;
}

interface NewsArticle {
  headline: string;
  description: string;
  published: string;
  link: string;
  image?: string;
  story?: string; // Full article content
  source?: string; // News source (ESPN API, ESPN RSS, Yahoo, etc.)
}

interface TeamSeasonStats {
  fgPct: string;
  fgPctRank: string;
  fg3Pct: string;
  fg3PctRank: string;
  ftPct: string;
  ftPctRank: string;
  rpg: string;
  rpgRank: string;
  apg: string;
  apgRank: string;
  topg: string;
  topgRank: string;
  bpg: string;
  bpgRank: string;
  spg: string;
  spgRank: string;
}

export default function PregameModal({ game, onClose }: PregameModalProps) {
  const [selectedView, setSelectedView] = useState<'rosters' | 'standings' | 'stats' | 'news'>('stats');
  const [selectedConference, setSelectedConference] = useState<'Eastern Conference' | 'Western Conference'>('Eastern Conference');
  const [awayStarters, setAwayStarters] = useState<Starter[]>([]);
  const [homeStarters, setHomeStarters] = useState<Starter[]>([]);
  const [awayInjuries, setAwayInjuries] = useState<Injury[]>([]);
  const [homeInjuries, setHomeInjuries] = useState<Injury[]>([]);
  const [awayStats, setAwayStats] = useState<TeamSeasonStats | null>(null);
  const [homeStats, setHomeStats] = useState<TeamSeasonStats | null>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [awayTeamConference, setAwayTeamConference] = useState<string>('');
  const [homeTeamConference, setHomeTeamConference] = useState<string>('');
  const [awayTeamDivision, setAwayTeamDivision] = useState<string>('');
  const [homeTeamDivision, setHomeTeamDivision] = useState<string>('');
  const [awayNews, setAwayNews] = useState<NewsArticle[]>([]);
  const [homeNews, setHomeNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCardData | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<(NewsArticle & { teams: ('away' | 'home')[] }) | null>(null);
  
  // Detect if running as PWA in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;

  useEffect(() => {
    console.log('🏀 PregameModal mounted with game data:', {
      eventId: game.eventId,
      awayTeam: {
        code: game.awayTeam.code,
        id: game.awayTeam.id,
        idType: typeof game.awayTeam.id
      },
      homeTeam: {
        code: game.homeTeam.code,
        id: game.homeTeam.id,
        idType: typeof game.homeTeam.id
      }
    });
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    
    // Verify we have team IDs
    if (!game.awayTeam.id || !game.homeTeam.id) {
      console.error('❌ Missing team IDs:', {
        awayId: game.awayTeam.id,
        homeId: game.homeTeam.id
      });
      setError('Team IDs not available');
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Starting data fetch for teams:', game.awayTeam.id, game.homeTeam.id);
      
      // Fetch injuries first, then other data in parallel
      // DISABLED: Out of API calls - uncomment when API quota resets
      // await fetchInjuries();
      
      await Promise.all([
        fetchStarters(),
        fetchTeamStats(),
        fetchStandings(),
        fetchNews()
      ]);
      
      console.log('✅ All data fetched successfully');
    } catch (error) {
      console.error('❌ Error in fetchAllData:', error);
      setError('Failed to load pregame data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStarters = async () => {
    console.log('📋 === FETCHING STARTERS ===');
    
    const awayTeamId = game.awayTeam.id;
    const homeTeamId = game.homeTeam.id;
    const eventId = game.eventId;
    
    console.log(`🔍 Away Team ID: ${awayTeamId} (${game.awayTeam.code})`);
    console.log(`🔍 Home Team ID: ${homeTeamId} (${game.homeTeam.code})`);
    console.log(`🔍 Event ID: ${eventId}`);

    if (!awayTeamId || !homeTeamId) {
      console.error('❌ Cannot fetch starters - missing team IDs');
      return;
    }

    try {
      // Try to get starters from game summary first (if event ID exists)
      if (eventId) {
        const summaryStarters = await fetchStartersFromSummary(eventId, awayTeamId, homeTeamId);
        if (summaryStarters.away.length > 0 || summaryStarters.home.length > 0) {
          setAwayStarters(attachInjuriesToStarters(summaryStarters.away, awayInjuries));
          setHomeStarters(attachInjuriesToStarters(summaryStarters.home, homeInjuries));
          console.log(`✅ Starters from summary: ${summaryStarters.away.length} away, ${summaryStarters.home.length} home`);
          return;
        }
      }

      // Fall back to depth chart approach
      console.log('📋 No starters in summary, trying depth chart');
      const [awayDepthData, homeDepthData] = await Promise.all([
        fetchStartersFromDepthChart(awayTeamId, game.awayTeam.code),
        fetchStartersFromDepthChart(homeTeamId, game.homeTeam.code)
      ]);

      if (awayDepthData.length > 0 || homeDepthData.length > 0) {
        setAwayStarters(attachInjuriesToStarters(awayDepthData, awayInjuries));
        setHomeStarters(attachInjuriesToStarters(homeDepthData, homeInjuries));
        console.log(`✅ Starters from depth chart: ${awayDepthData.length} away, ${homeDepthData.length} home`);
        return;
      }

      // Final fallback to basic roster
      console.log('📋 No depth chart, falling back to roster');
      const [awayRosterData, homeRosterData] = await Promise.all([
        fetchTeamRoster(awayTeamId, game.awayTeam.code),
        fetchTeamRoster(homeTeamId, game.homeTeam.code)
      ]);

      setAwayStarters(attachInjuriesToStarters(awayRosterData, awayInjuries));
      setHomeStarters(attachInjuriesToStarters(homeRosterData, homeInjuries));
      
      console.log(`✅ Starters loaded: ${awayRosterData.length} away, ${homeRosterData.length} home`);
    } catch (error) {
      console.error('❌ Error fetching starters:', error);
    }
  };

  const fetchStartersFromSummary = async (eventId: string, awayTeamId: string, homeTeamId: string): Promise<{ away: Starter[]; home: Starter[] }> => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`;
    console.log(`📡 Fetching game summary from: ${url}`);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ Failed to fetch summary: ${response.status}`);
        return { away: [], home: [] };
      }

      const data = await response.json();
      console.log('📦 Summary data keys:', Object.keys(data));
      
      const awayStarters: Starter[] = [];
      const homeStarters: Starter[] = [];

      // Check for boxscore with starters
      if (data.boxscore?.players) {
        console.log('📦 Found boxscore.players');
        
        for (const teamBox of data.boxscore.players) {
          const teamId = teamBox.team?.id;
          const isAway = teamId === awayTeamId;
          console.log(`📦 Processing boxscore team ${teamId}, isAway: ${isAway}`);
          
          const targetArray = isAway ? awayStarters : homeStarters;
          
          // Look for statistics array with starters
          if (teamBox.statistics && teamBox.statistics.length > 0) {
            const startersGroup = teamBox.statistics[0]; // First group is usually starters
            console.log(`📦 Found statistics group: ${startersGroup.name}, ${startersGroup.athletes?.length || 0} athletes`);
            
            if (startersGroup.athletes) {
              for (const athleteData of startersGroup.athletes.slice(0, 5)) {
                const athlete = athleteData.athlete;
                if (!athlete) continue;

                console.log(`👤 Starter from boxscore: ${athlete.displayName}`);

                const starter: Starter = {
                  id: athlete.id || '',
                  name: athlete.displayName || athlete.fullName || 'Unknown',
                  displayName: formatPlayerName(athlete.displayName || athlete.fullName),
                  position: athlete.position?.abbreviation || '',
                  jerseyNumber: athlete.jersey || '',
                  headshot: athlete.headshot?.href || '',
                  ppg: '-',
                  rpg: '-',
                  apg: '-'
                };

                // Fetch stats
                if (athlete.id) {
                  const stats = await fetchPlayerStats(athlete.id, starter.name);
                  if (stats) {
                    starter.ppg = stats.ppg;
                    starter.rpg = stats.rpg;
                    starter.apg = stats.apg;
                    // Add all additional stats
                    starter.gp = stats.gp;
                    starter.mpg = stats.mpg;
                    starter.fgPct = stats.fgPct;
                    starter.fg3Pct = stats.fg3Pct;
                    starter.ftPct = stats.ftPct;
                    starter.spg = stats.spg;
                    starter.bpg = stats.bpg;
                    starter.tov = stats.tov;
                    starter.pf = stats.pf;
                  }
                }

                targetArray.push(starter);
              }
            }
          }
        }
      }

      console.log(`📋 From summary - Away: ${awayStarters.length}, Home: ${homeStarters.length}`);
      return { away: awayStarters, home: homeStarters };
    } catch (error) {
      console.error('❌ Error fetching summary starters:', error);
      return { away: [], home: [] };
    }
  };

  const fetchStartersFromDepthChart = async (teamId: string, teamCode: string): Promise<Starter[]> => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/depthcharts`;
    console.log(`📡 Fetching depth chart for ${teamCode} from: ${url}`);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`⚠️ No depth chart available for ${teamCode}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log(`📦 Depth chart data for ${teamCode}:`, Object.keys(data));

      const starters: Starter[] = [];

      if (data.items && data.items.length > 0) {
        // Get the first (current) depth chart
        const currentDepthChart = data.items[0];
        console.log(`📦 Current depth chart positions:`, currentDepthChart.positions?.length || 0);

        if (currentDepthChart.positions) {
          for (const position of currentDepthChart.positions) {
            // Get first athlete in each position (starter)
            if (position.athletes && position.athletes.length > 0) {
              const athleteData = position.athletes[0];
              const athlete = athleteData.athlete;

              if (!athlete) continue;

              console.log(`👤 Starter from depth chart (${position.name}): ${athlete.displayName}`);

              const starter: Starter = {
                id: athlete.id || '',
                name: athlete.displayName || athlete.fullName || 'Unknown',
                displayName: formatPlayerName(athlete.displayName || athlete.fullName),
                position: athlete.position?.abbreviation || position.abbreviation || '',
                jerseyNumber: athlete.jersey || '',
                headshot: athlete.headshot?.href || '',
                ppg: '-',
                rpg: '-',
                apg: '-'
              };

              // Fetch stats
              if (athlete.id) {
                const stats = await fetchPlayerStats(athlete.id, starter.name);
                if (stats) {
                  starter.ppg = stats.ppg;
                  starter.rpg = stats.rpg;
                  starter.apg = stats.apg;
                  // Add all additional stats
                  starter.gp = stats.gp;
                  starter.mpg = stats.mpg;
                  starter.fgPct = stats.fgPct;
                  starter.fg3Pct = stats.fg3Pct;
                  starter.ftPct = stats.ftPct;
                  starter.spg = stats.spg;
                  starter.bpg = stats.bpg;
                  starter.tov = stats.tov;
                  starter.pf = stats.pf;
                }
              }

              starters.push(starter);

              // Stop at 5 starters
              if (starters.length >= 5) break;
            }
          }
        }
      }

      console.log(`📋 Found ${starters.length} starters from depth chart for ${teamCode}`);
      return starters;
    } catch (error) {
      console.error(`❌ Error fetching depth chart for ${teamCode}:`, error);
      return [];
    }
  };

  const fetchTeamRoster = async (teamId: string, teamCode: string): Promise<Starter[]> => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`;
    console.log(`📡 Fetching roster for ${teamCode} from: ${url}`);

    try {
      const response = await fetch(url);
      console.log(`📥 Response status for ${teamCode}: ${response.status}`);

      if (!response.ok) {
        console.error(`❌ Failed to fetch ${teamCode} roster: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      console.log(`📦 Full roster data structure for ${teamCode}:`, Object.keys(data));

      // ESPN roster endpoint returns athletes directly
      const athletesList = data.athletes || [];
      
      if (!athletesList || athletesList.length === 0) {
        console.warn(`⚠️ No athletes found for ${teamCode}`);
        return [];
      }

      console.log(`👥 ${teamCode} has ${athletesList.length} total athletes`);

      // Filter active players
      const activePlayers = athletesList.filter((item: any) => {
        const isActive = item.active !== false;
        return isActive && item.id;
      });

      console.log(`👥 ${teamCode} has ${activePlayers.length} active players`);

      // Fetch all players with their stats
      const playersWithStats: Starter[] = [];

      for (const athlete of activePlayers) {
        if (!athlete) continue;

        const playerId = athlete.id;
        const playerName = athlete.displayName || athlete.fullName || 'Unknown';

        const player: Starter = {
          id: playerId || '',
          name: playerName,
          displayName: formatPlayerName(playerName),
          position: athlete.position?.abbreviation || '',
          jerseyNumber: athlete.jersey || '',
          headshot: athlete.headshot?.href || '',
          ppg: '-',
          rpg: '-',
          apg: '-'
        };

        // Fetch player stats from NBA Stats API
        if (playerId) {
          const stats = await fetchPlayerStats(playerId, playerName);
          if (stats) {
            player.ppg = stats.ppg;
            player.rpg = stats.rpg;
            player.apg = stats.apg;
            // Add all additional stats
            player.gp = stats.gp;
            player.mpg = stats.mpg;
            player.fgPct = stats.fgPct;
            player.fg3Pct = stats.fg3Pct;
            player.ftPct = stats.ftPct;
            player.spg = stats.spg;
            player.bpg = stats.bpg;
            player.tov = stats.tov;
            player.pf = stats.pf;
          }
        }

        playersWithStats.push(player);
      }

      // Filter out players who haven't played this season (those without stats)
      const playersWithGameStats = playersWithStats.filter(player => {
        const hasStats = player.ppg !== '-' || player.rpg !== '-' || player.apg !== '-';
        return hasStats;
      });

      // Sort by PPG (highest to lowest)
      playersWithGameStats.sort((a, b) => {
        const ppgA = parseFloat(a.ppg) || 0;
        const ppgB = parseFloat(b.ppg) || 0;
        return ppgB - ppgA;
      });

      console.log(`✅ Retrieved ${playersWithGameStats.length} active players for ${teamCode} (filtered from ${playersWithStats.length}), sorted by PPG`);
      return playersWithGameStats;
    } catch (error) {
      console.error(`❌ Error fetching roster for ${teamCode}:`, error);
      return [];
    }
  };

  const fetchPlayerStats = async (playerId: string, playerName: string): Promise<{ ppg: string; rpg: string; apg: string; gp?: string; mpg?: string; fgPct?: string; fg3Pct?: string; ftPct?: string; spg?: string; bpg?: string; tov?: string; pf?: string } | null> => {
    // Use ESPN API with strict 2025-26 season filtering
    const espnEndpoints = [
      `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2025/types/2/athletes/${playerId}/statistics/0`,
      `https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}/statistics?season=2025&seasontype=2`
    ];
    
    for (const url of espnEndpoints) {
      try {
        console.log(`📡 Fetching stats for ${playerName} from ESPN API`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        }).finally(() => clearTimeout(timeoutId));
        
        if (!response.ok) {
          console.log(`⚠️ ESPN API returned ${response.status} for ${playerName}`);
          continue;
        }

        const data = await response.json();
        
        // Verify this is 2025-26 season data
        const seasonYear = data.season?.year || data.season?.displayName || data.seasonYear;
        
        if (seasonYear && seasonYear !== 2025 && seasonYear !== '2025') {
          console.log(`⏭️ Skipping ${playerName}: Stats are from season ${seasonYear}, not 2025-26`);
          continue;
        }
        
        // Try different stat locations
        let statsArray: any[] = [];
        
        if (data.categories) {
          for (const category of data.categories) {
            if (category.stats) {
              statsArray.push(...category.stats);
            }
          }
        }
        
        if (statsArray.length === 0 && data.splits?.categories) {
          for (const category of data.splits.categories) {
            if (category.stats) {
              statsArray.push(...category.stats);
            }
          }
        }

        if (statsArray.length === 0 && data.stats) {
          statsArray = Array.isArray(data.stats) ? data.stats : [data.stats];
        }

        if (statsArray.length === 0) {
          console.log(`⚠️ No stats array found for ${playerName}`);
          continue;
        }
        
        const findStat = (...names: string[]) => {
          for (const name of names) {
            const stat = statsArray.find((s: any) => 
              s.name === name || 
              s.abbreviation === name ||
              s.displayName === name
            );
            if (stat) {
              return stat.displayValue || stat.value?.toString() || '-';
            }
          }
          return '-';
        };

        const gamesPlayed = findStat('gamesPlayed', 'games', 'GP', 'totalGames', 'gp');
        
        if (gamesPlayed === '-') {
          console.log(`⏭️ Skipping ${playerName}: No games played data for 2025-26`);
          return null;
        }
        
        const gamesPlayedNum = parseFloat(gamesPlayed);
        
        if (isNaN(gamesPlayedNum) || gamesPlayedNum < 1) {
          console.log(`⏭️ Skipping ${playerName}: ${gamesPlayed} games in 2025-26 season (less than 1)`);
          return null;
        }

        const result = {
          ppg: findStat('avgPoints', 'pointsPerGame', 'PPG'),
          rpg: findStat('avgRebounds', 'reboundsPerGame', 'RPG'),
          apg: findStat('avgAssists', 'assistsPerGame', 'APG'),
          gp: gamesPlayed,
          mpg: findStat('avgMinutes', 'minutesPerGame', 'MPG'),
          fgPct: findStat('fieldGoalPct', 'fieldGoalPctg', 'FG%'),
          fg3Pct: findStat('threePointFieldGoalPct', 'threePointPct', '3P%'),
          ftPct: findStat('freeThrowPct', 'freeThrowPctg', 'FT%'),
          spg: findStat('avgSteals', 'stealsPerGame', 'SPG'),
          bpg: findStat('avgBlocks', 'blocksPerGame', 'BPG'),
          tov: findStat('avgTurnovers', 'turnoversPerGame', 'TOV'),
          pf: findStat('avgPersonalFouls', 'foulsPerGame', 'PF')
        };

        console.log(`✅ Got stats for ${playerName} (${result.gp} GP): ${result.ppg} PPG, ${result.rpg} RPG, ${result.apg} APG`);
        
        if (result.ppg !== '-' || result.rpg !== '-' || result.apg !== '-') {
          return result;
        }
      } catch (error: any) {
        // Silently skip players with fetch errors (CORS, network issues, timeouts, etc.)
        // This is normal - some players may not have current season data available
        continue;
      }
    }
    
    // Player has no stats available - this is normal for inactive or injured players
    return null;
  };

  const fetchInjuries = async () => {
    console.log('🏥 === FETCHING INJURIES FROM RAPIDAPI ===');
    
    // Use the game's date if available, otherwise use today's date
    // Game date format from ESPN is typically like "2025-01-07T00:00Z"
    let dateStr: string;
    if (game.date) {
      // Extract just the YYYY-MM-DD portion from the game date
      dateStr = game.date.split('T')[0];
      console.log(`📅 Using game date: ${dateStr}`);
    } else {
      // Fallback to today, but this might not have data if it's too far in the future
      const today = new Date();
      dateStr = today.toISOString().split('T')[0];
      console.log(`📅 Using today's date (no game date available): ${dateStr}`);
    }
    
    console.log(`📅 Fetching injuries for date: ${dateStr}`);

    // RapidAPI updates 3× daily at 11 AM, 3 PM, and 5 PM ET
    // We only need to fetch once per update window
    const cacheKey = `nba_injuries_${dateStr}`;
    const cacheTimeKey = `nba_injuries_time_${dateStr}`;
    const cacheWindowKey = `nba_injuries_window_${dateStr}`;
    
    // Helper function to get current ET time and update window
    const getCurrentUpdateWindow = (): number => {
      const now = new Date();
      // Convert to ET (UTC-5 or UTC-4 depending on DST)
      const etOffset = -5; // EST (adjust if needed for EDT)
      const etTime = new Date(now.getTime() + (etOffset * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
      const hours = etTime.getHours();
      
      // Determine which update window we're in
      // 0 = before 11 AM (no updates yet today)
      // 1 = 11 AM - 3 PM window (use 11 AM data)
      // 2 = 3 PM - 5 PM window (use 3 PM data)
      // 3 = after 5 PM (use 5 PM data)
      if (hours < 11) return 0;
      if (hours < 15) return 1; // 11 AM - 3 PM
      if (hours < 17) return 2; // 3 PM - 5 PM
      return 3; // After 5 PM
    };
    
    // Helper function to process and set injury data
    const processInjuryData = (data: any, source: string) => {
      const awayTeamName = game.awayTeam.name || game.awayTeam.code;
      const homeTeamName = game.homeTeam.name;
      
      const awayData = filterInjuriesByTeam(data, awayTeamName, game.awayTeam.code);
      const homeData = filterInjuriesByTeam(data, homeTeamName, game.homeTeam.code);

      setAwayInjuries(awayData);
      setHomeInjuries(homeData);
      
      console.log(`✅ Injuries loaded from ${source}: ${awayData.length} away (${game.awayTeam.code}), ${homeData.length} home (${game.homeTeam.code})`);
    };
    
    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedWindow = localStorage.getItem(cacheWindowKey);
      const currentWindow = getCurrentUpdateWindow();
      
      // Use cache if we already have data from the current or later update window
      if (cachedData && cachedWindow) {
        const storedWindow = parseInt(cachedWindow);
        
        // If we have data from this window or a later one today, use it
        if (storedWindow >= currentWindow || currentWindow === 0) {
          const data = JSON.parse(cachedData);
          const windowNames = ['pre-11am', '11am update', '3pm update', '5pm update'];
          processInjuryData(data, `cache (${windowNames[storedWindow]})`);
          return;
        }
      }
      
      // If we're before the first update (before 11 AM ET), use yesterday's data if available
      if (currentWindow === 0 && cachedData) {
        const data = JSON.parse(cachedData);
        processInjuryData(data, 'cache (before today\'s first update)');
        return;
      }
    } catch (cacheError) {
      console.log('⚠️ Cache read error:', cacheError);
    }

    // Fetch fresh data from API
    try {
      const response = await fetch(`https://nba-injury-reports.p.rapidapi.com/injuries/${dateStr}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'nba-injury-reports.p.rapidapi.com',
          'X-RapidAPI-Key': 'd68b075bb1msh0e3630ede495fc1p12dfb0jsn8e79e2d425c7'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.log('🏥 Rate limit reached - using cached data');
          
          // Try to use any cached data as fallback
          try {
            const staleCachedData = localStorage.getItem(cacheKey);
            if (staleCachedData) {
              const data = JSON.parse(staleCachedData);
              processInjuryData(data, 'cache (rate limited)');
              return;
            }
          } catch (e) {
            console.log('🏥 No cache available while rate limited');
          }
        } else {
          console.error(`❌ RapidAPI returned status: ${response.status}`);
        }
        setAwayInjuries([]);
        setHomeInjuries([]);
        return;
      }

      const data = await response.json();
      const currentWindow = getCurrentUpdateWindow();
      const windowNames = ['pre-11am', '11am', '3pm', '5pm'];
      console.log(`🏥 Fresh data received from RapidAPI (${windowNames[currentWindow]} ET update)`);

      // Cache the response with the current update window
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        localStorage.setItem(cacheWindowKey, currentWindow.toString());
        console.log(`✅ Injury data cached for ${windowNames[currentWindow]} update window`);
      } catch (cacheError) {
        console.log('⚠️ Cache write error:', cacheError);
      }

      processInjuryData(data, 'API');
    } catch (error) {
      console.error('❌ Error fetching injuries from RapidAPI:', error);
      
      // Try to use cached data on network error
      try {
        const fallbackCache = localStorage.getItem(cacheKey);
        if (fallbackCache) {
          const data = JSON.parse(fallbackCache);
          processInjuryData(data, 'cache (network error)');
          return;
        }
      } catch (e) {
        // Ignore
      }
      
      setAwayInjuries([]);
      setHomeInjuries([]);
    }
  };

  const filterInjuriesByTeam = (data: any, teamName: string, teamCode: string): Injury[] => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Create a mapping from RapidAPI team names to team codes
    const rapidApiTeamMapping: Record<string, string> = {
      'Los Angeles Lakers': 'LAL',
      'Phoenix Suns': 'PHX',
      'Boston Celtics': 'BOS',
      'Miami Heat': 'MIA',
      'Golden State Warriors': 'GSW',
      'Los Angeles Clippers': 'LAC',
      'LA Clippers': 'LAC',
      'Milwaukee Bucks': 'MIL',
      'Denver Nuggets': 'DEN',
      'Brooklyn Nets': 'BKN',
      'Dallas Mavericks': 'DAL',
      'Philadelphia 76ers': 'PHI',
      'Toronto Raptors': 'TOR',
      'Chicago Bulls': 'CHI',
      'Cleveland Cavaliers': 'CLE',
      'Memphis Grizzlies': 'MEM',
      'Atlanta Hawks': 'ATL',
      'New York Knicks': 'NYK',
      'Sacramento Kings': 'SAC',
      'Minnesota Timberwolves': 'MIN',
      'Oklahoma City Thunder': 'OKC',
      'Portland Trail Blazers': 'POR',
      'Utah Jazz': 'UTA',
      'New Orleans Pelicans': 'NOP',
      'San Antonio Spurs': 'SAS',
      'Houston Rockets': 'HOU',
      'Indiana Pacers': 'IND',
      'Washington Wizards': 'WAS',
      'Orlando Magic': 'ORL',
      'Charlotte Hornets': 'CHA',
      'Detroit Pistons': 'DET'
    };

    const filteredInjuries = data
      .filter((injury: any) => {
        const injuryTeam = injury.team || injury.teamName || '';
        
        // Try exact mapping first
        const mappedCode = rapidApiTeamMapping[injuryTeam];
        if (mappedCode && mappedCode === teamCode) {
          return true;
        }
        
        // Fallback: try substring matching with city + name
        const injuryTeamLower = injuryTeam.toLowerCase();
        const teamNameLower = teamName.toLowerCase();
        const teamCodeLower = teamCode.toLowerCase();
        
        return injuryTeamLower.includes(teamNameLower) ||
               teamNameLower.includes(injuryTeamLower) ||
               injuryTeamLower.includes(teamCodeLower);
      })
      .map((injury: any) => {
        return {
          name: injury.player || injury.playerName || 'Unknown',
          status: injury.status || injury.injuryStatus || 'Out',
          description: injury.reason || injury.injury || injury.description || injury.bodyPart || 'Injury'
        };
      });
    
    console.log(`🏥 Filtered ${filteredInjuries.length} injuries for ${teamCode}`);
    return filteredInjuries;
  };

  const attachInjuriesToStarters = (starters: Starter[], injuries: Injury[]): Starter[] => {
    return starters.map(player => {
      // Normalize names for better matching
      const normalizePlayerName = (name: string): string => {
        return name
          .toLowerCase()
          .replace(/\./g, '') // Remove periods
          .replace(/'/g, '')  // Remove apostrophes
          .replace(/-/g, ' ') // Replace hyphens with spaces
          .replace(/\s+/g, ' ') // Normalize multiple spaces
          .trim();
      };

      // Find matching injury by player name
      const matchingInjury = injuries.find(injury => {
        const injuryNameNorm = normalizePlayerName(injury.name);
        const playerNameNorm = normalizePlayerName(player.name);
        const playerDisplayNameNorm = normalizePlayerName(player.displayName);
        
        // Try exact match first
        if (injuryNameNorm === playerNameNorm || injuryNameNorm === playerDisplayNameNorm) {
          return true;
        }
        
        // Try substring matching (handles "LeBron James" vs "James, LeBron")
        if (injuryNameNorm.includes(playerNameNorm) || 
            injuryNameNorm.includes(playerDisplayNameNorm) ||
            playerNameNorm.includes(injuryNameNorm) ||
            playerDisplayNameNorm.includes(injuryNameNorm)) {
          return true;
        }
        
        // Try matching by last name (split and compare)
        const injuryParts = injuryNameNorm.split(' ');
        const playerParts = playerNameNorm.split(' ');
        const displayParts = playerDisplayNameNorm.split(' ');
        
        // Check if last names match (assuming last name is the last part)
        if (injuryParts.length > 0 && playerParts.length > 0) {
          const injuryLastName = injuryParts[injuryParts.length - 1];
          const playerLastName = playerParts[playerParts.length - 1];
          const displayLastName = displayParts[displayParts.length - 1];
          
          if (injuryLastName === playerLastName || injuryLastName === displayLastName) {
            // Also check if first initial matches to avoid false positives
            if (injuryParts[0].charAt(0) === playerParts[0].charAt(0) ||
                injuryParts[0].charAt(0) === displayParts[0].charAt(0)) {
              return true;
            }
          }
        }
        
        return false;
      });

      if (matchingInjury) {
        return {
          ...player,
          injury: {
            status: matchingInjury.status,
            description: matchingInjury.description
          }
        };
      }

      return player;
    });
  };

  // Map injury status from RapidAPI to standard NBA designation codes
  const getInjuryDesignation = (status: string): string => {
    const statusLower = status.toLowerCase();
    
    // Map RapidAPI status to NBA injury codes
    if (statusLower.includes('out')) return 'O';
    if (statusLower.includes('questionable')) return 'Q';
    if (statusLower.includes('doubtful')) return 'D';
    if (statusLower.includes('day-to-day') || statusLower.includes('day to day')) return 'DTD';
    if (statusLower.includes('gtd') || statusLower.includes('game time')) return 'GTD';
    if (statusLower.includes('probable')) return 'P';
    if (statusLower.includes('injured reserve') || statusLower.includes('ir')) return 'IR';
    if (statusLower.includes('suspended')) return 'SUSP';
    
    // Default: return first letter of status
    return status.charAt(0).toUpperCase();
  };

  const fetchTeamStats = async () => {
    console.log('📊 === FETCHING TEAM STATS ===');
    
    const awayTeamId = game.awayTeam.id;
    const homeTeamId = game.homeTeam.id;

    if (!awayTeamId || !homeTeamId) {
      console.error('❌ Cannot fetch stats - missing team IDs');
      return;
    }

    try {
      const [awayData, homeData] = await Promise.all([
        fetchTeamSeasonStats(awayTeamId, game.awayTeam.code),
        fetchTeamSeasonStats(homeTeamId, game.homeTeam.code)
      ]);

      setAwayStats(awayData);
      setHomeStats(homeData);
      
      console.log(`✅ Team stats loaded for both teams`);
    } catch (error) {
      console.error('❌ Error fetching team stats:', error);
    }
  };

  const fetchTeamSeasonStats = async (teamId: string, teamCode: string): Promise<TeamSeasonStats | null> => {
    const endpoints = [
      `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2025/types/2/teams/${teamId}/statistics/0`,
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/statistics`,
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}`
    ];

    for (const url of endpoints) {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        
        let statsArray: any[] = [];
        
        // Method 1: splits.categories (core API)
        if (data.splits?.categories) {
          for (const category of data.splits.categories) {
            if (category.stats) {
              statsArray.push(...category.stats);
            }
          }
        }
        
        // Method 2: team.record.items stats
        if (statsArray.length === 0 && data.team?.record?.items?.[0]?.stats) {
          statsArray = data.team.record.items[0].stats;
        }
        
        // Method 3: team.statistics or team.stats
        if (statsArray.length === 0 && (data.team?.statistics || data.team?.stats)) {
          statsArray = data.team.statistics || data.team.stats;
        }

        if (statsArray.length === 0) {
          continue;
        }

        const findStat = (...names: string[]) => {
          for (const name of names) {
            const stat = statsArray.find((s: any) => s.name === name || s.abbreviation === name);
            if (stat) {
              return stat.displayValue || stat.value?.toString() || '-';
            }
          }
          return '-';
        };

        const stats: TeamSeasonStats = {
          fgPct: findStat('fieldGoalPct', 'fieldGoalPctg'),
          fgPctRank: findStat('fieldGoalPctRank'),
          fg3Pct: findStat('threePointFieldGoalPct', 'threePointPct'),
          fg3PctRank: findStat('threePointFieldGoalPctRank'),
          ftPct: findStat('freeThrowPct'),
          ftPctRank: findStat('freeThrowPctRank'),
          rpg: findStat('avgRebounds', 'reboundsPerGame'),
          rpgRank: findStat('avgReboundsRank'),
          apg: findStat('avgAssists', 'assistsPerGame'),
          apgRank: findStat('avgAssistsRank'),
          topg: findStat('avgTurnovers', 'turnoversPerGame'),
          topgRank: findStat('avgTurnoversRank'),
          bpg: findStat('avgBlocks', 'blocksPerGame'),
          bpgRank: findStat('avgBlocksRank'),
          spg: findStat('avgSteals', 'stealsPerGame'),
          spgRank: findStat('avgStealsRank')
        };

        console.log(`📊 Stats for ${teamCode}:`, stats);
        return stats;
      } catch (error) {
        continue;
      }
    }
    
    return null;
  };

  const fetchStandings = async () => {
    console.log('🏆 === FETCHING STANDINGS ===');
    
    try {
      const response = await fetch('https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2026');
      
      if (!response.ok) {
        console.error('❌ Failed to fetch standings');
        return;
      }

      const data = await response.json();
      
      // Extract team standings
      const teams: any[] = [];
      
      if (data.children) {
        for (const conference of data.children) {
          // Check if conference has standings with divisions
          if (conference.standings?.entries) {
            for (const entry of conference.standings.entries) {
              const teamData = {
                id: entry.team.id,
                name: entry.team.location,
                logo: entry.team.logos?.[0]?.href || '',
                record: entry.stats?.find((s: any) => s.name === 'overall')?.displayValue || '-',
                wins: entry.stats?.find((s: any) => s.name === 'wins')?.value || 0,
                losses: entry.stats?.find((s: any) => s.name === 'losses')?.value || 0,
                winPct: entry.stats?.find((s: any) => s.name === 'winPercent')?.displayValue || '-',
                gb: entry.stats?.find((s: any) => s.name === 'gamesBehind')?.displayValue || '-',
                conf: entry.stats?.find((s: any) => s.name === 'vsConf')?.displayValue || '-',
                home: entry.stats?.find((s: any) => s.name === 'Home')?.displayValue || '-',
                away: entry.stats?.find((s: any) => s.name === 'Road')?.displayValue || '-',
                l10: entry.stats?.find((s: any) => s.name === 'last10')?.displayValue || '-',
                streak: entry.stats?.find((s: any) => s.name === 'streak')?.displayValue || '-',
                conferenceName: conference.name || '',
                divisionName: '',
                rank: entry.stats?.find((s: any) => s.name === 'rank')?.value || teams.length + 1
              };
              teams.push(teamData);
              
              // Store conference info for matchup teams
              if (entry.team.id === game.awayTeam.id) {
                setAwayTeamConference(conference.name || '');
                // Set default conference to away team's conference
                if (conference.name) {
                  setSelectedConference(conference.name as 'Eastern Conference' | 'Western Conference');
                }
              }
              if (entry.team.id === game.homeTeam.id) {
                setHomeTeamConference(conference.name || '');
              }
            }
          }
          
          // Check for division standings
          if (conference.children) {
            for (const division of conference.children) {
              if (division.standings?.entries) {
                for (const entry of division.standings.entries) {
                  const existingTeam = teams.find(t => t.id === entry.team.id);
                  if (existingTeam) {
                    existingTeam.divisionName = division.name || '';
                    
                    // Store division info for matchup teams
                    if (entry.team.id === game.awayTeam.id) {
                      setAwayTeamDivision(division.name || '');
                    }
                    if (entry.team.id === game.homeTeam.id) {
                      setHomeTeamDivision(division.name || '');
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      // Sort by wins descending
      teams.sort((a, b) => b.wins - a.wins);
      
      setStandings(teams);
      console.log(`✅ Loaded ${teams.length} teams in standings`);
    } catch (error) {
      console.error('❌ Error fetching standings:', error);
    }
  };

  const fetchNews = async () => {
    console.log('📰 === FETCHING NEWS ===');
    
    const awayTeamId = game.awayTeam.id;
    const homeTeamId = game.homeTeam.id;

    if (!awayTeamId || !homeTeamId) {
      console.error('❌ Cannot fetch news - missing team IDs');
      return;
    }

    try {
      const [awayData, homeData] = await Promise.all([
        fetchTeamNews(awayTeamId, game.awayTeam.code, game.awayTeam.name),
        fetchTeamNews(homeTeamId, game.homeTeam.code, game.homeTeam.name)
      ]);

      setAwayNews(awayData);
      setHomeNews(homeData);
      
      console.log(`✅ News loaded: ${awayData.length} away, ${homeData.length} home`);
    } catch (error) {
      console.error('❌ Error fetching news:', error);
    }
  };

  const fetchRSSNews = async (teamCode: string, teamName: string): Promise<NewsArticle[]> => {
    const parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail', 'content:encoded']
      }
    });

    const articles: NewsArticle[] = [];
    
    // Team name variations to search for
    const searchTerms = [
      teamCode.toLowerCase(),
      teamName.toLowerCase(),
      teamName.split(' ')[teamName.split(' ').length - 1].toLowerCase() // Last word (e.g., "Lakers")
    ];
    
    // Helper function to check if a term appears as a whole word
    const containsWholeWord = (text: string, term: string): boolean => {
      // Create a regex that matches the term as a whole word (with word boundaries)
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(text);
    };

    const rssFeeds = [
      { url: 'https://www.espn.com/espn/rss/nba/news', source: 'ESPN RSS' },
      { url: 'https://sports.yahoo.com/nba/rss.xml', source: 'Yahoo Sports' }
    ];

    // Try multiple CORS proxies
    const corsProxies = [
      (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
      (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
    ];

    for (const feed of rssFeeds) {
      let feedFetched = false;
      
      // Try each proxy until one works
      for (const proxy of corsProxies) {
        if (feedFetched) break;
        
        try {
          const proxyUrl = proxy(feed.url);
          console.log(`🔗 Fetching RSS feed for ${teamCode} from ${feed.source} via proxy`);
          
          // Add timeout to prevent hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.warn(`⚠️ Failed to fetch ${feed.source} RSS via this proxy: ${response.status}`);
            continue;
          }

          const feedText = await response.text();
          
          // Check if we got valid XML/RSS content
          if (!feedText.includes('<rss') && !feedText.includes('<feed')) {
            console.warn(`⚠️ Invalid RSS/XML response from ${feed.source}`);
            continue;
          }

          const parsedFeed = await parser.parseString(feedText);

          console.log(`📡 Found ${parsedFeed.items?.length || 0} items in ${feed.source} RSS feed`);

          if (parsedFeed.items) {
            // Filter articles that mention the team - prioritize title matches
            const relevantArticles = parsedFeed.items.filter(item => {
              const title = item.title?.toLowerCase() || '';
              
              // Primary filter: Team must be mentioned in the TITLE as a whole word
              // This ensures the article is actually about the team, not just mentioning them
              return searchTerms.some(term => containsWholeWord(title, term));
            });

            console.log(`✅ Found ${relevantArticles.length} relevant articles for ${teamCode} from ${feed.source}`);

            for (const item of relevantArticles.slice(0, 3)) {
              // Extract image from media:content or media:thumbnail
              let image = '';
              if (item['media:content']) {
                const mediaContent = item['media:content'];
                if (typeof mediaContent === 'object' && mediaContent.$ && mediaContent.$.url) {
                  image = mediaContent.$.url;
                }
              } else if (item['media:thumbnail']) {
                const mediaThumbnail = item['media:thumbnail'];
                if (typeof mediaThumbnail === 'object' && mediaThumbnail.$ && mediaThumbnail.$.url) {
                  image = mediaThumbnail$.url;
                }
              }

              articles.push({
                headline: cleanHtmlContent(item.title || 'No headline'),
                description: cleanHtmlContent(item.contentSnippet || item.content || ''),
                published: item.pubDate || item.isoDate || new Date().toISOString(),
                link: item.link || '',
                image: image,
                story: cleanHtmlContent(item['content:encoded'] || item.content || ''),
                source: feed.source
              });
            }
            
            feedFetched = true;
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.warn(`⏱️ Timeout fetching RSS from ${feed.source} with this proxy`);
          } else {
            console.error(`❌ Error fetching RSS from ${feed.source} with this proxy:`, error);
          }
          continue;
        }
      }
      
      if (!feedFetched) {
        console.warn(`⚠️ Could not fetch ${feed.source} RSS with any proxy, skipping...`);
      }
    }

    return articles;
  };

  const fetchTeamNews = async (teamId: string, teamCode: string, teamName?: string): Promise<NewsArticle[]> => {
    const allArticles: NewsArticle[] = [];
    
    // 1. Fetch ESPN API news (team-specific)
    const endpoints = [
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/news`,
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?team=${teamId}`,
      `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/news?team=${teamId}`
    ];

    for (const url of endpoints) {
      try {
        console.log(`📰 Trying ESPN API news for ${teamCode} from: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.warn(`⚠️ Failed for ${teamCode} at ${url}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        console.log(`📦 Full news response for ${teamCode}:`, data);
        console.log(`📦 News data keys for ${teamCode}:`, Object.keys(data));

        // Try different data structures
        let articlesArray: any[] = [];
        
        if (data.articles && Array.isArray(data.articles)) {
          articlesArray = data.articles;
        } else if (data.feed && Array.isArray(data.feed)) {
          articlesArray = data.feed;
        } else if (data.items && Array.isArray(data.items)) {
          articlesArray = data.items;
        } else if (Array.isArray(data)) {
          articlesArray = data;
        }

        console.log(`📰 Found ${articlesArray.length} raw ESPN API articles for ${teamCode}`);

        if (articlesArray.length > 0) {
          // Create search terms for filtering
          const searchTerms = [
            teamCode.toLowerCase(),
            teamName?.toLowerCase() || '',
            teamName?.split(' ')[teamName.split(' ').length - 1].toLowerCase() || '' // Last word (e.g., "Lakers")
          ].filter(term => term.length > 0);
          
          // Helper function to check if a term appears as a whole word
          const containsWholeWord = (text: string, term: string): boolean => {
            const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(text);
          };

          for (const article of articlesArray.slice(0, 10)) {
            console.log(`📰 Processing ESPN API article:`, article);
            
            const headline = article.headline || article.title || article.description || 'No headline';
            
            // Filter: Only include articles where the team is mentioned in the headline as a whole word
            const isRelevant = searchTerms.some(term => containsWholeWord(headline, term));
            
            if (!isRelevant) {
              console.log(`⏭️ Skipping article (team not in headline): "${headline}"`);
              continue;
            }
            
            allArticles.push({
              headline: cleanHtmlContent(headline),
              description: cleanHtmlContent(article.description || article.story || ''),
              published: article.published || article.lastModified || '',
              link: article.links?.web?.href || article.links?.api?.news?.href || article.link || '',
              image: article.images?.[0]?.url || article.images?.[0]?.href || article.image?.url || '',
              story: cleanHtmlContent(article.story || article.body || article.content || ''),
              source: 'ESPN API'
            });
          }

          console.log(`✅ Parsed ${allArticles.length} ESPN API news articles for ${teamCode}`);
          break; // Successfully fetched from this endpoint
        }
      } catch (error) {
        console.error(`❌ Error fetching ESPN API news from ${url}:`, error);
        continue;
      }
    }
    
    // 2. Fetch RSS feed news
    if (teamName) {
      try {
        const rssArticles = await fetchRSSNews(teamCode, teamName);
        console.log(`📡 Fetched ${rssArticles.length} RSS articles for ${teamCode}`);
        allArticles.push(...rssArticles);
      } catch (error) {
        console.error(`❌ Error fetching RSS news for ${teamCode}:`, error);
      }
    }

    // 3. Deduplicate based on headline similarity
    const deduplicatedArticles: NewsArticle[] = [];
    const seenHeadlines = new Set<string>();

    for (const article of allArticles) {
      const normalizedHeadline = article.headline.toLowerCase().trim();
      if (!seenHeadlines.has(normalizedHeadline)) {
        seenHeadlines.add(normalizedHeadline);
        deduplicatedArticles.push(article);
      }
    }

    // 4. Sort by published date (newest first) and limit to 10 articles
    deduplicatedArticles.sort((a, b) => {
      if (!a.published || !b.published) return 0;
      return new Date(b.published).getTime() - new Date(a.published).getTime();
    });

    const finalArticles = deduplicatedArticles.slice(0, 10);
    console.log(`✅ Returning ${finalArticles.length} total news articles for ${teamCode} (${allArticles.length} before deduplication)`);
    
    return finalArticles;
  };



  const formatPlayerName = (fullName: string = ''): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length < 2) return fullName;
    
    const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
    const lastPart = parts[parts.length - 1];
    const hasSuffix = suffixes.includes(lastPart);
    
    if (hasSuffix && parts.length > 2) {
      const firstName = parts[0];
      const lastName = parts.slice(-2).join(' ');
      return `${firstName.charAt(0)}. ${lastName}`;
    }
    
    return `${parts[0].charAt(0)}. ${parts[parts.length - 1]}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const compareStat = (away: string, home: string, lowerIsBetter = false) => {
    const awayVal = parseFloat(away);
    const homeVal = parseFloat(home);
    if (isNaN(awayVal) || isNaN(homeVal)) return 'none';
    if (lowerIsBetter) {
      return awayVal < homeVal ? 'away' : awayVal > homeVal ? 'home' : 'none';
    }
    return awayVal > homeVal ? 'away' : awayVal < homeVal ? 'home' : 'none';
  };

  const handlePlayerClick = async (player: Starter, teamColor: string, teamLogo: string, teamCode: string) => {
    if (!player.id) {
      console.warn('No player ID available');
      return;
    }

    setLoadingPlayer(true);

    try {
      console.log(`Fetching previous game stats for player ${player.name} (${player.id})`);
      
      // Fetch player's most recent game stats
      let lastGameStats = {
        min: '-',
        pts: '-',
        reb: '-',
        ast: '-',
        fg: '-',
        '3pt': '-',
        ft: '-',
        stl: '-',
        blk: '-',
        to: '-',
        pf: '-',
      };

      // Try to get the player's recent game stats
      // Approach 1: Try the core API statistics endpoint with splits
      try {
        const statsUrl = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2026/athletes/${player.id}/statistics`;
        console.log(`Fetching player statistics from: ${statsUrl}`);
        
        const statsResponse = await fetch(statsUrl);
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Player statistics data:', statsData);
          
          // Check if there's a splits section with game logs
          if (statsData.splits?.categories) {
            const categories = statsData.splits.categories;
            console.log('Available categories:', categories.map((c: any) => c.name));
            
            // Look for game log or recent game data in the splits
            // This varies by endpoint structure, so we'll try to find recent stats
          }
        }
      } catch (statsError) {
        console.log('Core statistics endpoint failed:', statsError);
      }

      // Approach 2: Try to fetch the team's recent games and find this player's stats
      try {
        // Get today's date for the scoreboard
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        
        // Look back through recent dates to find a completed game with this player
        for (let daysBack = 1; daysBack <= 7; daysBack++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - daysBack);
          const checkDateStr = checkDate.toISOString().split('T')[0].replace(/-/g, '');
          
          try {
            const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${checkDateStr}`;
            const scoreboardResponse = await fetch(scoreboardUrl);
            
            if (scoreboardResponse.ok) {
              const scoreboardData = await scoreboardResponse.json();
              
              // Find a completed game where this player participated
              for (const event of scoreboardData.events || []) {
                if (event.status?.type?.state !== 'post') continue; // Only completed games
                
                // Check both teams' box scores
                const competition = event.competitions?.[0];
                if (!competition?.competitors) continue;
                
                for (const competitor of competition.competitors) {
                  // Check if player is in this team's box score
                  if (competitor.statistics) {
                    for (const playerStat of competitor.statistics) {
                      if (playerStat.athlete?.id === player.id) {
                        // Found the player! Extract their stats
                        const stats = playerStat.stats || [];
                        console.log(`Found player ${player.name} in game from ${checkDateStr}:`, stats);
                        
                        lastGameStats = {
                          min: stats[0] || '-', // minutes
                          pts: stats[17] || '-', // points
                          reb: stats[18] || '-', // rebounds  
                          ast: stats[19] || '-', // assists
                          fg: stats[1] && stats[2] ? `${stats[1]}-${stats[2]}` : '-', // FG made-attempted
                          '3pt': stats[4] && stats[5] ? `${stats[4]}-${stats[5]}` : '-', // 3PT made-attempted
                          ft: stats[7] && stats[8] ? `${stats[7]}-${stats[8]}` : '-', // FT made-attempted
                          stl: stats[20] || '-', // steals
                          blk: stats[21] || '-', // blocks
                          to: stats[22] || '-', // turnovers
                          pf: stats[23] || '-', // personal fouls
                        };
                        
                        console.log('Successfully parsed last game stats:', lastGameStats);
                        throw new Error('FOUND'); // Break out of all loops
                      }
                    }
                  }
                }
              }
            }
          } catch (innerError: any) {
            if (innerError.message === 'FOUND') {
              throw innerError; // Re-throw to break outer loop
            }
            console.log(`Failed to check scoreboard for ${checkDateStr}:`, innerError);
          }
        }
      } catch (recentGamesError: any) {
        if (recentGamesError.message !== 'FOUND') {
          console.error('Error fetching recent games:', recentGamesError);
        }
      }

      // Get season stats with percentages
      const seasonStats = {
        ppg: player.ppg,
        rpg: player.rpg,
        apg: player.apg,
        fgPct: '-',
        fg3Pct: '-',
        ftPct: '-'
      };

      // Try to fetch shooting percentages from stats endpoint
      try {
        const statsUrl = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2026/athletes/${player.id}/statistics/0`;
        const statsResponse = await fetch(statsUrl);
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          
          if (statsData.splits?.categories) {
            const categories = statsData.splits.categories;
            
            const findStat = (categoryName: string, statName: string) => {
              const category = categories.find((c: any) => c.name === categoryName);
              const stat = category?.stats?.find((s: any) => s.name === statName);
              return stat?.displayValue || stat?.value?.toString() || '-';
            };
            
            seasonStats.fgPct = findStat('fieldGoals', 'fieldGoalPct') || findStat('general', 'fieldGoalPct') || '-';
            seasonStats.fg3Pct = findStat('threePointFieldGoals', 'threePointFieldGoalPct') || findStat('general', 'threePointFieldGoalPct') || '-';
            seasonStats.ftPct = findStat('freeThrows', 'freeThrowPct') || findStat('general', 'freeThrowPct') || '-';
          }
        }
      } catch (statsError) {
        console.error('Error fetching shooting percentages:', statsError);
      }

      const playerCardData: PlayerCardData = {
        id: player.id,
        name: player.name,
        displayName: player.displayName,
        position: player.position,
        jerseyNumber: player.jerseyNumber,
        headshot: player.headshot,
        teamColor: teamColor,
        teamLogo: teamLogo,
        teamCode: teamCode,
        gameStats: lastGameStats,
        seasonStats: seasonStats,
      };

      setSelectedPlayer(playerCardData);
    } catch (error) {
      console.error('Error displaying player card:', error);
    } finally {
      setLoadingPlayer(false);
    }
  };

  const awayColor = game.awayTeam.color || '#49256C';
  const homeColor = game.homeTeam.color || '#1D1160';

  const gameDate = game.date ? formatDate(game.date) : '';
  const location = game.city && game.state ? `${game.city}, ${game.state}` : '';
  const arena = game.arena || '';

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2"
      onClick={onClose}
      style={{ 
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        ...(isStandalone && {
          touchAction: 'none',
        })
      }}
    >
      <div 
        className="relative rounded-[12px] w-full max-w-[393px] h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          willChange: 'transform',
          ...(isStandalone && {
            touchAction: 'pan-y',
          })
        }}
      >
        {/* Background */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
          <div className="absolute bg-black inset-0 rounded-[12px]" />
          <div 
            className="absolute bg-repeat inset-0 opacity-10 rounded-[12px]" 
            style={{ 
              backgroundImage: `url('${imgModal}')`,
              backgroundSize: '30.72px 30.72px',
              backgroundPosition: 'top left'
            }} 
          />
        </div>

        <div 
          className="relative overflow-y-auto rounded-[inherit] h-full"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            transform: 'translate3d(0,0,0)',
            WebkitTransform: 'translate3d(0,0,0)'
          }}
        >
          {/* Header */}
          <div className="relative content-stretch flex h-[32px] items-center justify-between px-[8px] py-[12px] w-full">
            <p className="font-['Barlow:Bold',sans-serif] leading-none relative shrink-0 text-[11px] text-nowrap text-white tracking-[0.22px] uppercase z-10">
              {game.time} | {game.awayTeam.code} at {game.homeTeam.code}
            </p>
            <div className="flex items-center gap-2 z-10">
              <p className="font-['Barlow:SemiBold',sans-serif] leading-none relative shrink-0 text-[#c7c7cc] text-[11px] text-nowrap text-right tracking-[0.22px]">
                {game.network}
              </p>
              <button 
                onClick={onClose}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="text-white/60 hover:text-white transition-colors p-0.5 touch-manipulation"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
          </div>

          {/* Hero Section */}
          <div className="relative h-[128px] overflow-hidden">
            {/* Away Team Background */}
            <div className="absolute h-[128px] left-0 top-0 w-[232.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232.5 128">
                <g>
                  <path d="M0 0H232.5L152.5 128H0V0Z" fill={`${awayColor}80`} />
                  <path d="M0 0H232.5L152.5 128H0V0Z" fill="url(#paint0_linear_away)" />
                </g>
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_away" x1="116.25" x2="116.25" y1="0" y2="128">
                    <stop offset="0.5" stopOpacity="0" />
                    <stop offset="1" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Home Team Background */}
            <div className="absolute flex h-[128px] items-center justify-center right-0 top-0 w-[232.5px]">
              <div className="flex-none rotate-[180deg]">
                <div className="h-[128px] relative w-[232.5px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232.5 128">
                    <g>
                      <path d="M0 0H232.5L152.5 128H0V0Z" fill={`${homeColor}80`} />
                      <path d="M0 0H232.5L152.5 128H0V0Z" fill="url(#paint0_linear_home)" />
                    </g>
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_home" x1="116.25" x2="116.25" y1="128" y2="0">
                        <stop offset="0.5" stopOpacity="0" />
                        <stop offset="1" stopOpacity="0.75" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Team Logos */}
            <div className="absolute left-[calc(50%-104.5px)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] size-[128px] top-0 translate-x-[-50%] z-10">
              <img alt={game.awayTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.awayTeam.logo} />
            </div>

            <div className="absolute right-[24px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] size-[128px] top-1/2 translate-y-[-50%] z-10">
              <img alt={game.homeTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.homeTeam.logo} />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute backdrop-blur-[2px] backdrop-filter bg-gradient-to-t bottom-0 from-[#0a0a0a] h-[128px] left-0 to-[rgba(10,10,10,0.5)] w-full z-20 pt-[0px] pr-[0px] pb-[8px] pl-[0px] m-[0px]" />

            {/* Team Info */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-[8px] pb-[8px] z-30 py-[0px]">
              <div className="flex gap-[8px] items-center">
                <div 
                  className="bg-[#350071] h-[20px] relative rounded-[4px] shrink-0 w-[48px]"
                  style={{ backgroundColor: awayColor }}
                >
                  <div className="overflow-clip relative rounded-[inherit] size-full">
                    <div className="absolute left-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <img alt={game.awayTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.awayTeam.logo} />
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" />
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none">
                  <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase font-['Barlow:SemiBold',sans-serif]">{game.awayTeam.code}</p>
                  <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px] font-['Barlow:SemiBold',sans-serif]">{game.awayTeam.record}</p>
                </div>
              </div>

              <div className="flex gap-[8px] items-center">
                <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none">
                  <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase font-['Barlow:SemiBold',sans-serif]">{game.homeTeam.code}</p>
                  <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px] font-['Barlow:SemiBold',sans-serif]">{game.homeTeam.record}</p>
                </div>
                <div 
                  className="bg-[#1d1160] h-[20px] relative rounded-[4px] shrink-0 w-[48px]"
                  style={{ backgroundColor: homeColor }}
                >
                  <div className="overflow-clip relative rounded-[inherit] size-full">
                    <div className="absolute left-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                      <img alt={game.homeTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.homeTeam.logo} />
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" />
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.6)]" />
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="absolute bottom-[72px] flex flex-col font-['Barlow:SemiBold',sans-serif] justify-end leading-[1.2] left-[8px] not-italic text-[9px] text-nowrap text-white tracking-[0.36px] uppercase z-30">
              <p className="mb-0">{gameDate}</p>
              <p className="mb-0">{location}</p>
              <p>{arena}</p>
            </div>

            <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_8px_24px_0px_rgba(255,255,255,0.2)] z-40" />
          </div>

          {/* View Selector */}
          <div className="relative w-full border-b border-[#181919] flex justify-center items-stretch font-['SF_Pro:Semibold',sans-serif] font-[590] text-[15px]">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('stats');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('stats');
                }}
                className="flex-1 py-4 text-center transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'stats' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                Team Stats
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('rosters');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('rosters');
                }}
                className="flex-1 py-4 text-center transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'rosters' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                Rosters
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('standings');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('standings');
                }}
                className="flex-1 py-4 text-center transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'standings' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                Standings
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('news');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('news');
                }}
                className="flex-1 py-4 text-center transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'news' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                News
              </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-8 text-center text-white/50 font-['Barlow:SemiBold',sans-serif]">
              Loading pregame data...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 font-['Barlow:SemiBold',sans-serif]">
              {error}
            </div>
          ) : (
            <>
              {selectedView === 'rosters' && (
                <div className="p-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                  {/* Away Starters */}
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <img src={game.awayTeam.logo} alt={game.awayTeam.code} className="w-4 h-4" />
                      <h3 className="text-white/60 font-['Barlow:Bold',sans-serif] text-[10px] uppercase tracking-wider">
                        {game.awayTeam.code}
                      </h3>
                    </div>
                    {awayStarters.length > 0 ? (
                      <div className="bg-white/5 rounded border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-2 py-1.5">Player</th>
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">PPG</th>
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">RPG</th>
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">APG</th>
                            </tr>
                          </thead>
                          <tbody>
                            {awayStarters.map((player, idx) => (
                              <tr
                                key={idx}
                                onClick={() => handlePlayerClick(player, game.awayTeam.color, game.awayTeam.logo, game.awayTeam.code)}
                                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <td className="px-2 py-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white text-[12px] font-['Barlow:SemiBold',sans-serif] truncate leading-tight block max-w-[65px]">{player.displayName}</span>
                                    {player.injury && (
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white text-[8px] font-['Barlow:Bold',sans-serif] flex items-center justify-center leading-none" title={`${player.injury.status} - ${player.injury.description}`}>
                                        {getInjuryDesignation(player.injury.status)}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-white text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-2 text-center">{player.ppg}</td>
                                <td className="text-white text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-2 text-center">{player.rpg}</td>
                                <td className="text-white text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-2 text-center">{player.apg}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-[#8e8e93] text-[11px] font-['Barlow:Regular',sans-serif]">No player information available</p>
                    )}
                  </div>

                  {/* Home Starters */}
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <img src={game.homeTeam.logo} alt={game.homeTeam.code} className="w-4 h-4" />
                      <h3 className="text-white/60 font-['Barlow:Bold',sans-serif] text-[10px] uppercase tracking-wider">
                        {game.homeTeam.code}
                      </h3>
                    </div>
                    {homeStarters.length > 0 ? (
                      <div className="bg-white/5 rounded border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-2 py-1.5">Player</th>
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">PPG</th>
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">RPG</th>
                              <th className="text-white/50 text-[9px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">APG</th>
                            </tr>
                          </thead>
                          <tbody>
                            {homeStarters.map((player, idx) => (
                              <tr
                                key={idx}
                                onClick={() => handlePlayerClick(player, game.homeTeam.color, game.homeTeam.logo, game.homeTeam.code)}
                                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <td className="px-2 py-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white text-[12px] font-['Barlow:SemiBold',sans-serif] truncate leading-tight block max-w-[65px]">{player.displayName}</span>
                                    {player.injury && (
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white text-[8px] font-['Barlow:Bold',sans-serif] flex items-center justify-center leading-none" title={`${player.injury.status} - ${player.injury.description}`}>
                                        {getInjuryDesignation(player.injury.status)}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-white text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-2 text-center">{player.ppg}</td>
                                <td className="text-white text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-2 text-center">{player.rpg}</td>
                                <td className="text-white text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-2 text-center">{player.apg}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-[#8e8e93] text-[11px] font-['Barlow:Regular',sans-serif]">No player information available</p>
                    )}
                  </div>
                  </div>
                </div>
              )}

              {selectedView === 'standings' && (
                <div className="p-2.5">
                  {/* Conference Selector (East/West) */}
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => setSelectedConference('Eastern Conference')}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedConference('Eastern Conference');
                      }}
                      className={`flex-1 py-1.5 px-3 rounded text-[11px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide transition-colors touch-manipulation ${
                        selectedConference === 'Eastern Conference' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        position: 'relative',
                        zIndex: 10,
                        pointerEvents: 'auto'
                      }}
                    >
                      East
                    </button>
                    <button 
                      onClick={() => setSelectedConference('Western Conference')}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedConference('Western Conference');
                      }}
                      className={`flex-1 py-1.5 px-3 rounded text-[11px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide transition-colors touch-manipulation ${
                        selectedConference === 'Western Conference' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        position: 'relative',
                        zIndex: 10,
                        pointerEvents: 'auto'
                      }}
                    >
                      West
                    </button>
                  </div>

                  <div className="bg-white/5 rounded border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-2 py-1.5 sticky left-0 bg-white/5">Team</th>
                          <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">W</th>
                          <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">L</th>
                          <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">PCT</th>
                          <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">GB</th>
                          <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center">STRK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Filter standings by selected conference
                          const filteredStandings = standings.filter(team => 
                            team.conferenceName === selectedConference
                          );
                          
                          return filteredStandings.map((team, idx) => {
                            const isMatchupTeam = team.id === game.awayTeam.id || team.id === game.homeTeam.id;
                            const seed = idx + 1;
                            
                            // Determine seed highlight color
                            let seedBgColor = 'transparent';
                            let seedBorderColor = 'transparent';
                            if (seed >= 1 && seed <= 6) {
                              // Playoff seeds (1-6): green highlight
                              seedBgColor = 'rgba(34, 197, 94, 0.2)';
                              seedBorderColor = 'rgba(34, 197, 94, 0.4)';
                            } else if (seed >= 7 && seed <= 10) {
                              // Play-in seeds (7-10): yellow/orange highlight
                              seedBgColor = 'rgba(251, 191, 36, 0.2)';
                              seedBorderColor = 'rgba(251, 191, 36, 0.4)';
                            }
                            
                            return (
                              <tr
                                key={idx}
                                className={`border-b border-white/5 last:border-0 ${isMatchupTeam ? 'bg-white/10' : ''}`}
                              >
                                <td className="px-2 py-1.5 sticky left-0" style={{ backgroundColor: isMatchupTeam ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)' }}>
                                  <div className="flex items-center gap-1.5">
                                    <div 
                                      className="flex items-center justify-center w-5 h-5 rounded-sm text-[11px] font-['Barlow:Bold',sans-serif]"
                                      style={{ 
                                        backgroundColor: seedBgColor,
                                        border: `1px solid ${seedBorderColor}`,
                                        color: seed <= 10 ? '#ffffff' : 'rgba(255,255,255,0.6)'
                                      }}
                                    >
                                      {seed}
                                    </div>
                                    <img src={team.logo} alt={team.name} className="w-5 h-5" />
                                    <span className={`text-[13px] font-['Barlow:SemiBold',sans-serif] ${isMatchupTeam ? 'text-white' : 'text-white/80'}`}>{team.name}</span>
                                  </div>
                                </td>
                                <td className={`text-[13px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center ${isMatchupTeam ? 'text-white' : 'text-white/80'}`}>{team.wins}</td>
                                <td className={`text-[13px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center ${isMatchupTeam ? 'text-white' : 'text-white/80'}`}>{team.losses}</td>
                                <td className={`text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center ${isMatchupTeam ? 'text-white' : 'text-white/80'}`}>{team.winPct}</td>
                                <td className={`text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center ${isMatchupTeam ? 'text-white' : 'text-white/60'}`}>{team.gb}</td>
                                <td className={`text-[12px] font-['Barlow:SemiBold',sans-serif] px-1 py-1.5 text-center ${isMatchupTeam ? 'text-white' : 'text-white/60'}`}>{team.streak}</td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedView === 'news' && (
                <div className="p-2.5">
                  {(() => {
                    // Combine and deduplicate news articles
                    const combinedNews: (NewsArticle & { teams: ('away' | 'home')[] })[] = [];
                    const headlineMap = new Map<string, number>();

                    // Add away team news
                    awayNews.forEach(article => {
                      const normalizedHeadline = article.headline.toLowerCase().trim();
                      if (headlineMap.has(normalizedHeadline)) {
                        const index = headlineMap.get(normalizedHeadline)!;
                        if (!combinedNews[index].teams.includes('away')) {
                          combinedNews[index].teams.push('away');
                        }
                      } else {
                        headlineMap.set(normalizedHeadline, combinedNews.length);
                        combinedNews.push({ ...article, teams: ['away'] });
                      }
                    });

                    // Add home team news
                    homeNews.forEach(article => {
                      const normalizedHeadline = article.headline.toLowerCase().trim();
                      if (headlineMap.has(normalizedHeadline)) {
                        const index = headlineMap.get(normalizedHeadline)!;
                        if (!combinedNews[index].teams.includes('home')) {
                          combinedNews[index].teams.push('home');
                        }
                      } else {
                        headlineMap.set(normalizedHeadline, combinedNews.length);
                        combinedNews.push({ ...article, teams: ['home'] });
                      }
                    });

                    // Sort by published date (newest first)
                    combinedNews.sort((a, b) => {
                      if (!a.published || !b.published) return 0;
                      return new Date(b.published).getTime() - new Date(a.published).getTime();
                    });

                    return combinedNews.length > 0 ? (
                      <div className="space-y-2.5">
                        {combinedNews.map((article, idx) => {
                          return (
                            <div
                              key={idx}
                              className="flex gap-2.5 bg-white/5 rounded-lg border border-white/10 p-2.5 hover:bg-white/10 hover:border-white/20 active:bg-white/15 transition-all cursor-pointer"
                              onClick={() => setSelectedArticle(article)}
                            >
                              {article.image && (
                                <div className="flex items-center flex-shrink-0">
                                  <div className="w-24 h-[54px] rounded overflow-hidden bg-white/10">
                                    <img 
                                      src={article.image} 
                                      alt={article.headline}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-1.5 mb-1">
                                  {article.teams.includes('away') && (
                                    <div 
                                      className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                                      style={{ backgroundColor: `${game.awayTeam.color}40` }}
                                    >
                                      <img src={game.awayTeam.logo} alt={game.awayTeam.code} className="w-3 h-3" />
                                      <span className="text-white text-[9px] font-['Barlow:Bold',sans-serif] uppercase">
                                        {game.awayTeam.code}
                                      </span>
                                    </div>
                                  )}
                                  {article.teams.includes('home') && (
                                    <div 
                                      className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                                      style={{ backgroundColor: `${game.homeTeam.color}40` }}
                                    >
                                      <img src={game.homeTeam.logo} alt={game.homeTeam.code} className="w-3 h-3" />
                                      <span className="text-white text-[9px] font-['Barlow:Bold',sans-serif] uppercase">
                                        {game.homeTeam.code}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <h4 className="text-white text-[13px] font-['Barlow:SemiBold',sans-serif] leading-[1.3] mb-1.5 line-clamp-2">
                                  {article.headline}
                                </h4>
                                {article.description && (
                                  <p className="text-white/65 text-[11px] font-['Barlow:Regular',sans-serif] leading-[1.4] line-clamp-2">
                                    {article.description}
                                  </p>
                                )}
                                {article.published && (
                                  <p className="text-white/40 text-[9px] font-['Barlow:Regular',sans-serif] mt-1">
                                    {new Date(article.published).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white/5 rounded border border-white/10 p-4">
                        <p className="text-[#8e8e93] text-[12px] font-['Barlow:Regular',sans-serif] text-center">
                          No news available for this matchup
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {selectedView === 'stats' && (
                <div>
                  {/* PPG */}
                  <div className="relative h-[36px] w-full">
                    <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                      <div className={`flex-1 text-right ${compareStat(game.awayTeam.ppg, game.homeTeam.ppg) === 'away' ? 'text-white' : 'text-white/60'}`}>
                        <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{game.awayTeam.ppg}</span>
                      </div>
                      <div className="w-[88px] text-center">
                        <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">PPG</span>
                      </div>
                      <div className={`flex-1 text-left ${compareStat(game.awayTeam.ppg, game.homeTeam.ppg) === 'home' ? 'text-white' : 'text-white/60'}`}>
                        <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{game.homeTeam.ppg}</span>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    {compareStat(game.awayTeam.ppg, game.homeTeam.ppg) === 'away' && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                    )}
                    {compareStat(game.awayTeam.ppg, game.homeTeam.ppg) === 'home' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                    )}
                  </div>

                  {/* oPPG */}
                  <div className="relative h-[36px] w-full">
                    <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                      <div className={`flex-1 text-right ${compareStat(game.awayTeam.oppg, game.homeTeam.oppg, true) === 'away' ? 'text-white' : 'text-white/60'}`}>
                        <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{game.awayTeam.oppg}</span>
                      </div>
                      <div className="w-[88px] text-center">
                        <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">oPPG</span>
                      </div>
                      <div className={`flex-1 text-left ${compareStat(game.awayTeam.oppg, game.homeTeam.oppg, true) === 'home' ? 'text-white' : 'text-white/60'}`}>
                        <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{game.homeTeam.oppg}</span>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    {compareStat(game.awayTeam.oppg, game.homeTeam.oppg, true) === 'away' && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                    )}
                    {compareStat(game.awayTeam.oppg, game.homeTeam.oppg, true) === 'home' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                    )}
                  </div>

                  {awayStats && homeStats && (
                    <>
                      {/* FG% */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.fgPct, homeStats.fgPct) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.fgPct}%</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">FG%</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.fgPct, homeStats.fgPct) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.fgPct}%</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.fgPct, homeStats.fgPct) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.fgPct, homeStats.fgPct) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* 3P% */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.fg3Pct, homeStats.fg3Pct) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.fg3Pct}%</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">3P%</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.fg3Pct, homeStats.fg3Pct) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.fg3Pct}%</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.fg3Pct, homeStats.fg3Pct) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.fg3Pct, homeStats.fg3Pct) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* FT% */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.ftPct, homeStats.ftPct) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.ftPct}%</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">FT%</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.ftPct, homeStats.ftPct) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.ftPct}%</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.ftPct, homeStats.ftPct) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.ftPct, homeStats.ftPct) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* RPG */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.rpg, homeStats.rpg) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.rpg}</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">RPG</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.rpg, homeStats.rpg) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.rpg}</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.rpg, homeStats.rpg) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.rpg, homeStats.rpg) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* APG */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.apg, homeStats.apg) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.apg}</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">APG</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.apg, homeStats.apg) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.apg}</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.apg, homeStats.apg) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.apg, homeStats.apg) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* TOG */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.topg, homeStats.topg, true) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.topg}</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">TOG</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.topg, homeStats.topg, true) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.topg}</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.topg, homeStats.topg, true) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.topg, homeStats.topg, true) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* BPG */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.bpg, homeStats.bpg) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.bpg}</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">BPG</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.bpg, homeStats.bpg) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.bpg}</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.bpg, homeStats.bpg) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.bpg, homeStats.bpg) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>

                      {/* SPG */}
                      <div className="relative h-[36px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
                          <div className={`flex-1 text-right ${compareStat(awayStats.spg, homeStats.spg) === 'away' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{awayStats.spg}</span>
                          </div>
                          <div className="w-[88px] text-center">
                            <span className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[13px] uppercase tracking-wide">SPG</span>
                          </div>
                          <div className={`flex-1 text-left ${compareStat(awayStats.spg, homeStats.spg) === 'home' ? 'text-white' : 'text-white/60'}`}>
                            <span className="font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[16px]">{homeStats.spg}</span>
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
                        {compareStat(awayStats.spg, homeStats.spg) === 'away' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: awayColor }} />
                        )}
                        {compareStat(awayStats.spg, homeStats.spg) === 'home' && (
                          <div className="absolute right-0 top-0 bottom-0 w-[3px] pointer-events-none" style={{ backgroundColor: homeColor }} />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
        <div aria-hidden="true" className="absolute border border-[#202020] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>

      {/* Player Card Modal */}
      {selectedPlayer && (
        <PlayerCard
          playerId={selectedPlayer.id}
          playerName={selectedPlayer.name}
          displayName={selectedPlayer.displayName}
          position={selectedPlayer.position}
          jerseyNumber={selectedPlayer.jerseyNumber}
          headshot={selectedPlayer.headshot}
          teamColor={selectedPlayer.teamColor}
          teamLogo={selectedPlayer.teamLogo}
          teamCode={selectedPlayer.teamCode}
          gameStats={selectedPlayer.gameStats}
          seasonStats={selectedPlayer.seasonStats}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {/* Article Drawer */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="relative rounded-t-[20px] w-full max-w-[393px] max-h-[80vh] bg-[#1c1c1e] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Handle */}
            <div className="flex justify-center pt-2 pb-3">

            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-5 pb-8 animate-fade-in" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
              {/* Article Image */}
              {selectedArticle.image && (
                <div className="w-full h-[200px] rounded-lg overflow-hidden bg-white/10 mb-4 shadow-lg">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Team Badges */}
              <div className="flex items-center gap-2 mb-3">
                {selectedArticle.teams.includes('away') && (
                  <div 
                    className="flex items-center gap-1.5 px-2 py-1 rounded"
                    style={{ backgroundColor: `${game.awayTeam.color}40` }}
                  >
                    <img src={game.awayTeam.logo} alt={game.awayTeam.code} className="w-4 h-4" />
                    <span className="text-white text-[11px] font-['Barlow:Bold',sans-serif] uppercase">
                      {game.awayTeam.code}
                    </span>
                  </div>
                )}
                {selectedArticle.teams.includes('home') && (
                  <div 
                    className="flex items-center gap-1.5 px-2 py-1 rounded"
                    style={{ backgroundColor: `${game.homeTeam.color}40` }}
                  >
                    <img src={game.homeTeam.logo} alt={game.homeTeam.code} className="w-4 h-4" />
                    <span className="text-white text-[11px] font-['Barlow:Bold',sans-serif] uppercase">
                      {game.homeTeam.code}
                    </span>
                  </div>
                )}
              </div>

              {/* Headline */}
              <h2 className="text-white text-[20px] font-['Barlow:Bold',sans-serif] leading-[1.25] mb-4">
                {selectedArticle.headline}
              </h2>

              {/* Published Date & Source */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                {selectedArticle.published && (
                  <p className="text-white/50 text-[11px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide">
                    {new Date(selectedArticle.published).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })} · {new Date(selectedArticle.published).toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                )}
                {selectedArticle.source && (
                  <>
                    <span className="text-white/30">•</span>
                    <p className="text-white/40 text-[10px] font-['Barlow:Medium',sans-serif] uppercase tracking-wider">
                      {selectedArticle.source.replace(' RSS', '')}
                    </p>
                  </>
                )}
              </div>

              {/* Description/Intro */}
              {selectedArticle.description && (
                <div className="text-white/90 text-[15px] font-['Barlow:Medium',sans-serif] leading-[1.6] mb-5 italic border-l-2 border-white/20 pl-3">
                  {selectedArticle.description}
                </div>
              )}

              {/* Full Story Content */}
              {selectedArticle.story && (
                <div className="text-white/85 text-[14px] font-['Barlow:Regular',sans-serif] leading-[1.7] mb-6">
                  {selectedArticle.story.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Read Full Article Link */}
              {selectedArticle.link && (
                <a
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 transition-all rounded-xl py-3.5 px-5 text-white border border-white/20 hover:border-white/30 shadow-lg"
                >
                  <span className="text-[14px] font-['Barlow:SemiBold',sans-serif]">
                    Read Full Article on {selectedArticle.source?.replace(' RSS', '').replace(' API', '') || 'ESPN'}
                  </span>
                  <ExternalLink size={17} className="opacity-70" />
                </a>
              )}
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-white hover:text-white transition-colors bg-black/60 backdrop-blur-xl rounded-full p-2 shadow-lg border border-white/20"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}