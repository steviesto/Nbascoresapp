import { useState, useEffect } from 'react';

interface TeamStanding {
  id: string;
  name: string;
  logo: string;
  record: string;
  wins: number;
  losses: number;
  winPct: string;
  gb: string;
  conf: string;
  home: string;
  away: string;
  l10: string;
  streak: string;
  conferenceName: string;
  divisionName: string;
  rank: number;
}

export function Standings() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConference, setSelectedConference] = useState<'Eastern Conference' | 'Western Conference'>('Eastern Conference');

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    console.log('🏆 === FETCHING STANDINGS ===');
    
    try {
      setLoading(true);
      const response = await fetch('https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2026');
      
      if (!response.ok) {
        console.error('❌ Failed to fetch standings');
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      // Extract team standings
      const teams: TeamStanding[] = [];
      
      if (data.children) {
        for (const conference of data.children) {
          // Check if conference has standings with divisions
          if (conference.standings?.entries) {
            for (const entry of conference.standings.entries) {
              const teamData: TeamStanding = {
                id: entry.team.id,
                name: entry.team.abbreviation,
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
                  }
                }
              }
            }
          }
        }
      }
      
      // Sort by wins descending
      teams.sort((a, b) => b.wins - a.wins);
      
      console.log(`✅ Fetched ${teams.length} teams from standings`);
      setStandings(teams);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching standings:', error);
      setLoading(false);
    }
  };

  // Filter standings by selected conference
  const filteredStandings = standings.filter(team => 
    team.conferenceName === selectedConference
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Conference selector */}
      <div className="flex-shrink-0 px-4 pt-6 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedConference('Eastern Conference')}
            className={`flex-1 py-2.5 rounded-lg font-['Barlow:SemiBold',sans-serif] text-[13px] transition-all cursor-pointer border-none ${
              selectedConference === 'Eastern Conference'
                ? 'bg-white text-[#141415]'
                : 'bg-[#1c1c1e] text-[#8e8e93]'
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
            className={`flex-1 py-2.5 rounded-lg font-['Barlow:SemiBold',sans-serif] text-[13px] transition-all cursor-pointer border-none ${
              selectedConference === 'Western Conference'
                ? 'bg-white text-[#141415]'
                : 'bg-[#1c1c1e] text-[#8e8e93]'
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
      </div>

      {/* Standings table */}
      <div className="flex-1 overflow-y-auto pb-24 px-4">
        {loading ? (
          <div className="text-white text-center py-8">Loading standings...</div>
        ) : filteredStandings.length > 0 ? (
          <div className="bg-white/5 rounded border border-white/10 overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '600px' }}>
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-2 py-1.5 sticky left-0 bg-[#141415] z-20" style={{ width: '140px', minWidth: '140px' }}>Team</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '40px', minWidth: '40px' }}>W</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '40px', minWidth: '40px' }}>L</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '50px', minWidth: '50px' }}>PCT</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '45px', minWidth: '45px' }}>GB</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '50px', minWidth: '50px' }}>Home</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '50px', minWidth: '50px' }}>Away</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '50px', minWidth: '50px' }}>Conf</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '50px', minWidth: '50px' }}>L10</th>
                  <th className="text-white/50 text-[10px] font-['Barlow:SemiBold',sans-serif] uppercase tracking-wide px-1 py-1.5 text-center" style={{ width: '50px', minWidth: '50px' }}>Strk</th>
                </tr>
              </thead>
              <tbody>
                {filteredStandings.map((team, idx) => {
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
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-2 py-1.5 pr-8 sticky left-0 bg-[#141415] z-10" style={{ width: '140px', minWidth: '140px' }}>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="flex items-center justify-center h-5 rounded-sm text-[11px] font-['Barlow:Bold',sans-serif]"
                            style={{ 
                              width: '24px',
                              minWidth: '24px',
                              maxWidth: '24px',
                              backgroundColor: seedBgColor,
                              border: `1px solid ${seedBorderColor}`,
                              color: seed <= 10 ? '#ffffff' : 'rgba(255,255,255,0.6)'
                            }}
                          >
                            {seed}
                          </div>
                          <img src={team.logo} alt={team.name} className="w-5 h-5" />
                          <span className="text-[13px] font-['Barlow:SemiBold',sans-serif] text-white/80">{team.name}</span>
                        </div>
                      </td>
                      <td className="text-[13px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center text-white/80" style={{ width: '40px', minWidth: '40px' }}>{team.wins}</td>
                      <td className="text-[13px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center text-white/80" style={{ width: '40px', minWidth: '40px' }}>{team.losses}</td>
                      <td className="text-[12px] font-['Barlow:Medium',sans-serif] px-1 py-1.5 text-center text-white/80" style={{ width: '50px', minWidth: '50px' }}>{team.winPct}</td>
                      <td className="text-[12px] font-['Barlow:Bold',sans-serif] px-1 py-1.5 text-center text-white/60" style={{ width: '45px', minWidth: '45px' }}>{team.gb}</td>
                      <td className="text-[12px] font-['Barlow:SemiBold',sans-serif] px-1 py-1.5 text-center text-white/60" style={{ width: '50px', minWidth: '50px' }}>{team.home}</td>
                      <td className="text-[12px] font-['Barlow:SemiBold',sans-serif] px-1 py-1.5 text-center text-white/60" style={{ width: '50px', minWidth: '50px' }}>{team.away}</td>
                      <td className="text-[12px] font-['Barlow:SemiBold',sans-serif] px-1 py-1.5 text-center text-white/60" style={{ width: '50px', minWidth: '50px' }}>{team.conf}</td>
                      <td className="text-[12px] font-['Barlow:SemiBold',sans-serif] px-1 py-1.5 text-center text-white/60" style={{ width: '50px', minWidth: '50px' }}>{team.l10}</td>
                      <td className="text-[12px] font-['Barlow:SemiBold',sans-serif] px-1 py-1.5 text-center text-white/60" style={{ width: '50px', minWidth: '50px' }}>{team.streak}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#8e8e93] text-center py-8">No standings data available</div>
        )}
      </div>
    </div>
  );
}