import { X } from 'lucide-react';

interface PlayerCardProps {
  playerId: string;
  playerName: string;
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
  onClose: () => void;
}

export default function PlayerCard({
  playerName,
  position,
  jerseyNumber,
  headshot,
  teamColor,
  teamLogo,
  teamCode,
  gameStats,
  seasonStats,
  onClose,
}: PlayerCardProps) {
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div 
        className="relative rounded-[24px] w-full max-w-[380px] overflow-hidden flex flex-col bg-gradient-to-br from-[#1a1a1c] to-[#0a0a0b] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 z-10 text-white/70 hover:text-white transition-colors bg-black/50 backdrop-blur-md rounded-full p-2"
        >
          <X size={18} />
        </button>

        {/* Header Section - Horizontal Layout */}
        <div className="relative flex items-center gap-4 p-5 pb-4" style={{ 
          background: `linear-gradient(135deg, ${teamColor}22 0%, ${teamColor}08 100%)`,
          borderBottom: `1px solid ${teamColor}40`
        }}>
          {/* Left Side - Player Image with Logo Background */}
          <div className="relative flex-shrink-0">
            {/* Team Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <img src={teamLogo} alt={teamCode} className="w-24 h-24 object-contain" />
            </div>
            
            {/* Player Headshot */}
            <div className="relative w-[120px] h-[120px] rounded-2xl overflow-hidden" style={{ 
              background: `linear-gradient(135deg, ${teamColor}40 0%, ${teamColor}20 100%)`,
              border: `2px solid ${teamColor}60`
            }}>
              <img 
                src={headshot} 
                alt={playerName}
                className="w-full h-full object-cover object-top scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            {/* Jersey Number Badge */}
            <div 
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: teamColor }}
            >
              <span className="text-white font-['Barlow:Bold',sans-serif] text-[16px]">#{jerseyNumber}</span>
            </div>
          </div>

          {/* Right Side - Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span 
                    className="px-2.5 py-0.5 rounded-md text-white font-['Barlow:SemiBold',sans-serif] text-[11px] uppercase tracking-wide"
                    style={{ backgroundColor: `${teamColor}80` }}
                  >
                    {position}
                  </span>
                  <span className="text-white/80 font-['Barlow:SemiBold',sans-serif] text-[13px]">{teamCode}</span>
                </div>
                <h2 className="text-white leading-none mb-1 flex flex-col">
                  <span className="font-['Barlow:Regular',sans-serif] text-[22px]">{playerName.split(' ')[0]}</span>
                  <span className="font-['Barlow:Bold',sans-serif] text-[26px]">{playerName.split(' ').slice(1).join(' ')}</span>
                </h2>
              </div>
            </div>
            
            {/* Quick Stats in Header */}
            {seasonStats && (
              <div className="flex gap-3 mt-[1px] mr-[0px] mb-[0px] ml-[0px] m-[0px]">
                <div>
                  <p className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">PPG</p>
                  <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[20px] leading-none">{seasonStats.ppg}</p>
                </div>
                <div>
                  <p className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">RPG</p>
                  <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[20px] leading-none">{seasonStats.rpg}</p>
                </div>
                <div>
                  <p className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">APG</p>
                  <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[20px] leading-none">{seasonStats.apg}</p>
                </div>
                <div>
                  <p className="text-white/50 font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">FG%</p>
                  <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[20px] leading-none">{seasonStats.fgPct}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Stats */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white/60 font-['Barlow:Bold',sans-serif] text-[11px] uppercase tracking-wider">Game Stats</h3>
            <div className="h-px flex-1 ml-3" style={{ background: `linear-gradient(90deg, ${teamColor}40 0%, transparent 100%)` }} />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center bg-white/5 rounded-xl py-2.5 border border-white/5">
              <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[24px] leading-none mb-1">{gameStats.pts}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">PTS</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl py-2.5 border border-white/5">
              <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[24px] leading-none mb-1">{gameStats.reb}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">REB</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl py-2.5 border border-white/5">
              <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[24px] leading-none mb-1">{gameStats.ast}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">AST</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl py-2.5 border border-white/5">
              <p className="text-white font-['Barlow_Semi_Condensed:Bold',sans-serif] text-[24px] leading-none mb-1">{gameStats.min}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[9px] uppercase tracking-wide">MIN</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-2.5">
            <div className="text-center">
              <p className="text-white/70 font-['Barlow:SemiBold',sans-serif] text-[13px] mb-0.5">{gameStats.fg}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[8px] uppercase tracking-wide">FG</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 font-['Barlow:SemiBold',sans-serif] text-[13px] mb-0.5">{gameStats['3pt']}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[8px] uppercase tracking-wide">3PT</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 font-['Barlow:SemiBold',sans-serif] text-[13px] mb-0.5">{gameStats.ft}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[8px] uppercase tracking-wide">FT</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 font-['Barlow:SemiBold',sans-serif] text-[13px] mb-0.5">{gameStats.stl}/{gameStats.blk}</p>
              <p className="text-[#8e8e93] font-['Barlow:SemiBold',sans-serif] text-[8px] uppercase tracking-wide">STL/BLK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}