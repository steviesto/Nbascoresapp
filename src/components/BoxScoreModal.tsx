import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import imgModal from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";
import PlayerCard from './PlayerCard';

interface Team {
  code: string;
  name: string;
  logo: string;
  score?: number;
  record?: string;
  color?: string;
  fgPct?: string;
  fgM?: string; // Field goals made
  fgA?: string; // Field goals attempted
  threePM?: string;
  threePA?: string;
  ftM?: string;
  ftA?: string;
  turnovers?: string;
  totalRebounds?: string;
  assists?: string;
  steals?: string;
  blocks?: string;
  pointsInPaint?: string;
  fastBreakPoints?: string;
  benchPoints?: string;
  biggestLead?: string;
  id?: string; // ESPN team ID for fetching injuries
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

interface EnrichedGame {
  id: string;
  awayTeam: Team;
  homeTeam: Team;
  date: string;
  status: string;
  time?: string;
  location?: string;
  arena?: string;
  city?: string;
  state?: string;
  broadcast?: string;
  boxScoreData?: any;
  period?: number;
  quarter?: number;
  clock?: string;
  statusDetail?: string;
}

interface BoxScoreModalProps {
  game: EnrichedGame;
  onClose: () => void;
}

export default function BoxScoreModal({ game, onClose }: BoxScoreModalProps) {
  const [selectedView, setSelectedView] = useState<'away' | 'team' | 'home' | 'injuries'>('team');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCardData | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  
  // Detect if running as PWA in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
  
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Debug: Log the entire game object to see what we're receiving
  console.log('🎮 BoxScoreModal rendered with game:', {
    id: game.id,
    awayTeam: {
      code: game.awayTeam.code,
      id: game.awayTeam.id,
      name: game.awayTeam.name
    },
    homeTeam: {
      code: game.homeTeam.code,
      id: game.homeTeam.id,
      name: game.homeTeam.name
    },
    fullGame: game
  });
  
  const awayScore = game.awayTeam.score || 0;
  const homeScore = game.homeTeam.score || 0;
  const awayWins = awayScore > homeScore;
  const homeWins = homeScore > awayScore;

  // Map team codes to full team names
  const getTeamFullName = (code: string): string => {
    const teamNames: { [key: string]: string } = {
      'ATL': 'Atlanta Hawks',
      'BOS': 'Boston Celtics',
      'BKN': 'Brooklyn Nets',
      'CHA': 'Charlotte Hornets',
      'CHI': 'Chicago Bulls',
      'CLE': 'Cleveland Cavaliers',
      'DAL': 'Dallas Mavericks',
      'DEN': 'Denver Nuggets',
      'DET': 'Detroit Pistons',
      'GSW': 'Golden State Warriors',
      'HOU': 'Houston Rockets',
      'IND': 'Indiana Pacers',
      'LAC': 'LA Clippers',
      'LAL': 'Los Angeles Lakers',
      'MEM': 'Memphis Grizzlies',
      'MIA': 'Miami Heat',
      'MIL': 'Milwaukee Bucks',
      'MIN': 'Minnesota Timberwolves',
      'NOP': 'New Orleans Pelicans',
      'NYK': 'New York Knicks',
      'OKC': 'Oklahoma City Thunder',
      'ORL': 'Orlando Magic',
      'PHI': 'Philadelphia 76ers',
      'PHX': 'Phoenix Suns',
      'POR': 'Portland Trail Blazers',
      'SAC': 'Sacramento Kings',
      'SAS': 'San Antonio Spurs',
      'TOR': 'Toronto Raptors',
      'UTA': 'Utah Jazz',
      'WAS': 'Washington Wizards',
    };
    return teamNames[code] || code;
  };



  // Normalize team abbreviations
  const normalizeTeamAbbr = (abbr: string | undefined): string => {
    if (!abbr) return '';
    const mapping: { [key: string]: string } = {
      'GS': 'GSW',
      'SA': 'SAS',
      'NY': 'NYK',
      'NO': 'NOP',
      'WSH': 'WAS',
    };
    return mapping[abbr] || abbr;
  };

  // Extract quarter scores
  const getQuarterScores = () => {
    const competitions = game.boxScoreData?.header?.competitions;
    if (!competitions || competitions.length === 0) return { away: [], home: [] };

    const competitors = competitions[0]?.competitors;
    if (!competitors) return { away: [], home: [] };

    const awayTeamData = competitors.find((competitor: any) => 
      competitor.homeAway === 'away'
    );

    const homeTeamData = competitors.find((competitor: any) => 
      competitor.homeAway === 'home'
    );

    // Get quarter scores from linescores
    const awayQuarters = awayTeamData?.linescores?.map((ls: any) => ls.displayValue || '0') || [];
    const homeQuarters = homeTeamData?.linescores?.map((ls: any) => ls.displayValue || '0') || [];

    return {
      away: awayQuarters,
      home: homeQuarters
    };
  };

  const quarterScores = getQuarterScores();
  
  // Debug logging for quarter totals
  useEffect(() => {
    console.log('Quarter Scores Debug:', {
      away: quarterScores.away,
      home: quarterScores.home,
      awayLength: quarterScores.away.length,
      homeLength: quarterScores.home.length
    });
    
    if (quarterScores.away.length > 0 && quarterScores.home.length > 0) {
      const totals = quarterScores.away.map((awayScore, idx) => {
        const homeScore = quarterScores.home[idx] || '0';
        const total = parseInt(awayScore) + parseInt(homeScore);
        return total;
      });
      console.log('Quarter Totals:', totals);
    }
  }, [quarterScores.away, quarterScores.home]);

  // Extract player stats from box score
  const getPlayerStats = (teamAbbr: string) => {
    if (!game.boxScoreData?.boxscore?.players) return [];
    
    const playerData = game.boxScoreData.boxscore.players;
    const teamPlayers = playerData.find((team: any) => {
      const normalizedAbbr = normalizeTeamAbbr(team.team?.abbreviation);
      return normalizedAbbr === teamAbbr;
    });
    
    if (!teamPlayers?.statistics?.[0]?.athletes) return [];
    
    const labels = teamPlayers.statistics[0]?.labels || [];
    
    // Create a mapping of stat name to index
    const getStatIndex = (statName: string) => {
      const index = labels.indexOf(statName);
      return index >= 0 ? index : -1;
    };
    
    const players = teamPlayers.statistics[0].athletes.map((athlete: any, index: number) => {
      const stats = athlete.stats || [];
      const minutes = stats[getStatIndex('MIN')] || '0';
      const didNotPlay = minutes === '0' || minutes === '0:00' || !minutes;
      
      const fullName = athlete.athlete?.displayName || 'Unknown';
      const nameParts = fullName.split(' ');
      
      // Common name suffixes
      const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'Jr', 'Sr'];
      const lastPart = nameParts[nameParts.length - 1];
      const hasSuffix = suffixes.includes(lastPart);
      
      let firstName, lastName;
      if (hasSuffix && nameParts.length > 2) {
        // If there's a suffix, the last name includes the second-to-last part and the suffix
        firstName = nameParts.slice(0, -2).join(' ');
        lastName = nameParts.slice(-2).join(' '); // e.g., "Jackson Jr."
      } else {
        // Normal case: first name is everything except the last word
        firstName = nameParts.slice(0, -1).join(' ');
        lastName = nameParts[nameParts.length - 1];
      }
      
      const firstInitial = firstName.charAt(0);
      const formattedName = `${firstInitial}. ${lastName}`;
      
      // Assume first 5 players are starters
      const isStarter = index < 5;
      
      return {
        name: fullName,
        displayName: formattedName,
        position: athlete.athlete?.position?.abbreviation || '',
        didNotPlay,
        isStarter,
        min: didNotPlay ? 'DNP' : minutes,
        pts: didNotPlay ? '-' : (stats[getStatIndex('PTS')] || '0'),
        reb: didNotPlay ? '-' : (stats[getStatIndex('REB')] || '0'),
        ast: didNotPlay ? '-' : (stats[getStatIndex('AST')] || '0'),
        fg: didNotPlay ? '-' : (stats[getStatIndex('FG')] || '0-0'),
        '3pt': didNotPlay ? '-' : (stats[getStatIndex('3PT')] || '0-0'),
        ft: didNotPlay ? '-' : (stats[getStatIndex('FT')] || '0-0'),
        stl: didNotPlay ? '-' : (stats[getStatIndex('STL')] || '0'),
        blk: didNotPlay ? '-' : (stats[getStatIndex('BLK')] || '0'),
        to: didNotPlay ? '-' : (stats[getStatIndex('TO')] || '0'),
        pf: didNotPlay ? '-' : (stats[getStatIndex('PF')] || '0'),
      };
    });
    
    // Sort: starters first, then bench
    return players.sort((a, b) => {
      if (a.isStarter && !b.isStarter) return -1;
      if (!a.isStarter && b.isStarter) return 1;
      return 0;
    });
  };

  const awayPlayers = getPlayerStats(game.awayTeam.code);
  const homePlayers = getPlayerStats(game.homeTeam.code);

  // Fetch player details and season stats
  const handlePlayerClick = async (playerName: string, teamCode: string) => {
    // Find the player in the box score data to get their ID
    const playerData = game.boxScoreData?.boxscore?.players;
    if (!playerData) return;

    const normalizedTeamCode = normalizeTeamAbbr(teamCode);
    const teamPlayers = playerData.find((team: any) => {
      const normalizedAbbr = normalizeTeamAbbr(team.team?.abbreviation);
      return normalizedAbbr === normalizedTeamCode;
    });

    if (!teamPlayers?.statistics?.[0]?.athletes) return;

    const athleteData = teamPlayers.statistics[0].athletes.find(
      (a: any) => a.athlete?.displayName === playerName
    );

    if (!athleteData?.athlete) return;

    const playerId = athleteData.athlete.id || 'unknown';
    const position = athleteData.athlete.position?.abbreviation || athleteData.athlete.position?.displayName || 'N/A';
    const jerseyNumber = athleteData.athlete.jersey || 'N/A';
    const headshot = athleteData.athlete.headshot?.href || '';

    // Get game stats for this player
    const players = selectedView === 'away' ? awayPlayers : homePlayers;
    const playerGameStats = players.find(p => p.name === playerName);
    if (!playerGameStats) return;

    setLoadingPlayer(true);
    
    try {
      const teamInfo = selectedView === 'away' 
        ? { color: awayColor, logo: game.awayTeam.logo, code: game.awayTeam.code }
        : { color: homeColor, logo: game.homeTeam.logo, code: game.homeTeam.code };

      let seasonAverages = undefined;

      // Try multiple approaches to fetch season stats
      if (playerId !== 'unknown') {
        // Approach 1: Try the athlete profile endpoint
        try {
          const athleteResponse = await fetch(
            `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}?enable=stats`
          );
          
          if (athleteResponse.ok) {
            const athleteData = await athleteResponse.json();
            console.log('Athlete data:', athleteData);
            
            // Look for season stats in the statsSummary object
            if (athleteData.athlete?.statsSummary?.statistics) {
              const stats = athleteData.athlete.statsSummary.statistics;
              console.log('All available stats:', stats.map((s: any) => ({ name: s.name, displayValue: s.displayValue, value: s.value })));
              
              const findStat = (statName: string) => {
                const stat = stats.find((s: any) => s.name === statName);
                return stat?.displayValue || '-';
              };

              // Try multiple possible field names for shooting percentages
              const getFGPct = () => {
                return findStat('fieldGoalPct') !== '-' ? findStat('fieldGoalPct') : 
                       findStat('fgPct') !== '-' ? findStat('fgPct') : 
                       findStat('avgFieldGoalPct') !== '-' ? findStat('avgFieldGoalPct') : '-';
              };

              const get3PTPct = () => {
                return findStat('threePointFieldGoalPct') !== '-' ? findStat('threePointFieldGoalPct') : 
                       findStat('threePtPct') !== '-' ? findStat('threePtPct') : 
                       findStat('3ptPct') !== '-' ? findStat('3ptPct') : 
                       findStat('avgThreePointFieldGoalPct') !== '-' ? findStat('avgThreePointFieldGoalPct') : '-';
              };

              const getFTPct = () => {
                return findStat('freeThrowPct') !== '-' ? findStat('freeThrowPct') : 
                       findStat('ftPct') !== '-' ? findStat('ftPct') : 
                       findStat('avgFreeThrowPct') !== '-' ? findStat('avgFreeThrowPct') : '-';
              };

              seasonAverages = {
                ppg: findStat('avgPoints'),
                rpg: findStat('avgRebounds'),
                apg: findStat('avgAssists'),
                fgPct: getFGPct(),
                fg3Pct: get3PTPct(),
                ftPct: getFTPct(),
              };
              console.log('Season averages from athlete endpoint:', seasonAverages);
            }
          }
        } catch (athleteError) {
          console.log('Athlete endpoint failed:', athleteError);
        }

        // Approach 2: If first approach failed, try the scoreboard endpoint which includes season averages
        if (!seasonAverages) {
          try {
            const scoreboardResponse = await fetch(
              `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`
            );
            
            if (scoreboardResponse.ok) {
              const scoreboardData = await scoreboardResponse.json();
              
              // Find the current game
              const currentGame = scoreboardData.events?.find((event: any) => event.id === game.id);
              
              if (currentGame?.competitions?.[0]?.competitors) {
                const competitors = currentGame.competitions[0].competitors;
                
                // Find the team
                const team = competitors.find((c: any) => {
                  const teamAbbr = normalizeTeamAbbr(c.team?.abbreviation);
                  return teamAbbr === normalizedTeamCode;
                });
                
                // Look for player in roster with stats
                if (team?.roster) {
                  const player = team.roster.find((p: any) => p.athlete?.id === playerId);
                  
                  if (player?.athlete?.statistics) {
                    const stats = player.athlete.statistics;
                    console.log('Scoreboard stats object:', stats);
                    seasonAverages = {
                      ppg: stats.avgPoints || '-',
                      rpg: stats.avgRebounds || '-',
                      apg: stats.avgAssists || '-',
                      fgPct: stats.fieldGoalPct || stats.fgPct || stats.avgFieldGoalPct || '-',
                      fg3Pct: stats.threePointFieldGoalPct || stats.threePtPct || stats['3ptPct'] || stats.avgThreePointFieldGoalPct || '-',
                      ftPct: stats.freeThrowPct || stats.ftPct || stats.avgFreeThrowPct || '-',
                    };
                    console.log('Season averages from scoreboard:', seasonAverages);
                  }
                }
              }
            }
          } catch (scoreboardError) {
            console.log('Scoreboard endpoint failed:', scoreboardError);
          }
        }

        // Approach 3: Try direct statistics endpoint
        if (!seasonAverages) {
          try {
            const statsResponse = await fetch(
              `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2026/athletes/${playerId}/statistics/0`
            );
            
            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              console.log('Stats data:', statsData);
              
              if (statsData.splits?.categories) {
                const categories = statsData.splits.categories;
                console.log('Stats categories:', categories.map((c: any) => ({ name: c.name, stats: c.stats?.map((s: any) => s.name) })));
                
                const findStat = (categoryName: string, statName: string) => {
                  const category = categories.find((c: any) => c.name === categoryName);
                  const stat = category?.stats?.find((s: any) => s.name === statName);
                  return stat?.displayValue || stat?.value?.toString() || '-';
                };

                // Try multiple possible category and stat names
                const getFGPct = () => {
                  return findStat('fieldGoals', 'fieldGoalPct') !== '-' ? findStat('fieldGoals', 'fieldGoalPct') :
                         findStat('fieldGoals', 'fgPct') !== '-' ? findStat('fieldGoals', 'fgPct') :
                         findStat('general', 'fieldGoalPct') !== '-' ? findStat('general', 'fieldGoalPct') : '-';
                };

                const get3PTPct = () => {
                  return findStat('threePointFieldGoals', 'threePointFieldGoalPct') !== '-' ? findStat('threePointFieldGoals', 'threePointFieldGoalPct') :
                         findStat('threePointFieldGoals', 'threePtPct') !== '-' ? findStat('threePointFieldGoals', 'threePtPct') :
                         findStat('general', 'threePointFieldGoalPct') !== '-' ? findStat('general', 'threePointFieldGoalPct') : '-';
                };

                const getFTPct = () => {
                  return findStat('freeThrows', 'freeThrowPct') !== '-' ? findStat('freeThrows', 'freeThrowPct') :
                         findStat('freeThrows', 'ftPct') !== '-' ? findStat('freeThrows', 'ftPct') :
                         findStat('general', 'freeThrowPct') !== '-' ? findStat('general', 'freeThrowPct') : '-';
                };

                seasonAverages = {
                  ppg: findStat('scoring', 'avgPoints'),
                  rpg: findStat('rebounds', 'avgRebounds'),
                  apg: findStat('assists', 'avgAssists'),
                  fgPct: getFGPct(),
                  fg3Pct: get3PTPct(),
                  ftPct: getFTPct(),
                };
                console.log('Season averages from stats endpoint:', seasonAverages);
              }
            }
          } catch (statsError) {
            console.log('Stats endpoint failed:', statsError);
          }
        }
      }
      
      console.log('Final season averages:', seasonAverages);

      const playerCardData: PlayerCardData = {
        id: playerId,
        name: playerName,
        displayName: playerGameStats.displayName,
        position,
        jerseyNumber,
        headshot,
        teamColor: teamInfo.color,
        teamLogo: teamInfo.logo,
        teamCode: teamInfo.code,
        gameStats: {
          min: playerGameStats.min,
          pts: playerGameStats.pts,
          reb: playerGameStats.reb,
          ast: playerGameStats.ast,
          fg: playerGameStats.fg,
          '3pt': playerGameStats['3pt'],
          ft: playerGameStats.ft,
          stl: playerGameStats.stl,
          blk: playerGameStats.blk,
          to: playerGameStats.to,
          pf: playerGameStats.pf,
        },
        seasonStats: seasonAverages,
      };

      setSelectedPlayer(playerCardData);
    } catch (error) {
      console.error('Error displaying player card:', error);
    } finally {
      setLoadingPlayer(false);
    }
  };

  // Extract team FG stats from box score
  const getTeamFGStats = (teamAbbr: string) => {
    if (!game.boxScoreData?.boxscore?.teams) return { fgM: undefined, fgA: undefined };
    
    const normalizedAbbr = normalizeTeamAbbr(teamAbbr);
    const teamData = game.boxScoreData.boxscore.teams.find((team: any) => 
      normalizeTeamAbbr(team.team?.abbreviation) === normalizedAbbr
    );
    
    if (!teamData?.statistics) return { fgM: undefined, fgA: undefined };
    
    // Find field goals made-attempted stat
    const fgStat = teamData.statistics.find((stat: any) => 
      stat.name === 'fieldGoalsMade-fieldGoalsAttempted'
    );
    
    if (fgStat?.displayValue) {
      const [made, attempted] = fgStat.displayValue.split('-');
      return { fgM: made, fgA: attempted };
    }
    
    return { fgM: undefined, fgA: undefined };
  };

  const awayFGStats = getTeamFGStats(game.awayTeam.code);
  const homeFGStats = getTeamFGStats(game.homeTeam.code);

  // Calculate percentages
  const parseFGPct = (pct: string | undefined) => {
    if (!pct || pct === '-') return 0;
    return parseFloat(pct.replace('%', ''));
  };

  const calculate3PtPct = (made: string | undefined, attempted: string | undefined) => {
    if (!made || !attempted) return { display: '-', value: 0 };
    const m = parseInt(made);
    const a = parseInt(attempted);
    if (a === 0) return { display: '0%', value: 0 };
    const pct = (m / a) * 100;
    return { display: `${pct.toFixed(0)}%`, value: pct };
  };

  const calculateFTPct = (made: string | undefined, attempted: string | undefined) => {
    if (!made || !attempted) return { display: '-', value: 0 };
    const m = parseInt(made);
    const a = parseInt(attempted);
    if (a === 0) return { display: '0%', value: 0 };
    const pct = (m / a) * 100;
    return { display: `${pct.toFixed(0)}%`, value: pct };
  };

  const awayFGPct = parseFGPct(game.awayTeam.fgPct);
  const homeFGPct = parseFGPct(game.homeTeam.fgPct);
  
  const away3Pt = calculate3PtPct(game.awayTeam.threePM, game.awayTeam.threePA);
  const home3Pt = calculate3PtPct(game.homeTeam.threePM, game.homeTeam.threePA);

  const awayFT = calculateFTPct(game.awayTeam.ftM, game.awayTeam.ftA);
  const homeFT = calculateFTPct(game.homeTeam.ftM, game.homeTeam.ftA);

  const parseSafe = (val: string | undefined) => parseInt(val || '0') || 0;

  // Helper to determine winner for each stat
  const getWinner = (awayStat: number, homeStat: number, lowerIsBetter = false) => {
    if (awayStat === homeStat) return null;
    if (lowerIsBetter) {
      return awayStat < homeStat ? 'away' : 'home';
    }
    return awayStat > homeStat ? 'away' : 'home';
  };

  const awayColor = game.awayTeam.color || '#49256C';
  const homeColor = game.homeTeam.color || '#1D1160';

  // Determine game state text
  let gameStateText = 'F';
  if (game.status === 'post') {
    // Check for special status details (Postponed, Suspended, etc.)
    if (game.statusDetail && game.statusDetail !== 'Final') {
       gameStateText = game.statusDetail === 'Postponed' ? 'PPD' : game.statusDetail;
    } 
    // For completed games, check if it went to overtime
    else if (game.period && game.period > 4) {
      const overtimes = game.period - 4;
      gameStateText = overtimes === 1 ? 'F/OT' : `F/${overtimes}OT`;
    } else {
      gameStateText = 'F';
    }
  } else if (game.status === 'in') {
    // For live games, show quarter and time
    let quarterText = `${game.quarter}Q`;
    if (game.quarter && game.quarter > 4) {
      const overtimes = game.quarter - 4;
      quarterText = overtimes === 1 ? 'OT' : `${overtimes}OT`;
    }
    gameStateText = `${game.clock || ''} ${quarterText}`.trim();
  }

  // Format date
  const gameDate = new Date(game.date);
  const formattedDate = gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const location = game.city && game.state ? `${game.city}, ${game.state}` : 'Location TBD';
  const arena = game.arena || 'Arena TBD';

  interface StatRowProps {
    label: string;
    awayValue: string | number;
    homeValue: string;
    awayDetail?: string;
    homeDetail?: string;
    winner: 'away' | 'home' | null;
  }

  const StatRow = ({ label, awayValue, homeValue, awayDetail, homeDetail, winner }: StatRowProps) => (
    <div className="relative h-[36px] w-full">
      {winner === 'away' && (
        <div className="absolute left-0 top-[6px] bottom-[6px] w-[5px] rounded-full" style={{ backgroundColor: awayColor }} />
      )}
      {winner === 'home' && (
        <div className="absolute right-0 top-[6px] bottom-[6px] w-[5px] rounded-full" style={{ backgroundColor: homeColor }} />
      )}
      <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-right text-white w-[128px]">
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic flex items-center justify-end gap-1">
            {awayDetail && <span className="text-[#8e8e93] text-[15px] mt-[0px] mr-[4px] mb-[0px] ml-[0px]">{awayDetail} </span>}
            <span className="text-[17px]">{awayValue}</span>
          </p>
        </div>
        <div className="flex flex-col font-['Barlow:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[13px] text-center tracking-[0.26px] w-[88px]">
          <p className="leading-none">{label}</p>
        </div>
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-white w-[128px]">
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic flex items-center gap-1">
            <span className="text-[17px]">{homeValue}</span>
            {homeDetail && <span className="text-[#8e8e93] text-[15px] mt-[0px] mr-[0px] mb-[0px] ml-[4px]"> {homeDetail}</span>}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="box-score-title"
      style={{ 
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        ...(isStandalone && {
          touchAction: 'none',
        })
      }}
    >
      <div 
        className="relative rounded-[12px] w-full max-w-[393px] h-[80vh] overflow-hidden flex flex-col"
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
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]" />
            <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
            <p className="font-['Barlow:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-nowrap text-white tracking-[0.22px] uppercase z-10">
              <span>{gameStateText} </span>
              <span className="font-['Barlow:Regular',sans-serif] text-[#8e8e93]">|</span>
              <span> {game.awayTeam.code} at {game.homeTeam.code}</span>
            </p>
            <div className="flex items-center gap-2 z-10">
              {game.broadcast && (
                <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#c7c7cc] text-[11px] text-nowrap text-right tracking-[0.22px]">
                  {game.broadcast}
                </p>
              )}
              <button 
                onClick={onClose}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="text-white/60 hover:text-white transition-colors p-0.5"
                aria-label="Close box score"
                style={{
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="relative bg-white h-[128px] overflow-clip w-full">
            {/* Home Team Background - Right Side */}
            <div className="absolute flex h-[128px] items-center justify-center right-0 top-0 w-[232.5px]">
              <div className="flex-none rotate-[180deg]">
                <svg className="block h-[128px] w-[232.5px]" fill="none" preserveAspectRatio="none" viewBox="0 0 232.5 128">
                  <path d="M0 0H232.5L152.5 128H0V0Z" fill={homeColor} />
                  <path d="M0 0H232.5L152.5 128H0V0Z" fill="url(#paint0_linear_home)" />
                  <defs>
                    <linearGradient id="paint0_linear_home" x1="116.25" x2="116.25" y1="128" y2="0">
                      <stop offset="0.5" stopOpacity="0" />
                      <stop offset="1" stopOpacity="0.75" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Home Team Logo */}
            <div className="absolute right-[24px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] size-[128px] top-1/2 translate-y-[-50%] z-10">
              <img alt={game.homeTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.homeTeam.logo} />
            </div>

            {/* Away Team Background - Left Side */}
            <div className="absolute h-[128px] left-0 top-0 w-[232.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232.5 128">
                <path d="M0 0H232.5L152.5 128H0V0Z" fill={awayColor} />
                <path d="M0 0H232.5L152.5 128H0V0Z" fill="url(#paint0_linear_away)" />
                <defs>
                  <linearGradient id="paint0_linear_away" x1="116.25" x2="116.25" y1="0" y2="128">
                    <stop offset="0.5" stopOpacity="0" />
                    <stop offset="1" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Away Team Logo */}
            <div className="absolute left-[calc(50%-104.5px)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] size-[128px] top-0 translate-x-[-50%] z-10">
              <img alt={game.awayTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.awayTeam.logo} />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute backdrop-blur-[2px] backdrop-filter bg-gradient-to-t bottom-0 from-[#0a0a0a] h-[128px] left-0 to-[rgba(10,10,10,0.5)] w-full z-20" />

            {/* Box Score with Quarter Scores */}
            <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 overflow-clip px-[8px] py-0 shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)] top-[68px] w-full z-30">
              {/* Away Team Row */}
              <div className="content-stretch flex gap-[4px] items-center w-full">
                <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px">
                  <div className={`h-[20px] relative rounded-[4px] shrink-0 w-[48px]`} style={{ backgroundColor: awayColor }}>
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
                <div className="content-stretch flex gap-[6px] h-[20px] items-center justify-end leading-none">
                  {quarterScores.away.length > 0 && (
                    <div className="flex gap-[4px]">
                      {quarterScores.away.map((score, idx) => (
                        <span key={idx} className="text-[#8e8e93] text-[11px] font-['Barlow:SemiBold',sans-serif] w-[14px] text-center">{score}</span>
                      ))}
                    </div>
                  )}
                  <p className="font-['Barlow_Semi_Condensed:Bold',sans-serif] relative shrink-0 text-[20px] text-white text-right tracking-[0.4px] w-[48px]">{awayScore}</p>
                </div>
              </div>

              {/* Home Team Row */}
              <div className="content-stretch flex gap-[4px] items-center w-full">
                <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px">
                  <div className={`h-[20px] relative rounded-[4px] shrink-0 w-[48px]`} style={{ backgroundColor: homeColor }}>
                    <div className="overflow-clip relative rounded-[inherit] size-full">
                      <div className="absolute left-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                        <img alt={game.homeTeam.code} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={game.homeTeam.logo} />
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" />
                    <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.6)]" />
                  </div>
                  <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none">
                    <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase font-['Barlow:SemiBold',sans-serif]">{game.homeTeam.code}</p>
                    <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px] font-['Barlow:SemiBold',sans-serif]">{game.homeTeam.record}</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[6px] h-[20px] items-center justify-end leading-none">
                  {quarterScores.home.length > 0 && (
                    <div className="flex gap-[4px]">
                      {quarterScores.home.map((score, idx) => (
                        <span key={idx} className="text-[#8e8e93] text-[11px] font-['Barlow:SemiBold',sans-serif] w-[14px] text-center">{score}</span>
                      ))}
                    </div>
                  )}
                  <p className="font-['Barlow_Semi_Condensed:Bold',sans-serif] relative shrink-0 text-[20px] text-white text-right tracking-[0.4px] w-[48px]">{homeScore}</p>
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="absolute bottom-[72px] flex flex-col font-['Barlow:SemiBold',sans-serif] justify-end leading-[1.2] left-[8px] not-italic text-[9px] text-nowrap text-white tracking-[0.36px] uppercase z-30">
              <p className="mb-0">{formattedDate}</p>
              <p className="mb-0">{location}</p>
              <p>{arena}</p>
            </div>

            <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_8px_24px_0px_rgba(255,255,255,0.2)] z-40" />
          </div>

          {/* Stat Picker */}
          <div className="relative w-full border-b border-[#181919]">
            <div className="flex font-['SF_Pro:Semibold',sans-serif] font-[590] items-stretch justify-center text-[15px]">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('away');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('away');
                }}
                className="flex justify-end items-center gap-2 shrink-0 text-right w-[120px] py-4 transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'away' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                <img 
                  src={game.awayTeam.logo} 
                  alt={game.awayTeam.code} 
                  className="w-5 h-5 transition-opacity" 
                  style={{ opacity: selectedView === 'away' ? 1 : 0.3 }}
                />
                <span className="leading-[normal]">{game.awayTeam.code}</span>
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('team');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('team');
                }}
                className="flex justify-center items-center shrink-0 text-center w-[120px] py-4 transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'team' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                <span className="leading-[normal]">Team Stats</span>
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('home');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView('home');
                }}
                className="flex justify-start items-center gap-2 shrink-0 text-left w-[120px] py-4 transition-colors touch-manipulation min-h-[48px]"
                style={{ 
                  color: selectedView === 'home' ? '#ffffff' : '#404040', 
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                <span className="leading-[normal]">{game.homeTeam.code}</span>
                <img 
                  src={game.homeTeam.logo} 
                  alt={game.homeTeam.code} 
                  className="w-5 h-5 transition-opacity" 
                  style={{ opacity: selectedView === 'home' ? 1 : 0.3 }}
                />
              </button>
            </div>
          </div>

          {/* Content based on selected view */}
          {selectedView === 'team' && (
            <>
              {/* Stat Rows */}
              <StatRow
                label="FG/A"
                awayValue={game.awayTeam.fgPct ? `${game.awayTeam.fgPct}%` : '-'}
                homeValue={game.homeTeam.fgPct ? `${game.homeTeam.fgPct}%` : '-'}
                awayDetail={awayFGStats.fgM && awayFGStats.fgA ? `${awayFGStats.fgM}/${awayFGStats.fgA}` : undefined}
                homeDetail={homeFGStats.fgM && homeFGStats.fgA ? `${homeFGStats.fgM}/${homeFGStats.fgA}` : undefined}
                winner={getWinner(awayFGPct, homeFGPct)}
              />

              <StatRow
                label="3PM/A"
                awayValue={away3Pt.display}
                homeValue={home3Pt.display}
                awayDetail={game.awayTeam.threePM && game.awayTeam.threePA ? `${game.awayTeam.threePM}/${game.awayTeam.threePA}` : undefined}
                homeDetail={game.homeTeam.threePM && game.homeTeam.threePA ? `${game.homeTeam.threePM}/${game.homeTeam.threePA}` : undefined}
                winner={getWinner(away3Pt.value, home3Pt.value)}
              />

              <StatRow
                label="FTM/A"
                awayValue={awayFT.display}
                homeValue={homeFT.display}
                awayDetail={game.awayTeam.ftM && game.awayTeam.ftA ? `${game.awayTeam.ftM}/${game.awayTeam.ftA}` : undefined}
                homeDetail={game.homeTeam.ftM && game.homeTeam.ftA ? `${game.homeTeam.ftM}/${game.homeTeam.ftA}` : undefined}
                winner={getWinner(awayFT.value, homeFT.value)}
              />

              <StatRow
                label="Rebounds"
                awayValue={(game.awayTeam as any).totalRebounds || '-'}
                homeValue={(game.homeTeam as any).totalRebounds || '-'}
                winner={getWinner(parseSafe((game.awayTeam as any).totalRebounds), parseSafe((game.homeTeam as any).totalRebounds))}
              />

              <StatRow
                label="Assists"
                awayValue={(game.awayTeam as any).assists || '-'}
                homeValue={(game.homeTeam as any).assists || '-'}
                winner={getWinner(parseSafe((game.awayTeam as any).assists), parseSafe((game.homeTeam as any).assists))}
              />

              <StatRow
                label="Turnovers"
                awayValue={game.awayTeam.turnovers || '-'}
                homeValue={game.homeTeam.turnovers || '-'}
                winner={getWinner(parseSafe(game.awayTeam.turnovers), parseSafe(game.homeTeam.turnovers), true)}
              />

              <StatRow
                label="Steals"
                awayValue={(game.awayTeam as any).steals || '-'}
                homeValue={(game.homeTeam as any).steals || '-'}
                winner={getWinner(parseSafe((game.awayTeam as any).steals), parseSafe((game.homeTeam as any).steals))}
              />

              <StatRow
                label="Blocks"
                awayValue={(game.awayTeam as any).blocks || '-'}
                homeValue={(game.homeTeam as any).blocks || '-'}
                winner={getWinner(parseSafe((game.awayTeam as any).blocks), parseSafe((game.homeTeam as any).blocks))}
              />

              <StatRow
                label="Points in Paint"
                awayValue={(game.awayTeam as any).pointsInPaint || '-'}
                homeValue={(game.homeTeam as any).pointsInPaint || '-'}
                winner={getWinner(parseSafe((game.awayTeam as any).pointsInPaint), parseSafe((game.homeTeam as any).pointsInPaint))}
              />

              <StatRow
                label="Fast Break Pts"
                awayValue={(game.awayTeam as any).fastBreakPoints || '-'}
                homeValue={(game.homeTeam as any).fastBreakPoints || '-'}
                winner={getWinner(parseSafe((game.awayTeam as any).fastBreakPoints), parseSafe((game.homeTeam as any).fastBreakPoints))}
              />
            </>
          )}

          {selectedView === 'away' && (
            <div className="p-4 px-[16px] py-[0px]">
              <div className="overflow-x-auto -mx-4 bg-[#1c1c1e]">
                <table className="w-full text-[12px] min-w-[680px]">
                  <thead>
                    <tr className="border-b border-[#2c2c2e]">
                      <th className="text-left text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider pl-4 pr-2 sticky left-0 bg-[#1c1c1e] z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-[#2c2c2e] after:to-transparent min-w-[120px]">{getTeamFullName(game.awayTeam.code)}</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[48px]">MIN</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">PTS</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">REB</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">AST</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[52px]">FG</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[52px]">3PT</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[52px]">FT</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">STL</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">BLK</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">TO</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 pr-4 min-w-[38px]">PF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awayPlayers.length > 0 ? awayPlayers.map((player, idx) => (
                      <tr key={idx} className="border-b border-[#2c2c2e]/30">
                        <td 
                          className="text-white font-['Barlow:SemiBold',sans-serif] py-2 pl-4 pr-2 sticky left-0 bg-[#1c1c1e] z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-[#2c2c2e]/50 after:to-transparent cursor-pointer hover:bg-[#2c2c2e] transition-colors"
                          onClick={() => handlePlayerClick(player.name, game.awayTeam.code)}
                        >
                          <span className="text-[10px] text-[#8e8e93] mt-[0px] mr-[4px] mb-[0px] ml-[0px]">{player.position}</span> <span className="text-[13px]">{player.displayName}</span>
                        </td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.min}</td>
                        <td className="text-white text-center font-['Barlow:Bold',sans-serif] py-2 px-3 whitespace-nowrap">{player.pts}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.reb}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.ast}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.fg}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player['3pt']}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.ft}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.stl}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.blk}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.to}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 pr-4 whitespace-nowrap">{player.pf}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={12} className="text-[#8e8e93] text-center py-4 font-['Barlow:Regular',sans-serif]">No player data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedView === 'home' && (
            <div className="p-4 px-[16px] py-[0px]">
              <div className="overflow-x-auto -mx-4 bg-[#1c1c1e]">
                <table className="w-full text-[12px] min-w-[680px]">
                  <thead>
                    <tr className="border-b border-[#2c2c2e]">
                      <th className="text-left text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider pl-4 pr-2 sticky left-0 bg-[#1c1c1e] z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-[#2c2c2e] after:to-transparent min-w-[120px]">{getTeamFullName(game.homeTeam.code)}</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[48px]">MIN</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">PTS</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">REB</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">AST</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[52px]">FG</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[52px]">3PT</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[52px]">FT</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">STL</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">BLK</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 min-w-[38px]">TO</th>
                      <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pt-2 pb-2 uppercase tracking-wider px-3 pr-4 min-w-[38px]">PF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homePlayers.length > 0 ? homePlayers.map((player, idx) => (
                      <tr key={idx} className="border-b border-[#2c2c2e]/30">
                        <td 
                          className="text-white font-['Barlow:SemiBold',sans-serif] py-2 pl-4 pr-2 sticky left-0 bg-[#1c1c1e] z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-[#2c2c2e]/50 after:to-transparent cursor-pointer hover:bg-[#2c2c2e] transition-colors"
                          onClick={() => handlePlayerClick(player.name, game.homeTeam.code)}
                        >
                          <span className="text-[10px] text-[#8e8e93] mt-[0px] mr-[4px] mb-[0px] ml-[0px]">{player.position}</span> <span className="text-[13px]">{player.displayName}</span>
                        </td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.min}</td>
                        <td className="text-white text-center font-['Barlow:Bold',sans-serif] py-2 px-3 whitespace-nowrap">{player.pts}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.reb}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.ast}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.fg}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player['3pt']}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.ft}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.stl}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.blk}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 whitespace-nowrap">{player.to}</td>
                        <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-3 pr-4 whitespace-nowrap">{player.pf}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={12} className="text-[#8e8e93] text-center py-4 font-['Barlow:Regular',sans-serif]">No player data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom padding */}
          <div className="h-[20px]" />
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
    </div>
  );
}