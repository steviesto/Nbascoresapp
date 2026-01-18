// TEMPORARY FILE - This is just the player card JSX that needs to replace lines 1191-1210 and 1242-1261

// Away Team Player Card (IMPROVED VERSION):
<div className="flex-1 min-w-0 flex flex-col gap-1 h-11 justify-center">
  <div className="flex items-center gap-1.5 min-w-0">
    <span className="text-white text-[11px] font-['Barlow:SemiBold',sans-serif] truncate leading-[1.1]">{player.displayName}</span>
    <span className="text-[#8e8e93] text-[8px] font-['Barlow:Medium',sans-serif] bg-white/8 px-1.5 py-0.5 rounded-full shrink-0 leading-none">{player.position}</span>
  </div>
  <div className="flex gap-2.5">
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[12px] font-['Barlow:Bold',sans-serif] leading-none">{player.ppg}</span>
      <span className="text-white/50 text-[7px] font-['Barlow:SemiBold',sans-serif] uppercase leading-none tracking-wide">PPG</span>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[11px] font-['Barlow:Bold',sans-serif] leading-none">{player.rpg}</span>
      <span className="text-white/50 text-[7px] font-['Barlow:SemiBold',sans-serif] uppercase leading-none tracking-wide">RPG</span>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-white text-[11px] font-['Barlow:Bold',sans-serif] leading-none">{player.apg}</span>
      <span className="text-white/50 text-[7px] font-['Barlow:SemiBold',sans-serif] uppercase leading-none tracking-wide">APG</span>
    </div>
  </div>
</div>
