import { useState, useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import svgPaths from "./imports/svg-8zwks7qa0c";
import imgGameCardHeader from "figma:asset/2807656b353c38974e5a742538684c5e7b2b3101.png";
import imgGameCardPre from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";
import imgWinnerArrow from "figma:asset/3c623c92bd9535d54db154896b8b73e1aa987921.png";
import BoxScoreModal from './components/BoxScoreModal';
import PregameModal from './components/PregameModal';
import { InstallPrompt } from './components/InstallPrompt';
import { PWADebug } from './components/PWADebug';
import { PWADiagnostic } from './components/PWADiagnostic';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PushNotifications } from './components/PushNotifications';
import { BottomNav } from './components/BottomNav';
import { Standings } from './components/Standings';
import { Settings } from './components/Settings';

interface Team {
  id: number;
  abbreviation: string;
  full_name: string;
  name: string;
}

interface Game {
  id: number;
  date: string;
  home_team: Team;
  visitor_team: Team;
  status: string;
  time: string;
}

interface TeamStats {
  logo: string;
  color: string;
  record: string;
  ppg: string;
  ppgRank: string;
  oppg: string;
  oppgRank: string;
}

interface EnrichedGame {
  id: number;
  awayTeam: {
    code: string;
    record: string;
    logo: string;
    color: string;
    ppg: string;
    ppgRank: string;
    oppg: string;
    oppgRank: string;
    score?: number;
    // Final game stats
    fgPct?: string;
    threePA?: string;
    threePM?: string;
    ftA?: string;
    ftM?: string;
    turnovers?: string;
    // Loading state for stats
    statsLoading?: boolean;
    id?: string; // ESPN team ID
    streak?: string; // Current streak (e.g., "W3", "L2")
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
    score?: number;
    // Final game stats
    fgPct?: string;
    threePA?: string;
    threePM?: string;
    ftA?: string;
    ftM?: string;
    turnovers?: string;
    // Loading state for stats
    statsLoading?: boolean;
    id?: string; // ESPN team ID
    streak?: string; // Current streak (e.g., "W3", "L2")
  };
  time: string;
  network: string;
  spread: string;
  total: string;
  status: 'pre' | 'in' | 'post';
  statusDetail?: string; // e.g. "Postponed", "Delayed", "Final", "F/OT"
  period?: number; // For tracking overtime (5 = OT, 6 = 2OT, etc.)
  date?: string; // ISO date string for the game
  clock?: string; // Live game clock display (e.g., "10:23")
  quarter?: number; // Current quarter for live games
  eventId?: string; // ESPN event ID for fetching box score
  boxScoreData?: any; // Full box score data from ESPN
  arena?: string; // Arena/venue name
  city?: string; // City location
  state?: string; // State location
  broadcast?: string; // Broadcast network for modal
}

// Team logo, color, and name mappings
const teamData: Record<string, { logo: string; color: string; city: string; name: string }> = {
  'LAL': { logo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg', color: '#552583', city: 'Los Angeles', name: 'Lakers' },
  'PHX': { logo: 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg', color: '#1d1160', city: 'Phoenix', name: 'Suns' },
  'BOS': { logo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg', color: '#007A33', city: 'Boston', name: 'Celtics' },
  'MIA': { logo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg', color: '#98002E', city: 'Miami', name: 'Heat' },
  'GSW': { logo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg', color: '#1D428A', city: 'Golden State', name: 'Warriors' },
  'LAC': { logo: 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg', color: '#C8102E', city: 'Los Angeles', name: 'Clippers' },
  'MIL': { logo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg', color: '#00471B', city: 'Milwaukee', name: 'Bucks' },
  'DEN': { logo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg', color: '#0E2240', city: 'Denver', name: 'Nuggets' },
  'BKN': { logo: 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg', color: '#000000', city: 'Brooklyn', name: 'Nets' },
  'DAL': { logo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg', color: '#00538C', city: 'Dallas', name: 'Mavericks' },
  'PHI': { logo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg', color: '#006BB6', city: 'Philadelphia', name: '76ers' },
  'TOR': { logo: 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg', color: '#CE1141', city: 'Toronto', name: 'Raptors' },
  'CHI': { logo: 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg', color: '#CE1141', city: 'Chicago', name: 'Bulls' },
  'CLE': { logo: 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg', color: '#860038', city: 'Cleveland', name: 'Cavaliers' },
  'MEM': { logo: 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg', color: '#5D76A9', city: 'Memphis', name: 'Grizzlies' },
  'ATL': { logo: 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg', color: '#E03A3E', city: 'Atlanta', name: 'Hawks' },
  'NYK': { logo: 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg', color: '#006BB6', city: 'New York', name: 'Knicks' },
  'SAC': { logo: 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg', color: '#5A2D81', city: 'Sacramento', name: 'Kings' },
  'MIN': { logo: 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg', color: '#0C2340', city: 'Minnesota', name: 'Timberwolves' },
  'OKC': { logo: 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg', color: '#007AC1', city: 'Oklahoma City', name: 'Thunder' },
  'POR': { logo: 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg', color: '#E03A3E', city: 'Portland', name: 'Trail Blazers' },
  'UTA': { logo: 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg', color: '#002B5C', city: 'Utah', name: 'Jazz' },
  'NOP': { logo: 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg', color: '#0C2340', city: 'New Orleans', name: 'Pelicans' },
  'SAS': { logo: 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg', color: '#C4CED4', city: 'San Antonio', name: 'Spurs' },
  'HOU': { logo: 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg', color: '#CE1141', city: 'Houston', name: 'Rockets' },
  'IND': { logo: 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg', color: '#002D62', city: 'Indiana', name: 'Pacers' },
  'WAS': { logo: 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg', color: '#002B5C', city: 'Washington', name: 'Wizards' },
  'ORL': { logo: 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg', color: '#0077C0', city: 'Orlando', name: 'Magic' },
  'CHA': { logo: 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg', color: '#1D1160', city: 'Charlotte', name: 'Hornets' },
  'DET': { logo: 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg', color: '#C8102E', city: 'Detroit', name: 'Pistons' },
};

// Calculated team stats - will be populated from ESPN API
let calculatedTeamStats: Record<string, { ppg: number; oppg: number; ppgRank: number; oppgRank: number }> = {};

// ESPN Scoreboard API uses different abbreviations than Standings API
const teamAbbrMapping: Record<string, string> = {
  'GS': 'GSW',
  'NY': 'NYK',
  'SA': 'SAS',
  'NO': 'NOP',
  'UTAH': 'UTA',
  'WSH': 'WAS',
};

// Normalize team abbreviation to match standings API
function normalizeTeamAbbr(abbr: string): string {
  return teamAbbrMapping[abbr] || abbr;
}

async function calculateSeasonStats() {
  console.log('Fetching season stats from ESPN standings API...');
  
  try {
    // Fetch standings which include team statistics
    // Try 2026 season first (2025-26 NBA season)
    let response = await fetch('https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2026');
    let seasonTried = 2026;
    
    if (!response.ok) {
      console.warn('Failed to fetch 2026 standings, trying 2025 season...', response.status);
      // Fallback to 2025 season
      response = await fetch('https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2025');
      seasonTried = 2025;
      
      if (!response.ok) {
        console.error('Failed to fetch 2025 standings as well, trying without season parameter...', response.status);
        // Last resort: no season parameter (gets current season)
        response = await fetch('https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings');
        seasonTried = 0;
        
        if (!response.ok) {
          console.error('All standings API attempts failed, status:', response.status);
          return {};
        }
      }
    }
    
    const data = await response.json();
    console.log(`✅ Standings API response received for season ${seasonTried || 'current'}`);
    console.log('Data structure:', {
      hasChildren: !!data.children,
      childrenCount: data.children?.length,
      topLevelKeys: Object.keys(data),
      season: data.season || 'unknown'
    });
    
    const teamStats: Array<{ abbr: string; ppg: number; oppg: number }> = [];
    
    // Parse team stats from standings
    if (!data.children || data.children.length === 0) {
      console.error('❌ No children in standings data.');
      console.log('Top level keys in response:', Object.keys(data));
      // Don't return early - let it fall through to the fallback check below
    } else if (data.children) {
      for (const conference of data.children) {
        console.log('Processing conference:', conference.name);
        console.log('Has standings?', !!conference.standings);
        console.log('Has entries?', !!conference.standings?.entries);
        console.log('Entries count:', conference.standings?.entries?.length);
        
        if (conference.standings?.entries) {
          for (const entry of conference.standings.entries) {
            const rawAbbr = entry.team.abbreviation;
            const abbr = normalizeTeamAbbr(rawAbbr); // Normalize here too
            console.log(`Processing team: ${rawAbbr} -> ${abbr}`);
            console.log('Has stats?', !!entry.stats);
            console.log('Stats:', entry.stats);
            
            // Find the exact avgpointsfor and avgpointsagainst stats
            let ppg = 0;
            let oppg = 0;
            
            if (entry.stats) {
              for (const stat of entry.stats) {
                console.log(`  Stat: ${stat.name} = ${stat.value}`);
                // ESPN uses these exact stat names (with capital letters)
                if (stat.name === 'avgPointsFor') {
                  ppg = parseFloat(stat.value) || 0;
                }
                if (stat.name === 'avgPointsAgainst') {
                  oppg = parseFloat(stat.value) || 0;
                }
              }
            }
            
            console.log(`  PPG: ${ppg}, oPPG: ${oppg}`);
            
            if (ppg > 0 && oppg > 0) {
              teamStats.push({ abbr, ppg, oppg });
              console.log(`${abbr}: ${ppg.toFixed(1)} PPG, ${oppg.toFixed(1)} oPPG`);
            }
          }
        }
      }
    }
    
    console.log(`Found stats for ${teamStats.length} teams from ESPN API`);
    
    if (teamStats.length === 0) {
      console.warn('⚠️ No teams found in standings data. Stats will show as dashes.');
      return {};
    }
    
    // Sort by PPG for ranking (descending - highest first)
    const ppgRanked = [...teamStats].sort((a, b) => b.ppg - a.ppg);
    // Sort by oPPG for ranking (ascending - lowest/best defense first)
    const oppgRanked = [...teamStats].sort((a, b) => a.oppg - b.oppg);
    
    console.log('\nTop 5 Offensive Teams (PPG):');
    ppgRanked.slice(0, 5).forEach((team, idx) => {
      console.log(`${idx + 1}. ${team.abbr}: ${team.ppg.toFixed(1)} PPG`);
    });
    
    console.log('\nTop 5 Defensive Teams (oPPG - lower is better):');
    oppgRanked.slice(0, 5).forEach((team, idx) => {
      console.log(`${idx + 1}. ${team.abbr}: ${team.oppg.toFixed(1)} oPPG`);
    });
    
    // Assign ranks
    const result: Record<string, { ppg: number; oppg: number; ppgRank: number; oppgRank: number }> = {};
    
    teamStats.forEach(team => {
      const ppgRank = ppgRanked.findIndex(t => t.abbr === team.abbr) + 1;
      const oppgRank = oppgRanked.findIndex(t => t.abbr === team.abbr) + 1;
      
      result[team.abbr] = {
        ppg: Math.round(team.ppg * 10) / 10, // Round to 1 decimal
        oppg: Math.round(team.oppg * 10) / 10,
        ppgRank,
        oppgRank,
      };
    });
    
    console.log('\n✅ Season stats calculated successfully!');
    calculatedTeamStats = result;
    return result;
  } catch (error) {
    console.error('Error fetching standings:', error);
    console.warn('⚠️ Error during API fetch. Stats will show as dashes.');
    return {};
  }
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Chevron down">
          <path d="M5 7.5L10 12.5L15 7.5" id="Icon" stroke="#8E8E93" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TeamSelector({ selectedTeam, onTeamChange, availableTeams }: { 
  selectedTeam: string | null; 
  onTeamChange: (team: string | null) => void;
  availableTeams: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectedTeamInfo = selectedTeam ? teamData[selectedTeam] : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="content-stretch flex h-[36px] items-center relative shrink-0 cursor-pointer bg-transparent border-none p-0 gap-1 self-start" 
        data-name="Team Selector"
        type="button"
      >
        {selectedTeam ? (
          <div className="font-['Barlow:Bold',sans-serif] leading-none text-[28px] text-nowrap pointer-events-none">
            <span className="text-[#636366]">{selectedTeamInfo?.city || selectedTeam}</span>
            {' '}
            <span className="text-white">{selectedTeamInfo?.name || selectedTeam}</span>
          </div>
        ) : (
          <span className="font-['Barlow:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[28px] text-nowrap text-white pointer-events-none">NBA</span>
        )}
        <div className="pointer-events-none">
          <ChevronDown />
        </div>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#000000] z-[9999] overflow-y-auto"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#000000] border-b border-[#2c2c2e] px-4 pb-[20px] pt-4 flex items-center justify-between">
            <span className="font-['Barlow:Bold',sans-serif] text-[24px] text-white">Select Team</span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2c2c2e] transition-colors cursor-pointer bg-transparent border-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* All Teams option */}
          <button
            onClick={() => {
              onTeamChange(null);
              setIsOpen(false);
            }}
            className={`w-full text-left px-6 py-5 border-b border-[#2c2c2e] hover:bg-[#1c1c1e] transition-colors cursor-pointer bg-transparent border-none flex items-center justify-between ${
              !selectedTeam ? 'bg-[#1c1c1e]' : ''
            }`}
          >
            <div>
              <div className="font-['Barlow:SemiBold',sans-serif] text-[18px] text-white">All Teams</div>
              <div className="font-['Barlow:Regular',sans-serif] text-[14px] text-[#8e8e93] mt-1">View all games</div>
            </div>
            {!selectedTeam && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
          
          {/* Teams list */}
          {availableTeams.sort((a, b) => {
            const cityA = teamData[a]?.city || a;
            const cityB = teamData[b]?.city || b;
            return cityA.localeCompare(cityB);
          }).map((team) => {
            const teamInfo = teamData[team];
            return (
              <button
                key={team}
                onClick={() => {
                  onTeamChange(team);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-3 border-b border-[#2c2c2e] hover:bg-[#1c1c1e] transition-colors cursor-pointer bg-transparent border-none flex items-center justify-between ${
                  selectedTeam === team ? 'bg-[#1c1c1e]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={teamInfo?.logo || 'https://cdn.nba.com/logos/nba/logo.svg'} 
                    alt={team}
                    className="w-10 h-10 object-contain"
                  />
                  <div className="font-['Barlow:Bold',sans-serif] leading-none text-[28px] text-nowrap">
                    <span className="text-[#636366]">{teamInfo?.city || team}</span>
                    {' '}
                    <span className="text-[#c7c7cc]">{teamInfo?.name || team}</span>
                  </div>
                </div>
                {selectedTeam === team && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollbar styling for dropdown */}
      <style>{`
        [data-name="Team Selector"] + div::-webkit-scrollbar {
          width: 6px;
        }
        [data-name="Team Selector"] + div::-webkit-scrollbar-track {
          background: #1c1c1e;
        }
        [data-name="Team Selector"] + div::-webkit-scrollbar-thumb {
          background: #3c3c3e;
          border-radius: 3px;
        }
        [data-name="Team Selector"] + div::-webkit-scrollbar-thumb:hover {
          background: #4c4c4e;
        }
      `}</style>
    </div>
  );
}

interface DateOption {
  day: string;
  date: string;
  month: string;
  fullDate: string;
}

function DatePicker({ selectedDate, onDateChange, dates }: { selectedDate: number; onDateChange: (index: number) => void; dates: DateOption[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dateItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll to center the selected date
  useEffect(() => {
    if (scrollContainerRef.current && dateItemsRef.current[selectedDate]) {
      const container = scrollContainerRef.current;
      const selectedItem = dateItemsRef.current[selectedDate];
      
      if (selectedItem) {
        const containerWidth = container.offsetWidth;
        const itemOffsetLeft = selectedItem.offsetLeft;
        const itemWidth = selectedItem.offsetWidth;
        
        // Calculate scroll position to center the item
        const scrollPosition = itemOffsetLeft - (containerWidth / 2) + (itemWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDate]);

  return (
    <div className="relative overflow-hidden" style={{ width: '220px' }}>
      {/* Left fade gradient */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, #141415 0%, transparent 100%)'
        }}
      />
      
      {/* Scrollable date picker */}
      <div 
        ref={scrollContainerRef}
        className="content-stretch flex gap-[4px] h-[36px] items-center overflow-x-auto overflow-y-hidden relative shrink-0 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'none',
          touchAction: 'pan-x'
        }}
        data-name="datePicker"
      >
        {dates.map((date, index) => (
          <button
            key={index}
            ref={(el) => (dateItemsRef.current[index] = el)}
            onClick={() => onDateChange(index)}
            className="content-stretch flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[4px] items-start leading-[normal] relative shrink-0 text-center w-[48px]"
            data-name="date"
          >
            <p 
              className={`relative shrink-0 text-[7.901px] w-full ${selectedDate === index ? 'text-[#999]' : 'text-[#404040]'}`}
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {index === 7 ? 'Today' : `${date.day} ${date.month}`}
            </p>
            <p 
              className={`relative shrink-0 text-[22px] w-full ${selectedDate === index ? 'text-white' : 'text-[#404040]'}`}
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {date.date}
            </p>
          </button>
        ))}
      </div>
      
      {/* Right fade gradient */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to left, #141415 0%, transparent 100%)'
        }}
      />
      
      {/* Hide scrollbar with CSS */}
      <style>{`
        [data-name="datePicker"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function PageHeader({ selectedDate, onDateChange, dates, selectedTeam, onTeamChange, availableTeams }: { 
  selectedDate: number; 
  onDateChange: (index: number) => void; 
  dates: DateOption[];
  selectedTeam: string | null;
  onTeamChange: (team: string | null) => void;
  availableTeams: string[];
}) {
  return (
    <div className="content-stretch flex items-center justify-between overflow-visible pl-[0px] pr-[8px] py-0 relative shrink-0 w-full max-w-[393px]" data-name="pageHeader">
      <TeamSelector selectedTeam={selectedTeam} onTeamChange={onTeamChange} availableTeams={availableTeams} />
      {!selectedTeam && <DatePicker selectedDate={selectedDate} onDateChange={onDateChange} dates={dates} />}
    </div>
  );
}

function TimeNetworkDiv({ time, network, gameDate, selectedTeam }: { time: string; network: string; gameDate?: string; selectedTeam?: string | null }) {
  const displayNetwork = network === 'NBA League Pass' ? 'NBA LP' : network;
  const isLeaguePass = network === 'NBA League Pass';
  
  // Format date as dd/mm for team pages (but not for today)
  let displayTime = time;
  if (selectedTeam && gameDate) {
    const gameDateTime = new Date(gameDate);
    const today = new Date();
    
    // Check if game is today
    const isToday = gameDateTime.getDate() === today.getDate() &&
                    gameDateTime.getMonth() === today.getMonth() &&
                    gameDateTime.getFullYear() === today.getFullYear();
    
    if (!isToday) {
      const day = gameDateTime.getDate();
      const month = gameDateTime.getMonth() + 1;
      displayTime = `${month}/${day} ${time}`;
    }
  }
  
  return (
    <div className="relative shrink-0 w-[221px]" data-name="timeNetwork-div">
      <div className="content-stretch flex font-['Barlow:Bold',sans-serif] items-center justify-between leading-none not-italic overflow-clip p-[8px] relative rounded-[inherit] text-[11px] text-nowrap tracking-[0.22px] w-full">
        {selectedTeam && gameDate && displayTime !== time ? (
          <p className="relative shrink-0 text-white flex items-center">
            <span>{displayTime.split(' ')[0]}</span>
            <span style={{ width: '4px' }} />
            <span>{displayTime.split(' ').slice(1).join(' ')}</span>
          </p>
        ) : (
          <p className="relative shrink-0 text-white">{displayTime}</p>
        )}
        <p className={`relative shrink-0 text-right ${isLeaguePass ? 'text-[#8e8e93]' : 'text-white'}`}>{displayNetwork}</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function TeamStatsHeaderDiv() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[16px] items-center leading-none not-italic overflow-clip px-[8px] py-[8px] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.44px] w-[152px]" data-name="teamStatsHeader-div">
      <p className="relative shrink-0 w-[56px]">PPG</p>
      <p className="relative shrink-0 w-[56px]">oPPG</p>
    </div>
  );
}

function TeamStatsHeaderDivFinal() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[8px] items-center leading-none not-italic overflow-clip pl-[12px] pr-4 py-[8px] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.44px] w-[156px]" data-name="teamStatsHeader-div-final">
      <p className="relative shrink-0 w-[28px] text-left">FG%</p>
      <p className="relative shrink-0 w-[36px] text-left">3P/A</p>
      <p className="relative shrink-0 w-[32px] text-left">FT/A</p>
      <p className="relative shrink-0 w-[20px] text-left">TO</p>
    </div>
  );
}

function GameCardHeader({ time, network, gameDate, selectedTeam }: { time: string; network: string; gameDate?: string; selectedTeam?: string | null }) {
  return (
    <div className="relative shrink-0 w-full" data-name="gameCardHeader">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(180deg, rgba(24, 25, 25, 1) 0%, rgba(20, 20, 21, 0.8) 100%)'
        }}
      />
      <div className="content-stretch flex items-center justify-between overflow-clip px-0 py-[2px] relative rounded-[inherit] w-full">
        <TimeNetworkDiv time={time} network={network} gameDate={gameDate} selectedTeam={selectedTeam} />
        <TeamStatsHeaderDiv />
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ScoreboardLogo({ logo, color }: { logo: string; color: string }) {
  return (
    <div className="h-[20px] relative rounded-[4px] shrink-0 w-[48px]" style={{ backgroundColor: color }} data-name="scoreboardLogo">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute left-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="tmLogo">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={logo} />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.6)]" />
    </div>
  );
}

function TeamAbbrev({ code, record }: { code: string; record: string }) {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap" data-name="teamAbbrev">
      <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase">{code}</p>
      <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">{record}</p>
    </div>
  );
}

function AwayTeam({ logo, color, code, record }: { logo: string; color: string; code: string; record: string }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="awayTeam">
      <ScoreboardLogo logo={logo} color={color} />
      <TeamAbbrev code={code} record={record} />
    </div>
  );
}

function BetTotal({ value }: { value: string }) {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-clip relative shrink-0" data-name="betTotal">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-white tracking-[0.22px] w-[48px]">{value}</p>
    </div>
  );
}

function OddsNotAvailable({ streak }: { streak?: string }) {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-clip relative shrink-0" data-name="oddsNA">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-[#8e8e93] tracking-[0.22px] w-[48px]">{streak || 'Odds n/a'}</p>
    </div>
  );
}

function HomeTeam({ logo, color, code, record }: { logo: string; color: string; code: string; record: string }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="homeTeam">
      <ScoreboardLogo logo={logo} color={color} />
      <TeamAbbrev code={code} record={record} />
    </div>
  );
}

function BetSpread({ value }: { value: string }) {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-clip relative shrink-0" data-name="betSpread">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-white tracking-[0.22px] w-[48px]">{value.replace(/^[A-Z]+\s*/i, '')}</p>
    </div>
  );
}

function TeamStreaks({ awayStreak, homeStreak }: { awayStreak?: string; homeStreak?: string }) {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between overflow-clip relative shrink-0" data-name="teamStreaks">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative text-[11px] text-left text-white tracking-[0.22px] whitespace-nowrap">
        {awayStreak || '-'}
      </p>
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative text-[11px] text-right text-white tracking-[0.22px] whitespace-nowrap">
        {homeStreak || '-'}
      </p>
    </div>
  );
}

function Matchup({ game }: { game: EnrichedGame }) {
  // Check if game is more than 24 hours away
  const isMoreThan24Hours = game.date ? (() => {
    const gameDate = new Date(game.date);
    const now = new Date();
    const hoursUntilGame = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const result = hoursUntilGame > 24 && game.status === 'pre';
    if (result) {
      console.log(`🔥 Game ${game.awayTeam.code} @ ${game.homeTeam.code} is ${hoursUntilGame.toFixed(1)} hours away, showing streaks: Away=${game.awayTeam.streak}, Home=${game.homeTeam.streak}`);
    }
    return result;
  })() : false;

  return (
    <div className="relative shrink-0 w-[221px]" data-name="matchup">
      <div className="content-center flex flex-wrap gap-[4px] items-center justify-between overflow-clip px-[8px] py-0 relative rounded-[inherit] w-full">
        <AwayTeam logo={game.awayTeam.logo} color={game.awayTeam.color} code={game.awayTeam.code} record={game.awayTeam.record} />
        {isMoreThan24Hours ? (
          <OddsNotAvailable streak={game.awayTeam.streak} />
        ) : (
          <BetTotal value={game.total} />
        )}
        <HomeTeam logo={game.homeTeam.logo} color={game.homeTeam.color} code={game.homeTeam.code} record={game.homeTeam.record} />
        {isMoreThan24Hours ? (
          <TeamStreaks awayStreak={game.awayTeam.streak} homeStreak={game.homeTeam.streak} />
        ) : (
          <BetSpread value={game.spread} />
        )}
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function StatValue({ value, rank }: { value: string; rank: string }) {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap w-[56px]">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">{value}</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">{rank}</p>
    </div>
  );
}

function TeamStats({ game }: { game: EnrichedGame }) {
  const isLoading = game.awayTeam.ppg === '-' || game.homeTeam.ppg === '-';
  
  if (isLoading) {
    return (
      <div className="content-center flex flex-wrap gap-[4px_16px] h-[44px] items-center overflow-clip px-[8px] py-[5px] relative shrink-0 w-[152px]" data-name="teamStats">
        {/* Away PPG */}
        <div className="w-[56px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
        {/* Away oPPG */}
        <div className="w-[56px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
        {/* Home PPG */}
        <div className="w-[56px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
        {/* Home oPPG */}
        <div className="w-[56px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
      </div>
    );
  }
  
  return (
    <div className="content-center flex flex-wrap gap-[4px_16px] h-[44px] items-center overflow-clip px-[8px] py-[5px] relative shrink-0 w-[152px]" data-name="teamStats">
      <StatValue value={game.awayTeam.ppg} rank={game.awayTeam.ppgRank} />
      <StatValue value={game.awayTeam.oppg} rank={game.awayTeam.oppgRank} />
      <StatValue value={game.homeTeam.ppg} rank={game.homeTeam.ppgRank} />
      <StatValue value={game.homeTeam.oppg} rank={game.homeTeam.oppgRank} />
    </div>
  );
}

function FinalStatValue({ value, type, width }: { value: string; type?: 'percentage' | 'fraction' | 'number'; width: string }) {
  // Format the value based on type
  if (type === 'percentage' && value !== '-') {
    // Remove existing % if present, then format
    const numValue = value.replace('%', '');
    return (
      <div className={`content-stretch flex h-[22px] items-center leading-none not-italic relative shrink-0 ${width}`}>
        <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[0px] text-[#d1d1d6] tracking-[0.26px] uppercase">
          <span className="text-[13px]">{numValue}</span>
          <span className="font-['Barlow:Medium',sans-serif] not-italic text-[11px]">%</span>
        </p>
      </div>
    );
  } else if (type === 'fraction' && value !== '-') {
    // Split fraction like "10/38"
    const parts = value.split('/');
    if (parts.length === 2) {
      return (
        <div className={`content-stretch flex h-[22px] items-center leading-none not-italic relative shrink-0 ${width}`}>
          <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[0px] text-[#d1d1d6] tracking-[0.26px] uppercase">
            <span className="text-[13px]">{parts[0]}</span>
            <span className="font-['Barlow:Medium',sans-serif] not-italic text-[11px]">/</span>
            <span className="text-[13px]">{parts[1]}</span>
          </p>
        </div>
      );
    }
  }
  
  // Default formatting (for turnovers and dashes)
  return (
    <div className={`content-stretch flex h-[22px] items-center leading-none not-italic relative shrink-0 ${width}`}>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-[#d1d1d6] tracking-[0.26px] uppercase">{value}</p>
    </div>
  );
}

function TeamStatsFinal({ game }: { game: EnrichedGame }) {
  const isLoading = game.awayTeam.statsLoading || game.homeTeam.statsLoading;
  
  if (isLoading) {
    return (
      <div className="content-stretch flex flex-col h-[44px] items-start justify-center relative shrink-0 w-[156px]" data-name="teamStats-final">
        {/* Away team loading skeleton */}
        <div className="content-stretch flex gap-[8px] h-[22px] items-end pl-[12px] pr-0 py-0 relative shrink-0 w-[156px]">
          <div className="w-[28px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
          <div className="w-[36px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
          <div className="w-[32px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
          <div className="w-[20px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
        </div>
        {/* Home team loading skeleton */}
        <div className="content-stretch flex gap-[8px] h-[22px] items-end pl-[12px] pr-0 py-0 relative shrink-0 w-[156px]">
          <div className="w-[28px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
          <div className="w-[36px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
          <div className="w-[32px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
          <div className="w-[20px] h-[13px] bg-[#2c2c2e] rounded animate-pulse" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="content-stretch flex flex-col h-[44px] items-start justify-center relative shrink-0 w-[156px]" data-name="teamStats-final">
      {/* Away team stats */}
      <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[8px] h-[22px] items-center leading-none not-italic overflow-clip pl-[12px] pr-0 py-0 relative shrink-0 text-[#d1d1d6] tracking-[0.26px] uppercase w-[156px]">
        <FinalStatValue value={game.awayTeam.fgPct || '-'} type="percentage" width="w-[28px]" />
        <FinalStatValue value={game.awayTeam.threePM && game.awayTeam.threePA ? `${game.awayTeam.threePM}/${game.awayTeam.threePA}` : '-'} type="fraction" width="w-[36px]" />
        <FinalStatValue value={game.awayTeam.ftM && game.awayTeam.ftA ? `${game.awayTeam.ftM}/${game.awayTeam.ftA}` : '-'} type="fraction" width="w-[32px]" />
        <FinalStatValue value={game.awayTeam.turnovers || '-'} type="number" width="w-[20px]" />
      </div>
      {/* Home team stats */}
      <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[8px] h-[22px] items-center leading-none not-italic overflow-clip pl-[12px] pr-0 py-0 relative shrink-0 text-[#d1d1d6] tracking-[0.26px] uppercase w-[156px]">
        <FinalStatValue value={game.homeTeam.fgPct || '-'} type="percentage" width="w-[28px]" />
        <FinalStatValue value={game.homeTeam.threePM && game.homeTeam.threePA ? `${game.homeTeam.threePM}/${game.homeTeam.threePA}` : '-'} type="fraction" width="w-[36px]" />
        <FinalStatValue value={game.homeTeam.ftM && game.homeTeam.ftA ? `${game.homeTeam.ftM}/${game.homeTeam.ftA}` : '-'} type="fraction" width="w-[32px]" />
        <FinalStatValue value={game.homeTeam.turnovers || '-'} type="number" width="w-[20px]" />
      </div>
    </div>
  );
}

function GameData({ game }: { game: EnrichedGame }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="gameData">
      <Matchup game={game} />
      <TeamStats game={game} />
    </div>
  );
}

function GameCardPre({ game, selectedTeam, onCardClick }: { game: EnrichedGame; selectedTeam?: string | null; onCardClick?: (game: EnrichedGame) => void }) {
  return (
    <div 
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer" 
      data-name="gameCard-pre"
      onClick={() => onCardClick?.(game)}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-black inset-0 rounded-[8px]" />
        <div 
          className="absolute bg-repeat inset-0 opacity-10 rounded-[8px]" 
          style={{ 
            backgroundImage: `url('${imgGameCardPre}')`,
            backgroundSize: '30.72px 30.72px',
            backgroundPosition: 'top left'
          }} 
        />
      </div>
      <div className="content-end flex flex-wrap gap-[8px_4px] items-end overflow-clip pb-[16px] pt-0 px-0 relative rounded-[inherit] w-full">
        <GameCardHeader time={game.time} network={game.network} gameDate={game.date} selectedTeam={selectedTeam} />
        <GameData game={game} />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

// Final game state components
function calculateBettingResults(game: EnrichedGame): { coverTeam: string; coverSpread: string; ouResult: 'O' | 'U'; ouTotal: string } {
  const awayScore = game.awayTeam.score || 0;
  const homeScore = game.homeTeam.score || 0;
  const spreadValue = parseFloat(game.spread);
  const totalValue = parseFloat(game.total);
  
  // Calculate which team covered
  // Spread is stored relative to home team (negative = home favored, positive = away favored)
  // Add spread to home score: if result > away score, home covered
  const homeCovered = (homeScore + spreadValue) > awayScore;
  
  // Build the display spread based on who covered
  let displaySpread: string;
  if (homeCovered) {
    // Home team covered - show home's spread as-is
    displaySpread = game.spread;
  } else {
    // Away team covered - flip the sign to show away's perspective
    const awaySpreadValue = -spreadValue;
    displaySpread = awaySpreadValue > 0 ? `+${awaySpreadValue}` : awaySpreadValue.toString();
  }
  
  // Calculate O/U
  const finalTotal = awayScore + homeScore;
  const ouResult = finalTotal > totalValue ? 'O' : 'U';
  
  return {
    coverTeam: homeCovered ? game.homeTeam.code : game.awayTeam.code,
    coverSpread: displaySpread,
    ouResult,
    ouTotal: game.total
  };
}

function TimeNetworkDivFinal({ game, selectedTeam }: { game: EnrichedGame; selectedTeam?: string | null }) {
  // Only calculate betting results if we have real odds data
  const hasOdds = game.spread && game.total;
  const results = hasOdds ? calculateBettingResults(game) : null;
  
  // Determine final text based on period (4 = regulation, 5+ = OT)
  let finalText = 'Final';
  
  // Check for special status details (Postponed, Suspended, etc.)
  if (game.statusDetail && game.statusDetail !== 'Final') {
    finalText = game.statusDetail;
  } else if (game.period && game.period > 4) {
    const overtimes = game.period - 4;
    finalText = overtimes === 1 ? 'F/OT' : `F/${overtimes}OT`;
  }
  
  // Format date as mm/dd for team pages
  let formattedDate = '';
  if (selectedTeam && game.date) {
    const dateObj = new Date(game.date);
    const month = dateObj.getMonth() + 1; // getMonth() returns 0-11
    const day = dateObj.getDate();
    formattedDate = `${month}/${day}`;
  }
  
  return (
    <div className="relative shrink-0 w-[221px]" data-name="timeNetwork-div">
      <div className="content-stretch flex items-center justify-between not-italic overflow-clip p-[8px] relative rounded-[inherit] text-[11px] text-nowrap tracking-[0.22px] w-full">
        {selectedTeam ? (
          <p className="font-['Barlow:Bold',sans-serif] leading-none relative shrink-0 text-white uppercase flex items-center">
            <span>{game.statusDetail === 'Postponed' ? 'PPD' : 'F'}</span>
            <span style={{ width: '4px' }} />
            <span>{formattedDate}</span>
          </p>
        ) : (
          <p className={`font-['Barlow:Bold',sans-serif] leading-none relative shrink-0 text-white uppercase ${finalText === 'Postponed' ? 'text-[#ff453a]' : ''}`}>{finalText}</p>
        )}
        {results && (
          <div className="font-['Barlow:SemiBold',sans-serif] leading-none relative shrink-0 text-[#c7c7cc] text-right flex items-center gap-[8px]">
            <span>{results.coverTeam} {results.coverSpread}</span>
            <span>{results.ouResult} {results.ouTotal}</span>
          </div>
        )}
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function GameCardHeaderFinal({ game, selectedTeam }: { game: EnrichedGame; selectedTeam?: string | null }) {
  return (
    <div className="relative shrink-0 w-full" data-name="gameCardHeader">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(180deg, rgba(24, 25, 25, 1) 0%, rgba(20, 20, 21, 0.8) 100%)'
        }}
      />
      <div className="content-stretch flex items-center justify-between overflow-clip px-0 py-[2px] relative rounded-[inherit] w-full">
        <TimeNetworkDivFinal game={game} selectedTeam={selectedTeam} />
        <TeamStatsHeaderDivFinal />
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function FinalScore({ score, isWinner }: { score: number; isWinner?: boolean }) {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-visible relative shrink-0" data-name="finalScore">
      <p className="font-['Barlow_Semi_Condensed:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[20px] text-nowrap text-right text-white tracking-[0.4px]">{score}</p>
      {isWinner && (
        <img alt="Winner Arrow" className="absolute right-[-7px] w-[3px] h-[8px]" src={imgWinnerArrow} />
      )}
    </div>
  );
}

function MatchupFinal({ game, hideScores }: { game: EnrichedGame; hideScores?: boolean }) {
  const awayScore = game.awayTeam.score || 0;
  const homeScore = game.homeTeam.score || 0;
  const awayWins = awayScore > homeScore;
  const homeWins = homeScore > awayScore;
  
  // If game is postponed or scores are 0-0, don't show winner arrow or maybe even scores?
  // Usually postponed games have 0-0 score.
  const isPostponed = game.statusDetail === 'Postponed';
  const showScores = !hideScores && !isPostponed && (awayScore > 0 || homeScore > 0);
  
  return (
    <div className="relative shrink-0 w-[221px]" data-name="matchup">
      <div className="content-center flex flex-wrap gap-[4px] items-center justify-between overflow-clip px-[8px] py-0 relative rounded-[inherit] w-full">
        <AwayTeam logo={game.awayTeam.logo} color={game.awayTeam.color} code={game.awayTeam.code} record={game.awayTeam.record} />
        {showScores && <FinalScore score={awayScore} isWinner={awayWins} />}
        <HomeTeam logo={game.homeTeam.logo} color={game.homeTeam.color} code={game.homeTeam.code} record={game.homeTeam.record} />
        {showScores && <FinalScore score={homeScore} isWinner={homeWins} />}
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function GameDataFinal({ game, hideScores }: { game: EnrichedGame; hideScores?: boolean }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="gameData">
      <MatchupFinal game={game} hideScores={hideScores} />
      <TeamStatsFinal game={game} />
    </div>
  );
}

// Box Score Modal Component - Removed (now in /components/BoxScoreModal.tsx)
// Keeping this comment as a marker
function _OldBoxScoreModal_Removed() {
  return null;
}

if (false) { // Wrapped old code to prevent compilation but keep for reference temporarily
function __BoxScoreModalOld({ game, onClose }: { game: EnrichedGame; onClose: () => void }) {
  // Extract player stats from box score
  const getPlayerStats = (teamAbbr: string, isAway: boolean) => {
    if (!game.boxScoreData?.boxscore?.players) return [];
    
    const playerData = game.boxScoreData.boxscore.players;
    const teamPlayers = playerData.find((team: any) => {
      const normalizedAbbr = normalizeTeamAbbr(team.team?.abbreviation);
      return normalizedAbbr === teamAbbr;
    });
    
    if (!teamPlayers?.statistics?.[0]?.athletes) return [];
    
    // Log the labels to see the correct order
    const labels = teamPlayers.statistics[0]?.labels || [];
    console.log(`Player stat labels for ${teamAbbr}:`, labels);
    
    return teamPlayers.statistics[0].athletes.map((athlete: any) => {
      const stats = athlete.stats || [];
      console.log(`${athlete.athlete?.displayName}: `, stats);
      return {
        name: athlete.athlete?.displayName || 'Unknown',
        position: athlete.athlete?.position?.abbreviation || '',
        min: stats[0] || '0',
        pts: stats[13] || '0', // PTS is typically at index 13
        reb: stats[6] || '0',
        ast: stats[7] || '0',
        fg: stats[1] || '0-0',
        '3pt': stats[2] || '0-0',
        ft: stats[3] || '0-0',
        stl: stats[8] || '0',
        blk: stats[9] || '0',
        to: stats[10] || '0',
        pf: stats[11] || '0',
        oreb: stats[4] || '0',
        dreb: stats[5] || '0',
      };
    });
  };

  const awayPlayers = getPlayerStats(game.awayTeam.code, true);
  const homePlayers = getPlayerStats(game.homeTeam.code, false);

  const awayScore = game.awayTeam.score || 0;
  const homeScore = game.homeTeam.score || 0;
  const awayWins = awayScore > homeScore;
  const homeWins = homeScore > awayScore;

  // Calculate shooting percentages
  const calculate3PtPct = (made: string, attempted: string) => {
    const m = parseInt(made);
    const a = parseInt(attempted);
    if (a === 0) return '0%';
    return ((m / a) * 100).toFixed(1) + '%';
  };

  const calculateFTPct = (made: string, attempted: string) => {
    const m = parseInt(made);
    const a = parseInt(attempted);
    if (a === 0) return '0%';
    return ((m / a) * 100).toFixed(1) + '%';
  };

  const away3PtPct = game.awayTeam.threePM && game.awayTeam.threePA 
    ? calculate3PtPct(game.awayTeam.threePM, game.awayTeam.threePA) 
    : '-';
  const home3PtPct = game.homeTeam.threePM && game.homeTeam.threePA 
    ? calculate3PtPct(game.homeTeam.threePM, game.homeTeam.threePA) 
    : '-';

  const awayFTPct = game.awayTeam.ftM && game.awayTeam.ftA 
    ? calculateFTPct(game.awayTeam.ftM, game.awayTeam.ftA) 
    : '-';
  const homeFTPct = game.homeTeam.ftM && game.homeTeam.ftA 
    ? calculateFTPct(game.homeTeam.ftM, game.homeTeam.ftA) 
    : '-';

  // Team stats helper
  const TeamStatRow = ({ label, awayStat, homeStat }: { label: string; awayStat: string | number; homeStat: string | number }) => (
    <div className="flex items-center justify-between py-2 border-b border-[#2c2c2e]/30">
      <div className="text-white font-['Barlow:SemiBold',sans-serif] text-[12px] w-[60px] text-right">{awayStat}</div>
      <div className="text-[#8e8e93] text-[10px] font-['Barlow:Bold',sans-serif] uppercase tracking-wider">{label}</div>
      <div className="text-white font-['Barlow:SemiBold',sans-serif] text-[12px] w-[60px] text-left">{homeStat}</div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2"
      onClick={onClose}
    >
      <div 
        className="bg-[#1c1c1e] rounded-[12px] w-full max-w-[393px] max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Compact */}
        <div className="flex items-center justify-between p-4 border-b border-[#2c2c2e]">
          <div className="flex items-center justify-between flex-1 mr-4">
            {/* Away Team */}
            <div className="flex items-center gap-2">
              <img src={game.awayTeam.logo} alt={game.awayTeam.code} className="w-8 h-8" />
              <div>
                <p className="text-white font-['Barlow:Bold',sans-serif] text-[14px]">{game.awayTeam.code}</p>
                <p className="text-[#8e8e93] text-[10px]">{game.awayTeam.record}</p>
              </div>
            </div>
            
            {/* Scores */}
            <div className="flex items-center gap-2">
              <div className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[24px]">
                {awayScore}
                {awayWins && <span className="text-[#34c759] ml-1 text-[12px]">W</span>}
              </div>
              <div className="text-[#8e8e93] text-[12px]">-</div>
              <div className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[24px]">
                {homeScore}
                {homeWins && <span className="text-[#34c759] ml-1 text-[12px]">W</span>}
              </div>
            </div>
            
            {/* Home Team */}
            <div className="flex items-center gap-2">
              <div>
                <p className="text-white font-['Barlow:Bold',sans-serif] text-[14px] text-right">{game.homeTeam.code}</p>
                <p className="text-[#8e8e93] text-[10px] text-right">{game.homeTeam.record}</p>
              </div>
              <img src={game.homeTeam.logo} alt={game.homeTeam.code} className="w-8 h-8" />
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-[#8e8e93] hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Team Stats Summary */}
          <div className="p-4 border-b border-[#2c2c2e] bg-[#141414]">
            <h3 className="text-[#8e8e93] text-[10px] font-['Barlow:Bold',sans-serif] uppercase tracking-wider mb-3 text-center">Team Stats</h3>
            <div className="space-y-1">
              <TeamStatRow 
                label="PTS" 
                awayStat={awayScore} 
                homeStat={homeScore} 
              />
              <TeamStatRow 
                label="FG%" 
                awayStat={game.awayTeam.fgPct || '-'} 
                homeStat={game.homeTeam.fgPct || '-'} 
              />
              <TeamStatRow 
                label="3P/A" 
                awayStat={game.awayTeam.threePM && game.awayTeam.threePA ? `${game.awayTeam.threePM}/${game.awayTeam.threePA}` : '-'} 
                homeStat={game.homeTeam.threePM && game.homeTeam.threePA ? `${game.homeTeam.threePM}/${game.homeTeam.threePA}` : '-'} 
              />
              <TeamStatRow 
                label="3P%" 
                awayStat={away3PtPct} 
                homeStat={home3PtPct} 
              />
              <TeamStatRow 
                label="FT/A" 
                awayStat={game.awayTeam.ftM && game.awayTeam.ftA ? `${game.awayTeam.ftM}/${game.awayTeam.ftA}` : '-'} 
                homeStat={game.homeTeam.ftM && game.homeTeam.ftA ? `${game.homeTeam.ftM}/${game.homeTeam.ftA}` : '-'} 
              />
              <TeamStatRow 
                label="FT%" 
                awayStat={awayFTPct} 
                homeStat={homeFTPct} 
              />
              <TeamStatRow 
                label="REB" 
                awayStat={(game.awayTeam as any).totalRebounds || '-'} 
                homeStat={(game.homeTeam as any).totalRebounds || '-'} 
              />
              <TeamStatRow 
                label="AST" 
                awayStat={(game.awayTeam as any).assists || '-'} 
                homeStat={(game.homeTeam as any).assists || '-'} 
              />
              <TeamStatRow 
                label="TO" 
                awayStat={game.awayTeam.turnovers || '-'} 
                homeStat={game.homeTeam.turnovers || '-'} 
              />
              <TeamStatRow 
                label="STL" 
                awayStat={(game.awayTeam as any).steals || '-'} 
                homeStat={(game.homeTeam as any).steals || '-'} 
              />
              <TeamStatRow 
                label="BLK" 
                awayStat={(game.awayTeam as any).blocks || '-'} 
                homeStat={(game.homeTeam as any).blocks || '-'} 
              />
              <TeamStatRow 
                label="PAINT" 
                awayStat={(game.awayTeam as any).pointsInPaint || '-'} 
                homeStat={(game.homeTeam as any).pointsInPaint || '-'} 
              />
              <TeamStatRow 
                label="FAST BRK" 
                awayStat={(game.awayTeam as any).fastBreakPoints || '-'} 
                homeStat={(game.homeTeam as any).fastBreakPoints || '-'} 
              />
              <TeamStatRow 
                label="BENCH" 
                awayStat={(game.awayTeam as any).benchPoints || '-'} 
                homeStat={(game.homeTeam as any).benchPoints || '-'} 
              />
              <TeamStatRow 
                label="BIG LEAD" 
                awayStat={(game.awayTeam as any).biggestLead || '-'} 
                homeStat={(game.homeTeam as any).biggestLead || '-'} 
              />
            </div>
          </div>

          {/* Player Stats - Away Team */}
          <div className="p-4 border-b border-[#2c2c2e]">
            <div className="flex items-center gap-2 mb-3">
              <img src={game.awayTeam.logo} alt={game.awayTeam.code} className="w-5 h-5" />
              <h3 className="text-white font-['Barlow:Bold',sans-serif] text-[13px]">{game.awayTeam.code} Box Score</h3>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-[10px] min-w-[360px]">
                <thead>
                  <tr className="border-b border-[#2c2c2e]">
                    <th className="text-left text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider pr-2 sticky left-0 bg-[#1c1c1e]">Player</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">MIN</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">PTS</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">REB</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">AST</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">FG</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">3PT</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">FT</th>
                  </tr>
                </thead>
                <tbody>
                  {awayPlayers.length > 0 ? awayPlayers.map((player, idx) => (
                    <tr key={idx} className="border-b border-[#2c2c2e]/30">
                      <td className="text-white font-['Barlow:SemiBold',sans-serif] py-2 pr-2 sticky left-0 bg-[#1c1c1e]">{player.name}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.min}</td>
                      <td className="text-white text-center font-['Barlow:Bold',sans-serif] py-2 px-1">{player.pts}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.reb}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.ast}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.fg}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player['3pt']}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.ft}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="text-[#8e8e93] text-center py-4 font-['Barlow:Regular',sans-serif]">No player data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Player Stats - Home Team */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <img src={game.homeTeam.logo} alt={game.homeTeam.code} className="w-5 h-5" />
              <h3 className="text-white font-['Barlow:Bold',sans-serif] text-[13px]">{game.homeTeam.code} Box Score</h3>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-[10px] min-w-[360px]">
                <thead>
                  <tr className="border-b border-[#2c2c2e]">
                    <th className="text-left text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider pr-2 sticky left-0 bg-[#1c1c1e]">Player</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">MIN</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">PTS</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">REB</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">AST</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">FG</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">3PT</th>
                    <th className="text-center text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] pb-2 uppercase tracking-wider px-1">FT</th>
                  </tr>
                </thead>
                <tbody>
                  {homePlayers.length > 0 ? homePlayers.map((player, idx) => (
                    <tr key={idx} className="border-b border-[#2c2c2e]/30">
                      <td className="text-white font-['Barlow:SemiBold',sans-serif] py-2 pr-2 sticky left-0 bg-[#1c1c1e]">{player.name}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.min}</td>
                      <td className="text-white text-center font-['Barlow:Bold',sans-serif] py-2 px-1">{player.pts}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.reb}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.ast}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.fg}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player['3pt']}</td>
                      <td className="text-[#d1d1d6] text-center font-['Barlow:Regular',sans-serif] py-2 px-1">{player.ft}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="text-[#8e8e93] text-center py-4 font-['Barlow:Regular',sans-serif]">No player data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
} // End of wrapped old code

function GameCardFinal({ game, selectedTeam, onCardClick, hideScores }: { game: EnrichedGame; selectedTeam?: string | null; onCardClick?: (game: EnrichedGame) => void; hideScores?: boolean }) {
  return (
    <div 
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer" 
      data-name="gameCard-final"
      onClick={() => onCardClick?.(game)}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-black inset-0 rounded-[8px]" />
        <div 
          className="absolute bg-repeat inset-0 opacity-10 rounded-[8px]" 
          style={{ 
            backgroundImage: `url('${imgGameCardPre}')`,
            backgroundSize: '30.72px 30.72px',
            backgroundPosition: 'top left'
          }} 
        />
      </div>
      <div className="content-end flex flex-wrap gap-[8px_4px] items-end overflow-clip pb-[16px] pt-0 px-0 relative rounded-[inherit] w-full">
        <GameCardHeaderFinal game={game} selectedTeam={selectedTeam} />
        <GameDataFinal game={game} hideScores={hideScores} />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

// Live game components
function TimeNetworkDivLive({ game }: { game: EnrichedGame }) {
  // Format the quarter display
  let quarterText = `${game.quarter}Q`;
  if (game.quarter && game.quarter > 4) {
    const overtimes = game.quarter - 4;
    quarterText = overtimes === 1 ? 'OT' : `${overtimes}OT`;
  }
  
  return (
    <div className="relative shrink-0 w-[221px]" data-name="timeNetwork-div">
      <div className="content-stretch flex items-center justify-between not-italic overflow-clip p-[8px] relative rounded-[inherit] text-[11px] text-nowrap tracking-[0.22px] w-full">
        <div className="font-['Barlow:Bold',sans-serif] leading-none relative shrink-0 text-white uppercase flex items-center gap-[4px]">
          <span className="text-[#ff453a]">{game.clock}</span>
          <span>{quarterText}</span>
        </div>
        <p className="font-['Barlow:SemiBold',sans-serif] leading-none relative shrink-0 text-[#c7c7cc] text-right">{game.network}</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function LiveScore({ score }: { score: number }) {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-visible relative shrink-0" data-name="liveScore">
      <p className="font-['Barlow_Semi_Condensed:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[20px] text-nowrap text-right text-white tracking-[0.4px]">{score}</p>
    </div>
  );
}

function MatchupLive({ game, hideScores }: { game: EnrichedGame; hideScores?: boolean }) {
  const awayScore = game.awayTeam.score || 0;
  const homeScore = game.homeTeam.score || 0;
  
  return (
    <div className="relative shrink-0 w-[221px]" data-name="matchup">
      <div className="content-center flex flex-wrap gap-[4px] items-center justify-between overflow-clip px-[8px] py-0 relative rounded-[inherit] w-full">
        <AwayTeam logo={game.awayTeam.logo} color={game.awayTeam.color} code={game.awayTeam.code} record={game.awayTeam.record} />
        {!hideScores && <LiveScore score={awayScore} />}
        <HomeTeam logo={game.homeTeam.logo} color={game.homeTeam.color} code={game.homeTeam.code} record={game.homeTeam.record} />
        {!hideScores && <LiveScore score={homeScore} />}
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function GameDataLive({ game, hideScores }: { game: EnrichedGame; hideScores?: boolean }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="gameData">
      <MatchupLive game={game} hideScores={hideScores} />
      <TeamStatsFinal game={game} />
    </div>
  );
}

function GameCardHeaderLive({ game }: { game: EnrichedGame }) {
  return (
    <div className="relative shrink-0 w-full" data-name="gameCardHeader">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(180deg, rgba(24, 25, 25, 1) 0%, rgba(20, 20, 21, 0.8) 100%)'
        }}
      />
      <div className="content-stretch flex items-center justify-between overflow-clip px-0 py-[2px] relative rounded-[inherit] w-full">
        <TimeNetworkDivLive game={game} />
        <TeamStatsHeaderDivFinal />
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function GameCardLive({ game, selectedTeam, onCardClick, hideScores }: { game: EnrichedGame; selectedTeam?: string | null; onCardClick?: (game: EnrichedGame) => void; hideScores?: boolean }) {
  return (
    <div 
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer" 
      data-name="gameCard-live"
      onClick={() => onCardClick?.(game)}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-black inset-0 rounded-[8px]" />
        <div 
          className="absolute bg-repeat inset-0 opacity-10 rounded-[8px]" 
          style={{ 
            backgroundImage: `url('${imgGameCardPre}')`,
            backgroundSize: '30.72px 30.72px',
            backgroundPosition: 'top left'
          }} 
        />
      </div>
      <div className="content-end flex flex-wrap gap-[8px_4px] items-end overflow-clip pb-[16px] pt-0 px-0 relative rounded-[inherit] w-full">
        <GameCardHeaderLive game={game} />
        <GameDataLive game={game} hideScores={hideScores} />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function generateDateOptions(): DateOption[] {
  const dates: DateOption[] = [];
  const today = new Date();
  
  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Generate 14 days: 7 days before and 7 days after today
  for (let i = -7; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    dates.push({
      day: dayNames[date.getDay()],
      date: date.getDate().toString(),
      month: monthNames[date.getMonth()],
      fullDate: formatLocalDate(date)
    });
  }
  
  return dates;
}

export default function App() {
  // Check if we should show diagnostic
  const showDiagnostic = new URLSearchParams(window.location.search).get('diagnostic') === 'true';
  
  if (showDiagnostic) {
    return <PWADiagnostic />;
  }
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'scores' | 'standings' | 'settings'>('scores');
  
  // Settings state
  const [hideScores, setHideScores] = useState(() => {
    const saved = localStorage.getItem('hideScores');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [selectedDate, setSelectedDate] = useState(7); // Default to today (middle date)
  const [games, setGames] = useState<EnrichedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dates] = useState<DateOption[]>(generateDateOptions());
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [allGames, setAllGames] = useState<EnrichedGame[]>([]); // Store all games before filtering
  const gamesCache = useRef<Record<string, EnrichedGame[]>>({});
  const nextGameRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const teamStatsCache = useRef<Record<string, { ppg: string; ppgRank: string; oppg: string; oppgRank: string }>>({});
  const boxScoreCache = useRef<Record<string, any>>({});
  const [statsCalculated, setStatsCalculated] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedGameForModal, setSelectedGameForModal] = useState<EnrichedGame | null>(null);
  const [selectedPregameGame, setSelectedPregameGame] = useState<EnrichedGame | null>(null);

  // Save hideScores setting to localStorage
  useEffect(() => {
    localStorage.setItem('hideScores', JSON.stringify(hideScores));
  }, [hideScores]);

  // Configure PWA meta tags and behavior for iOS
  useEffect(() => {
    // Set viewport for proper mobile scaling
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Add iOS PWA meta tags
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }, // Makes status bar blend with app
      { name: 'apple-mobile-web-app-title', content: 'sqorz' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#141415' },
      { name: 'format-detection', content: 'telephone=no' },
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Add manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      manifestLink.setAttribute('href', '/manifest.json');
      document.head.appendChild(manifestLink);
    }

    // Add Apple touch icons (required for iOS PWA)
    const appleTouchIconSizes = ['180x180', '167x167', '152x152', '120x120'];
    appleTouchIconSizes.forEach(size => {
      let link = document.querySelector(`link[rel="apple-touch-icon"][sizes="${size}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'apple-touch-icon');
        link.setAttribute('sizes', size);
        link.setAttribute('href', '/icon-512.png'); // Using the manifest icon as fallback
        document.head.appendChild(link);
      }
    });

    // Register Service Worker (REQUIRED for PWA)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          
          // Check for updates immediately
          registration.update();
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New service worker available, reloading...');
                  // New service worker available, reload to activate
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error);
        });
    }

  }, []);

  // Function to update a specific game's stats
  function updateGameStats(gameId: number, awayStats: any, homeStats: any, boxScoreData?: any, eventId?: string) {
    console.log(`📊 Updating game ${gameId} with stats:`, { awayStats, homeStats });
    
    // Update in games array - Preserve team IDs when merging stats
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? {
              ...game,
              awayTeam: { ...game.awayTeam, ...awayStats, statsLoading: false, id: game.awayTeam.id },
              homeTeam: { ...game.homeTeam, ...homeStats, statsLoading: false, id: game.homeTeam.id },
              boxScoreData: boxScoreData || game.boxScoreData,
              eventId: eventId || game.eventId
            }
          : game
      )
    );
    
    // Update in allGames array - Preserve team IDs when merging stats
    setAllGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? {
              ...game,
              awayTeam: { ...game.awayTeam, ...awayStats, statsLoading: false, id: game.awayTeam.id },
              homeTeam: { ...game.homeTeam, ...homeStats, statsLoading: false, id: game.homeTeam.id },
              boxScoreData: boxScoreData || game.boxScoreData,
              eventId: eventId || game.eventId
            }
          : game
      )
    );
    
    // Update in cache - Preserve team IDs when merging stats
    Object.keys(gamesCache.current).forEach(dateKey => {
      gamesCache.current[dateKey] = gamesCache.current[dateKey].map(game =>
        game.id === gameId
          ? {
              ...game,
              awayTeam: { ...game.awayTeam, ...awayStats, statsLoading: false, id: game.awayTeam.id },
              homeTeam: { ...game.homeTeam, ...homeStats, statsLoading: false, id: game.homeTeam.id },
              boxScoreData: boxScoreData || game.boxScoreData,
              eventId: eventId || game.eventId
            }
          : game
      );
    });
  }

  // Calculate season stats on first load
  useEffect(() => {
    async function initStats() {
      if (!statsCalculated && Object.keys(calculatedTeamStats).length === 0) {
        console.log('Initiating season stats calculation...');
        setStatsLoading(true);
        try {
          const result = await calculateSeasonStats();
          console.log('Stats calculation returned:', Object.keys(result).length, 'teams');
          console.log('calculatedTeamStats now has:', Object.keys(calculatedTeamStats).length, 'teams');
          // Clear games cache so they can be refreshed with new stats
          gamesCache.current = {};
          setStatsCalculated(true);
        } catch (error) {
          console.error('Error calculating stats:', error);
        } finally {
          setStatsLoading(false);
        }
      } else if (statsCalculated) {
        // If stats already calculated (from hot reload), ensure cache is cleared
        setStatsLoading(false);
      }
    }
    initStats();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      // Fetch all games across all dates for the selected team
      fetchAllGamesForTeam(selectedTeam);
    } else {
      // Normal behavior: fetch games for selected date
      fetchGames(dates[selectedDate].fullDate);
    }
  }, [selectedDate, dates, statsCalculated, selectedTeam]);

  // Get all teams from teamData so any team can be selected (memoized)
  const availableTeams = useMemo(() => Object.keys(teamData), []);

  // Filter games to display
  const displayGames = selectedTeam 
    ? allGames
        .filter(game => 
          game.awayTeam.code === selectedTeam || game.homeTeam.code === selectedTeam
        )
        .sort((a, b) => {
          // Sort by date
          const dateA = new Date(a.date || '').getTime();
          const dateB = new Date(b.date || '').getTime();
          return dateA - dateB;
        })
    : games;

  // Find the index of the next upcoming game
  const nextGameIndex = selectedTeam ? displayGames.findIndex(game => game.status === 'pre') : -1;

  // Scroll to next game when team is selected and games are loaded
  useEffect(() => {
    if (selectedTeam && !loading && nextGameIndex !== -1 && nextGameRef.current && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        nextGameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedTeam, loading, nextGameIndex]);

  // Fetch box score in background without blocking game display
  async function fetchBoxScoreInBackground(eventId: string, gameId: number, awayAbbr: string, homeAbbr: string) {
    console.log(`🔄 fetchBoxScoreInBackground called for game ${gameId} (${awayAbbr} @ ${homeAbbr}), eventId: ${eventId}`);
    try {
      const boxScore = await fetchBoxScore(eventId);
      if (boxScore) {
        console.log(`✅ Box score received for game ${gameId}, extracting stats...`);
        const awayStats = extractTeamStats(boxScore, awayAbbr, true);
        const homeStats = extractTeamStats(boxScore, homeAbbr, false);
        
        // Update the game with the fetched stats and box score data
        updateGameStats(gameId, awayStats, homeStats, boxScore, eventId);
      } else {
        console.warn(`⚠️ Box score fetch returned null for game ${gameId}`);
        // If box score fetch failed, mark as not loading (show dashes)
        updateGameStats(gameId, { statsLoading: false }, { statsLoading: false });
      }
    } catch (error) {
      console.error(`Error fetching box score in background for game ${gameId}:`, error);
      // Mark as not loading even on error
      updateGameStats(gameId, { statsLoading: false }, { statsLoading: false });
    }
  }

  async function fetchAllGamesForTeam(teamCode: string) {
    setLoading(true);
    setError(null);
    hasScrolledRef.current = false; // Reset scroll flag when fetching new team
    
    // Helper function to format date as YYYY-MM-DD in local timezone
    const formatLocalDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const pastGames: EnrichedGame[] = [];
      const futureGames: EnrichedGame[] = [];
      
      // Fetch past games (going backwards from today)
      let pastDate = new Date(today);
      let daysChecked = 0;
      const maxDaysToCheck = 180; // Don't go back more than 6 months
      
      while (pastGames.length < 10 && daysChecked < maxDaysToCheck) {
        const dateStr = formatLocalDate(pastDate);
        let gamesForDate: EnrichedGame[];
        
        if (gamesCache.current[dateStr]) {
          gamesForDate = gamesCache.current[dateStr];
        } else {
          const espnDate = dateStr.replace(/-/g, '');
          const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${espnDate}`);
          
          if (response.ok) {
            const data = await response.json();
            gamesForDate = await fetchAndProcessGames(data);
            gamesCache.current[dateStr] = gamesForDate;
          } else {
            gamesForDate = [];
          }
        }
        
        // Filter games for this team and add to past games
        const teamGamesForDate = gamesForDate.filter(game => 
          (game.awayTeam.code === teamCode || game.homeTeam.code === teamCode) && 
          game.status === 'post'
        );
        
        pastGames.push(...teamGamesForDate);
        pastDate.setDate(pastDate.getDate() - 1);
        daysChecked++;
      }
      
      // Fetch future games (going forward from today)
      let futureDate = new Date(today);
      daysChecked = 0;
      
      while (futureGames.length < 10 && daysChecked < maxDaysToCheck) {
        const dateStr = formatLocalDate(futureDate);
        let gamesForDate: EnrichedGame[];
        
        if (gamesCache.current[dateStr]) {
          gamesForDate = gamesCache.current[dateStr];
        } else {
          const espnDate = dateStr.replace(/-/g, '');
          const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${espnDate}`);
          
          if (response.ok) {
            const data = await response.json();
            gamesForDate = await fetchAndProcessGames(data);
            gamesCache.current[dateStr] = gamesForDate;
          } else {
            gamesForDate = [];
          }
        }
        
        // Filter games for this team and add to future games
        const teamGamesForDate = gamesForDate.filter(game => 
          (game.awayTeam.code === teamCode || game.homeTeam.code === teamCode) && 
          game.status === 'pre'
        );
        
        futureGames.push(...teamGamesForDate);
        futureDate.setDate(futureDate.getDate() + 1);
        daysChecked++;
      }
      
      // Combine and sort: take last 10 past games and first 10 future games
      const combinedGames = [
        ...pastGames.slice(-10).reverse(), // Most recent 10, oldest first
        ...futureGames.slice(0, 10)
      ].sort((a, b) => {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return dateA - dateB;
      });
      
      setAllGames(combinedGames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team games:', error);
      setError('Failed to load team games');
      setLoading(false);
    }
  }

  async function fetchAndProcessGames(data: any): Promise<EnrichedGame[]> {
    if (!data.events || data.events.length === 0) {
      return [];
    }
    
    return (await Promise.all(data.events.map(async (event: any) => {
      const competition = event.competitions[0];
      const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
      const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
      
      const awayAbbr = normalizeTeamAbbr(awayTeam?.team?.abbreviation);
      const homeAbbr = normalizeTeamAbbr(homeTeam?.team?.abbreviation);
      
      // Skip non-NBA teams (international games, All-Star, etc.)
      if (!awayAbbr || !homeAbbr || !teamData[awayAbbr] || !teamData[homeAbbr]) {
        console.log(`Skipping non-NBA game: ${awayAbbr} vs ${homeAbbr}`);
        return null;
      }
      
      const awayTeamStats = fetchTeamStatsByAbbr(awayAbbr);
      const homeTeamStats = fetchTeamStatsByAbbr(homeAbbr);
      
      const broadcastNetwork = getNationalBroadcast(competition.broadcasts);
      const gameStatus = competition.status.type.state as 'pre' | 'in' | 'post';
      console.log(`🎯 Processing game ${awayAbbr} @ ${homeAbbr}, status: ${gameStatus}, eventId: ${event.id}`);
      
      const enrichedGame: EnrichedGame = {
        id: parseInt(event.id),
        awayTeam: {
          code: awayAbbr,
          name: teamData[awayAbbr]?.name || awayTeam.team.displayName || '',
          record: awayTeam.records?.[0]?.summary || '0-0',
          logo: awayTeam.team.logo || teamData[awayAbbr]?.logo || 'https://cdn.nba.com/logos/nba/logo.svg',
          color: awayTeam.team.color ? `#${awayTeam.team.color}` : teamData[awayAbbr]?.color || '#000000',
          ppg: awayTeamStats.ppg,
          ppgRank: awayTeamStats.ppgRank,
          oppg: awayTeamStats.oppg,
          oppgRank: awayTeamStats.oppgRank,
          id: awayTeam.team.id, // Store ESPN team ID
        },
        homeTeam: {
          code: homeAbbr,
          name: teamData[homeAbbr]?.name || homeTeam.team.displayName || '',
          record: homeTeam.records?.[0]?.summary || '0-0',
          logo: homeTeam.team.logo || teamData[homeAbbr]?.logo || 'https://cdn.nba.com/logos/nba/logo.svg',
          color: homeTeam.team.color ? `#${homeTeam.team.color}` : teamData[homeAbbr]?.color || '#000000',
          ppg: homeTeamStats.ppg,
          ppgRank: homeTeamStats.ppgRank,
          oppg: homeTeamStats.oppg,
          oppgRank: homeTeamStats.oppgRank,
          id: homeTeam.team.id, // Store ESPN team ID
        },
        time: formatESPNGameTime(event.date, competition.status),
        network: broadcastNetwork,
        spread: getSpreadFromOdds(competition.odds, homeAbbr, awayAbbr) || '',
        total: getTotalFromOdds(competition.odds) || '',
        status: gameStatus,
        period: competition.status.period,
        date: event.date, // Store the ISO date string
        eventId: event.id, // Store ESPN event ID
        arena: competition.venue?.fullName || undefined,
        city: competition.venue?.address?.city || undefined,
        state: competition.venue?.address?.state || undefined,
        broadcast: broadcastNetwork,
      };

      // Log team IDs to verify they were extracted
      console.log(`🆔 Game ${enrichedGame.id}: Away team ID = ${enrichedGame.awayTeam.id}, Home team ID = ${enrichedGame.homeTeam.id}`);

      // Add scores for completed games
      if (gameStatus === 'post') {
        enrichedGame.awayTeam.score = parseInt(awayTeam.score) || 0;
        enrichedGame.homeTeam.score = parseInt(homeTeam.score) || 0;
        
        console.log(`🏀 Completed game detected: ${awayAbbr} @ ${homeAbbr} (Event ID: ${event.id}, Game ID: ${enrichedGame.id})`);
        
        // Mark stats as loading initially
        enrichedGame.awayTeam.statsLoading = true;
        enrichedGame.homeTeam.statsLoading = true;
        
        // Fetch box score in background (don't await)
        console.log(`📥 Triggering box score fetch for game ${enrichedGame.id}...`);
        fetchBoxScoreInBackground(event.id, enrichedGame.id, awayAbbr, homeAbbr);
      }

      // For upcoming games, check if >24 hours away and fetch team streaks
      if (gameStatus === 'pre') {
        const gameDate = new Date(event.date);
        const now = new Date();
        const hoursUntilGame = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursUntilGame > 24) {
          console.log(`🔥 Game ${awayAbbr} @ ${homeAbbr} is ${hoursUntilGame.toFixed(1)} hours away, fetching streaks...`);
          const awayTeamId = awayTeam.team.id;
          const homeTeamId = homeTeam.team.id;
          const gameId = enrichedGame.id;
          
          // Fetch both team streaks in parallel (don't await to avoid slowing down game loading)
          Promise.all([
            fetchTeamStreak(awayTeamId, awayAbbr),
            fetchTeamStreak(homeTeamId, homeAbbr)
          ]).then(([awayStreak, homeStreak]) => {
            console.log(`✅ Streaks fetched for ${awayAbbr} @ ${homeAbbr}: ${awayAbbr}=${awayStreak || 'null'}, ${homeAbbr}=${homeStreak || 'null'}`);
            // Update the game with streak info (even if null, so the component knows we tried)
            setGames(prev => prev.map(g => 
              g.id === gameId 
                ? { 
                    ...g, 
                    awayTeam: { ...g.awayTeam, streak: awayStreak || undefined },
                    homeTeam: { ...g.homeTeam, streak: homeStreak || undefined }
                  }
                : g
            ));
          }).catch(err => {
            console.error('Failed to fetch streaks:', err);
          });
        }
      }

      return enrichedGame;
    }))).filter((game): game is EnrichedGame => game !== null);
  }

  async function fetchBoxScore(gameId: string) {
    // Check cache first
    if (boxScoreCache.current[gameId]) {
      console.log(`Using cached box score for game ${gameId}`);
      return boxScoreCache.current[gameId];
    }

    try {
      console.log(`Fetching box score for game ${gameId}...`);
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch box score for game ${gameId}, status:`, response.status);
        return null;
      }
      
      const data = await response.json();
      
      // Log the structure to understand what we're getting
      console.log(`📦 Box score data structure for game ${gameId}:`, {
        hasBoxscore: !!data.boxscore,
        hasTeams: !!data.boxscore?.teams,
        teamsCount: data.boxscore?.teams?.length,
        topLevelKeys: Object.keys(data)
      });
      
      // Cache the box score data
      boxScoreCache.current[gameId] = data;
      console.log(`Box score fetched and cached for game ${gameId}`);
      
      return data;
    } catch (error) {
      console.error(`Error fetching box score for game ${gameId}:`, error);
      return null;
    }
  }

  function extractTeamStats(boxScore: any, teamAbbr: string, isAway: boolean) {
    const stats: any = {};
    
    // Check game status first to avoid unnecessary warnings for pre-game
    const gameStatus = boxScore?.header?.competitions?.[0]?.status?.type?.state;
    const statusDetail = boxScore?.header?.competitions?.[0]?.status?.type?.shortDetail;
    const isPreGame = gameStatus === 'pre';
    const isPostponed = statusDetail === 'Postponed' || statusDetail === 'PPD' || gameStatus === 'postponed';
    
    if (isPreGame || isPostponed) {
      // For pre-game or postponed, it's expected that stats are empty. Return silently.
      return stats;
    }

    // console.log(`🔍 extractTeamStats called for: ${teamAbbr} (isAway: ${isAway})`);
    
    if (boxScore && boxScore.boxscore && boxScore.boxscore.teams) {
      const boxscoreTeams = boxScore.boxscore.teams;
      
      for (const team of boxscoreTeams) {
        const boxscoreTeamAbbr = normalizeTeamAbbr(team.team.abbreviation);
        
        if (boxscoreTeamAbbr === teamAbbr) {
          const teamStats = team.statistics;
          
          if (teamStats && teamStats.length > 0) {
            // Statistics are directly in the array, not nested in a stats property
            const statsList = teamStats;
            
            // Extract FG%
            stats.fgPct = statsList.find((s: any) => s.name === 'fieldGoalPct')?.displayValue || '-';
            
            // Extract 3P made/attempted from combined stat "14-40"
            const threePtCombined = statsList.find((s: any) => s.name === 'threePointFieldGoalsMade-threePointFieldGoalsAttempted')?.displayValue;
            if (threePtCombined) {
              const [made, attempted] = threePtCombined.split('-');
              stats.threePM = made || '0';
              stats.threePA = attempted || '0';
            } else {
              stats.threePM = '0';
              stats.threePA = '0';
            }
            
            // Extract FT made/attempted from combined stat "14-18"
            const ftCombined = statsList.find((s: any) => s.name === 'freeThrowsMade-freeThrowsAttempted')?.displayValue;
            if (ftCombined) {
              const [made, attempted] = ftCombined.split('-');
              stats.ftM = made || '0';
              stats.ftA = attempted || '0';
            } else {
              stats.ftM = '0';
              stats.ftA = '0';
            }
            
            // Extract turnovers
            stats.turnovers = statsList.find((s: any) => s.name === 'turnovers')?.displayValue || '0';
            
            // Extract additional stats for modal
            stats.totalRebounds = statsList.find((s: any) => s.name === 'totalRebounds')?.displayValue || '0';
            stats.assists = statsList.find((s: any) => s.name === 'assists')?.displayValue || '0';
            stats.steals = statsList.find((s: any) => s.name === 'steals')?.displayValue || '0';
            stats.blocks = statsList.find((s: any) => s.name === 'blocks')?.displayValue || '0';
            stats.fastBreakPoints = statsList.find((s: any) => s.name === 'fastBreakPoints')?.displayValue || '0';
            stats.pointsInPaint = statsList.find((s: any) => s.name === 'pointsInPaint')?.displayValue || '0';
            stats.benchPoints = statsList.find((s: any) => s.name === 'benchPoints')?.displayValue || '0';
            stats.biggestLead = statsList.find((s: any) => s.name === 'biggestLead')?.displayValue || '0';
            
          } else {
            // Only warn if the game is active or finished AND not postponed
            if (!isPreGame && !isPostponed) {
               console.warn(`⚠️ No statistics found for ${teamAbbr} (Game Status: ${gameStatus}, Detail: ${statusDetail}). teamStats:`, teamStats);
            }
          }
          break;
        }
      }
    } else {
      if (!isPreGame && !isPostponed) {
        console.warn(`⚠️ Box score data structure invalid for ${teamAbbr}`);
      }
    }
    
    if (!stats.fgPct && !isPreGame && !isPostponed) {
      console.warn(`⚠️ Stats extraction incomplete for ${teamAbbr}, returning default`);
    }
    
    return stats;
  }

  async function fetchGames(date: string, retryCount = 0) {
    // Check cache first
    if (gamesCache.current[date]) {
      const cachedGames = gamesCache.current[date];
      console.log(`💾 Loaded ${cachedGames.length} games from cache for ${date}`);
      setGames(cachedGames);
      setLoading(false);
      setError(null);
      
      // Check if any games need streak data (>24 hours away)
      cachedGames.forEach((game) => {
        if (game.status === 'pre' && (!game.awayTeam.streak || !game.homeTeam.streak)) {
          const gameDate = new Date(date + 'T' + game.time + ':00');
          const now = new Date();
          const hoursUntilGame = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          if (hoursUntilGame > 24) {
            console.log(`🔥 Cached game ${game.awayTeam.code} @ ${game.homeTeam.code} is ${hoursUntilGame.toFixed(1)} hours away, fetching streaks... [Game ID: ${game.id}]`);
            
            // Use stored team IDs
            const awayTeamId = game.awayTeam.id;
            const homeTeamId = game.homeTeam.id;
            
            if (awayTeamId && homeTeamId) {
              Promise.all([
                fetchTeamStreak(awayTeamId, game.awayTeam.code),
                fetchTeamStreak(homeTeamId, game.homeTeam.code)
              ]).then(([awayStreak, homeStreak]) => {
                console.log(`✅ Streaks fetched for cached game ${game.awayTeam.code} @ ${game.homeTeam.code}: ${game.awayTeam.code}=${awayStreak || 'null'}, ${game.homeTeam.code}=${homeStreak || 'null'}`);
                setGames(prev => prev.map(g => 
                  g.id === game.id ? { 
                    ...g, 
                    awayTeam: { ...g.awayTeam, streak: awayStreak || undefined },
                    homeTeam: { ...g.homeTeam, streak: homeStreak || undefined }
                  } : g
                ));
              });
            } else {
              console.warn(`⚠️ Missing team IDs for cached game ${game.awayTeam.code} @ ${game.homeTeam.code}`);
            }
          }
        }
      });
      
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Format date for ESPN API (YYYYMMDD)
      const espnDate = date.replace(/-/g, '');
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${espnDate}`);
      
      if (response.status === 429) {
        // Rate limited
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          setError(`Rate limited. Retrying in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchGames(date, retryCount + 1);
        } else {
          throw new Error('Rate limit exceeded. Using mock data.');
        }
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.events && data.events.length > 0) {
        const enrichedGames: EnrichedGame[] = (await Promise.all(data.events.map(async (event: any) => {
          const competition = event.competitions[0];
          const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
          const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
          
          const awayAbbr = normalizeTeamAbbr(awayTeam?.team?.abbreviation);
          const homeAbbr = normalizeTeamAbbr(homeTeam?.team?.abbreviation);
          
          // Skip non-NBA teams (international games, All-Star, etc.)
          if (!awayAbbr || !homeAbbr || !teamData[awayAbbr] || !teamData[homeAbbr]) {
            console.log(`Skipping non-NBA game: ${awayAbbr} vs ${homeAbbr}`);
            return null;
          }
          
          // Fetch team statistics using team abbreviations
          const awayTeamStats = fetchTeamStatsByAbbr(awayAbbr);
          const homeTeamStats = fetchTeamStatsByAbbr(homeAbbr);
          
          // Get broadcast network - check if national or local
          const broadcastNetwork = getNationalBroadcast(competition.broadcasts);
          
          // Determine game status
          const gameStatus = competition.status.type.state as 'pre' | 'in' | 'post';
          const statusDetail = competition.status.type.shortDetail;
          
          const enrichedGame: EnrichedGame = {
            id: parseInt(event.id),
            awayTeam: {
              code: awayAbbr,
              name: teamData[awayAbbr]?.name || awayTeam.team.displayName || '',
              record: awayTeam.records?.[0]?.summary || '0-0',
              logo: awayTeam.team.logo || teamData[awayAbbr]?.logo || 'https://cdn.nba.com/logos/nba/logo.svg',
              color: awayTeam.team.color ? `#${awayTeam.team.color}` : teamData[awayAbbr]?.color || '#000000',
              ppg: awayTeamStats.ppg,
              ppgRank: awayTeamStats.ppgRank,
              oppg: awayTeamStats.oppg,
              oppgRank: awayTeamStats.oppgRank,
              id: awayTeam.team.id, // ESPN team ID for injury data
            },
            homeTeam: {
              code: homeAbbr,
              name: teamData[homeAbbr]?.name || homeTeam.team.displayName || '',
              record: homeTeam.records?.[0]?.summary || '0-0',
              logo: homeTeam.team.logo || teamData[homeAbbr]?.logo || 'https://cdn.nba.com/logos/nba/logo.svg',
              color: homeTeam.team.color ? `#${homeTeam.team.color}` : teamData[homeAbbr]?.color || '#000000',
              ppg: homeTeamStats.ppg,
              ppgRank: homeTeamStats.ppgRank,
              oppg: homeTeamStats.oppg,
              oppgRank: homeTeamStats.oppgRank,
              id: homeTeam.team.id, // ESPN team ID for injury data
            },
            time: formatESPNGameTime(event.date, competition.status),
            network: broadcastNetwork,
            spread: getSpreadFromOdds(competition.odds, homeAbbr, awayAbbr) || '',
            total: getTotalFromOdds(competition.odds) || '',
            status: gameStatus,
            statusDetail: statusDetail,
            period: competition.status.period || 4, // Capture period number (4 = regulation, 5+ = OT)
            date: event.date, // Store the ISO date string
            eventId: event.id, // Store ESPN event ID
            arena: competition.venue?.fullName || undefined,
            city: competition.venue?.address?.city || undefined,
            state: competition.venue?.address?.state || undefined,
            broadcast: broadcastNetwork,
          };
          
          // Log team IDs to verify they were extracted
          console.log(`🆔 Game ${enrichedGame.id}: Away team ID = ${enrichedGame.awayTeam.id}, Home team ID = ${enrichedGame.homeTeam.id}`);
          
          // Add scores for completed games
          if (gameStatus === 'post') {
            enrichedGame.awayTeam.score = parseInt(awayTeam.score) || 0;
            enrichedGame.homeTeam.score = parseInt(homeTeam.score) || 0;
            
            console.log(`🏀 [Team Page] Completed game detected: ${awayAbbr} @ ${homeAbbr} (Event ID: ${event.id}, Game ID: ${enrichedGame.id})`);
            
            // Mark stats as loading initially
            enrichedGame.awayTeam.statsLoading = true;
            enrichedGame.homeTeam.statsLoading = true;
            
            // Fetch box score in background (don't await)
            console.log(`📥 [Team Page] Triggering box score fetch for game ${enrichedGame.id}...`);
            fetchBoxScoreInBackground(event.id, enrichedGame.id, awayAbbr, homeAbbr);
          }
          
          // Add scores and live info for in-progress games
          if (gameStatus === 'in') {
            enrichedGame.awayTeam.score = parseInt(awayTeam.score) || 0;
            enrichedGame.homeTeam.score = parseInt(homeTeam.score) || 0;
            enrichedGame.clock = competition.status.displayClock || '';
            enrichedGame.quarter = competition.status.period || 1;
            
            console.log(`🔴 Live game detected: ${awayAbbr} @ ${homeAbbr} - ${enrichedGame.clock} ${enrichedGame.quarter}Q`);
            
            // Mark stats as loading initially
            enrichedGame.awayTeam.statsLoading = true;
            enrichedGame.homeTeam.statsLoading = true;
            
            // Fetch box score in background for live stats
            console.log(`📥 Triggering live box score fetch for game ${enrichedGame.id}...`);
            fetchBoxScoreInBackground(event.id, enrichedGame.id, awayAbbr, homeAbbr);
          }
          
          return enrichedGame;
        }))).filter((game): game is EnrichedGame => game !== null);
        
        // Cache the results
        gamesCache.current[date] = enrichedGames;
        setGames(enrichedGames);
        
        // Update allGames to include current games for team list
        if (!selectedTeam) {
          setAllGames(prevGames => {
            const existingGameIds = new Set(prevGames.map(g => g.id));
            const newGames = enrichedGames.filter(g => !existingGameIds.has(g.id));
            return [...prevGames, ...newGames];
          });
        }
      } else {
        // No games scheduled for this date
        gamesCache.current[date] = [];
        setGames([]);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      gamesCache.current[date] = [];
      setGames([]);
      setError('Failed to fetch games from API');
    }
    setLoading(false);
  }

  function fetchTeamStatsByAbbr(abbr: string): { ppg: string; ppgRank: string; oppg: string; oppgRank: string } {
    // Check if stats have been calculated
    if (calculatedTeamStats[abbr]) {
      const stats = calculatedTeamStats[abbr];
      return {
        ppg: stats.ppg.toFixed(1),
        ppgRank: `${stats.ppgRank}${getOrdinalSuffix(stats.ppgRank)}`,
        oppg: stats.oppg.toFixed(1),
        oppgRank: `${stats.oppgRank}${getOrdinalSuffix(stats.oppgRank)}`,
      };
    }
    
    // Return dashes if stats not yet calculated (silently, no warnings)
    return {
      ppg: '-',
      ppgRank: '-',
      oppg: '-',
      oppgRank: '-',
    };
  }

  function getOrdinalSuffix(rank: number): string {
    const j = rank % 10;
    const k = rank % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  async function fetchTeamStreak(teamId: string, teamAbbr: string): Promise<string | null> {
    console.log(`🔥 Fetching streak for ${teamAbbr} (teamId: ${teamId})`);
    try {
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/standings`);
      const data = await response.json();
      
      if (!data.children || data.children.length === 0) {
        console.log(`⚠️ No standings data found`);
        return null;
      }
      
      // Find the team in the standings
      for (const conference of data.children) {
        if (!conference.standings?.entries) continue;
        
        for (const entry of conference.standings.entries) {
          if (entry.team.id === teamId) {
            // Found the team, now get streak from stats
            const stats = entry.stats;
            if (!stats) continue;
            
            // Find the streak stat (usually in the stats array)
            const streakStat = stats.find((s: any) => s.name === 'streak' || s.type === 'streak');
            if (streakStat && streakStat.displayValue) {
              const streak = streakStat.displayValue; // e.g., "W3" or "L2"
              // Add space between letter and number
              const formattedStreak = streak.replace(/([WL])(\d+)/, '$1 $2');
              console.log(`✅ Streak for ${teamAbbr}: ${formattedStreak}`);
              return formattedStreak;
            }
          }
        }
      }
      
      console.log(`⚠️ Team ${teamAbbr} not found in standings`);
      return null;
    } catch (error) {
      console.error(`Error fetching streak for ${teamAbbr}:`, error);
      return null;
    }
  }

  function formatESPNGameTime(dateString: string, status: any): string {
    if (status.type.state === 'pre') {
      const gameDate = new Date(dateString);
      const hours = gameDate.getHours();
      const minutes = gameDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    } else if (status.type.state === 'in') {
      return `${status.displayClock} ${status.period.number}Q`;
    } else {
      return 'Final';
    }
  }

  function getSpreadFromOdds(odds: any[], homeAbbr: string, awayAbbr: string): string | null {
    if (!odds || odds.length === 0) return null;
    
    const spread = odds[0]?.details;
    if (!spread) return null;
    
    // ESPN format is usually "TEAM -X.X" or "TEAM +X.X"
    // Parse the team and spread value
    const match = spread.match(/([A-Z]+)\s*([-+]?\d+\.?\d*)/i);
    if (!match) return spread;
    
    const teamInSpread = normalizeTeamAbbr(match[1]);
    const spreadValue = parseFloat(match[2]);
    
    if (isNaN(spreadValue)) return spread;
    
    // Convert to be relative to home team
    // If home team is in the spread, use it as-is
    // If away team is in the spread, flip the sign
    if (teamInSpread === homeAbbr) {
      return spreadValue > 0 ? `+${spreadValue}` : spreadValue.toString();
    } else if (teamInSpread === awayAbbr) {
      const flipped = -spreadValue;
      return flipped > 0 ? `+${flipped}` : flipped.toString();
    }
    
    // Fallback: assume it's already relative to home team
    return spreadValue > 0 ? `+${spreadValue}` : spreadValue.toString();
  }

  function getTotalFromOdds(odds: any[]): string | null {
    if (!odds || odds.length === 0) return null;
    const overUnder = odds[0]?.overUnder;
    return overUnder ? overUnder.toString() : null;
  }

  // Generate realistic spread based on team quality (PPG differential and records)
  function generateRealisticSpread(homeAbbr: string, awayAbbr: string, homeRecord: string, awayRecord: string): string {
    const homeStats = calculatedTeamStats[homeAbbr];
    const awayStats = calculatedTeamStats[awayAbbr];
    
    // Parse records to get win percentages
    const parseRecord = (record: string) => {
      const [wins, losses] = record.split('-').map(Number);
      return wins / (wins + losses);
    };
    
    const homeWinPct = parseRecord(homeRecord);
    const awayWinPct = parseRecord(awayRecord);
    
    let spreadValue = 0;
    
    if (homeStats && awayStats) {
      // Calculate based on PPG differential and win percentage
      const ppgDiff = homeStats.ppg - awayStats.ppg;
      const oppgDiff = awayStats.oppg - homeStats.oppg; // Lower oPPG is better
      const recordDiff = (homeWinPct - awayWinPct) * 10; // Scale win % difference
      
      // Combine factors: PPG diff, defensive diff, and record
      spreadValue = (ppgDiff * 0.5) + (oppgDiff * 0.3) + recordDiff + 2.5; // +2.5 for home court advantage
    } else {
      // Fallback to record-based calculation
      const recordDiff = (homeWinPct - awayWinPct) * 15;
      spreadValue = recordDiff + 2.5; // Home court advantage
    }
    
    // Round to nearest 0.5
    spreadValue = Math.round(spreadValue * 2) / 2;
    
    // Clamp between -20 and +20
    spreadValue = Math.max(-20, Math.min(20, spreadValue));
    
    // IMPORTANT: Negate the value because in betting, the favored team has a NEGATIVE spread
    // If home team is better (positive calculation), they should be -X (favored)
    // If away team is better (negative calculation), home should be +X (underdog)
    spreadValue = -spreadValue;
    
    return spreadValue > 0 ? `+${spreadValue}` : spreadValue.toString();
  }

  // Generate realistic total based on team PPG
  function generateRealisticTotal(homeAbbr: string, awayAbbr: string): string {
    const homeStats = calculatedTeamStats[homeAbbr];
    const awayStats = calculatedTeamStats[awayAbbr];
    
    let total = 220; // Default NBA average
    
    if (homeStats && awayStats) {
      // Average of both teams' PPG + both teams' oPPG, divided by 2
      total = (homeStats.ppg + awayStats.ppg + homeStats.oppg + awayStats.oppg) / 2;
      
      // Round to nearest 0.5
      total = Math.round(total * 2) / 2;
    }
    
    return total.toFixed(1);
  }

  function getNationalBroadcast(broadcasts: any[]): string {
    if (!broadcasts || broadcasts.length === 0) {
      return 'NBA League Pass';
    }

    // Log the broadcasts for debugging
    console.log('Broadcasts data:', JSON.stringify(broadcasts, null, 2));

    // National broadcasters - expanded list
    const nationalNetworks = [
      { pattern: 'ESPN', display: 'ESPN' },
      { pattern: 'TNT', display: 'TNT' },
      { pattern: 'ABC', display: 'ABC' },
      { pattern: 'NBA TV', display: 'NBA TV' },
      { pattern: 'NBATV', display: 'NBA TV' },
      { pattern: 'PRIME', display: 'Prime Video' },
      { pattern: 'PEACOCK', display: 'Peacock' },
      { pattern: 'NBC', display: 'NBA League Pass' }, // NBC defaults to League Pass
      { pattern: 'NBCS', display: 'NBA League Pass' } // NBC Sports defaults to League Pass
    ];
    
    // Helper function to normalize strings for comparison
    const normalize = (str: string) => str.toUpperCase().replace(/\s+/g, '');
    
    // Check all broadcasts for national networks
    for (const broadcast of broadcasts) {
      // Check market field first - if it says "national", prioritize it
      if (broadcast.market === 'national' && broadcast.names && broadcast.names.length > 0) {
        const normalizedMarketName = normalize(broadcast.names[0]);
        
        // Check if it's NBC - if so, return League Pass
        if (normalizedMarketName.includes('NBC') && !normalizedMarketName.includes('PEACOCK')) {
          return 'NBA League Pass';
        }
        
        return broadcast.names[0];
      }

      // Check the type field
      if (broadcast.type?.shortName) {
        const typeName = normalize(broadcast.type.shortName);
        for (const network of nationalNetworks) {
          if (typeName.includes(normalize(network.pattern))) {
            return network.display;
          }
        }
      }

      // Check the names array
      if (broadcast.names && broadcast.names.length > 0) {
        for (const name of broadcast.names) {
          const normalizedName = normalize(name);
          
          // Check each national network
          for (const network of nationalNetworks) {
            if (normalizedName.includes(normalize(network.pattern))) {
              return network.display;
            }
          }
        }
      }
    }
    
    // If no national broadcast found, it's local only
    return 'NBA League Pass';
  }

  return (
    <>
      {/* Offline indicator */}
      <OfflineIndicator />
      
      {/* Push notifications (only show in standalone mode) */}
      {window.matchMedia('(display-mode: standalone)').matches && <PushNotifications />}
      
      {selectedGameForModal && (
        <BoxScoreModal 
          game={selectedGameForModal} 
          onClose={() => setSelectedGameForModal(null)} 
        />
      )}
      
      {selectedPregameGame && (
        <PregameModal 
          game={selectedPregameGame} 
          onClose={() => setSelectedPregameGame(null)} 
        />
      )}
      
      <div 
        className="bg-[#141415] w-full flex flex-col items-center"
        style={{ 
          minHeight: '100vh',
          minHeight: '100dvh', // Dynamic viewport height - automatically adjusts for browser UI
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div className="w-full max-w-[393px] flex flex-col" style={{ height: '100vh', height: '100dvh' }}>
          {/* Conditional rendering based on active tab */}
          {activeTab === 'scores' && (
            <>
              {/* Header */}
              <div className="px-4 pt-8 pb-5 flex-shrink-0">
                <PageHeader 
                  selectedDate={selectedDate} 
                  onDateChange={setSelectedDate} 
                  dates={dates}
                  selectedTeam={selectedTeam}
                  onTeamChange={setSelectedTeam}
                  availableTeams={availableTeams}
                />
              </div>

              {/* Game Cards */}
              <div className="scroll-container flex-1 overflow-y-auto px-4 pb-20">
                {statsLoading ? (
                  <div className="text-white text-center py-8">Calculating stats...</div>
                ) : loading ? (
                  <div className="text-white text-center py-8">Loading games...</div>
              ) : displayGames.length > 0 ? (
                <div className="space-y-4">
                  {displayGames.map((game, index) => {
                    const isNextGame = selectedTeam && index === nextGameIndex;
                    
                    if (isNextGame) {
                      return (
                        <div key={game.id} ref={nextGameRef}>
                          {game.status === 'post' ? (
                            <GameCardFinal game={game} selectedTeam={selectedTeam} onCardClick={setSelectedGameForModal} hideScores={hideScores} />
                          ) : game.status === 'in' ? (
                            <GameCardLive game={game} selectedTeam={selectedTeam} onCardClick={setSelectedGameForModal} hideScores={hideScores} />
                          ) : (
                            <GameCardPre game={game} selectedTeam={selectedTeam} onCardClick={setSelectedPregameGame} />
                          )}
                        </div>
                      );
                    }
                    
                    return game.status === 'post' ? (
                      <GameCardFinal key={game.id} game={game} selectedTeam={selectedTeam} onCardClick={setSelectedGameForModal} hideScores={hideScores} />
                    ) : game.status === 'in' ? (
                      <GameCardLive key={game.id} game={game} selectedTeam={selectedTeam} onCardClick={setSelectedGameForModal} hideScores={hideScores} />
                    ) : (
                      <GameCardPre key={game.id} game={game} selectedTeam={selectedTeam} onCardClick={setSelectedPregameGame} />
                    );
                  })}
                </div>
              ) : (
                <div className="text-[#8e8e93] text-center py-8">
                  {selectedTeam ? `No games found for ${selectedTeam}` : 'No games scheduled for this date'}
                </div>
              )}
              {error && <div className="text-red-500 text-center py-2">{error}</div>}
              </div>
            </>
          )}

          {activeTab === 'standings' && <Standings />}

          {activeTab === 'settings' && (
            <Settings 
              hideScores={hideScores} 
              onHideScoresChange={setHideScores}
            />
          )}

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <PWADebug />
      <InstallPrompt />
    </>
  );
}