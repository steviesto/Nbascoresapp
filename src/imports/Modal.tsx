import imgTmLogo from "figma:asset/15344a20d2bedfedf5bcdeabfa142fa47b8f41e0.png";
import imgTmLogo1 from "figma:asset/e4fa94bd1efdbcfe664bb45fc3bd4b14b3e4bb2f.png";
import imgAwayTmLogo from "figma:asset/c9be69ae625bf7be6009944b371e9186ac652442.png";
import imgHeader from "figma:asset/4276d4e579387271bf03156a6171bcfe57a5d913.png";
import imgModal from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";

function StatPicker() {
  return (
    <div className="absolute h-[36px] left-1/2 top-[164px] translate-x-[-50%] w-[385px]" data-name="statPicker">
      <div className="content-stretch flex font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[16px] items-center justify-center leading-[0] overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full text-[22px]">
        <div className="flex flex-col h-full justify-center relative shrink-0 text-[#404040] text-right w-[120px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Lakers</p>
        </div>
        <div className="flex flex-col h-full justify-center relative shrink-0 text-center text-white w-[120px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Team Stats</p>
        </div>
        <div className="flex flex-col h-full justify-center relative shrink-0 text-[#404040] w-[120px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Suns</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function StatRow() {
  return (
    <div className="absolute h-[36px] left-1/2 top-[204px] translate-x-[-50%] w-[385px]" data-name="statRow">
      <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-right text-white w-[128px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic">
            <span className="text-[#8e8e93] text-[15px]">{`(44/87) `}</span>
            <span className="text-[17px]">{` 51%`}</span>
          </p>
        </div>
        <div className="flex flex-col font-['Barlow:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[13px] text-center tracking-[0.26px] w-[88px]">
          <p className="leading-none">Field Goals</p>
        </div>
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-white w-[128px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic">
            <span className="text-[17px]">{`48%  `}</span>
            <span className="text-[#8e8e93] text-[15px]">(44/91)</span>
          </p>
        </div>
        <div className="absolute flex h-[8px] items-center justify-center left-[148px] top-[14px] w-[3px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[3px] relative w-[8px]" data-name="homeWinnerArrowIcon">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 204, 0, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 3">
                  <path d="M4 0L8 3H0L4 0Z" fill="var(--fill-0, #FFCC00)" id="homeWinnerArrowIcon" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function StatRow1() {
  return (
    <div className="absolute h-[36px] left-1/2 top-[240px] translate-x-[-50%] w-[385px]" data-name="statRow">
      <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-right text-white w-[128px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic">
            <span className="text-[#8e8e93] text-[15px]">{`(20/40) `}</span>
            <span className="text-[17px]">{` 50%`}</span>
          </p>
        </div>
        <div className="flex flex-col font-['Barlow:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[13px] text-center tracking-[0.26px] w-[88px]">
          <p className="leading-none">3PM/A</p>
        </div>
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-white w-[128px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic">
            <span className="text-[17px]">{`38%  `}</span>
            <span className="text-[#8e8e93] text-[15px]">(15/37)</span>
          </p>
        </div>
        <div className="absolute flex h-[8px] items-center justify-center left-[148px] top-[14px] w-[3px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[3px] relative w-[8px]" data-name="homeWinnerArrowIcon">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 204, 0, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 3">
                  <path d="M4 0L8 3H0L4 0Z" fill="var(--fill-0, #FFCC00)" id="homeWinnerArrowIcon" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function StatRow2() {
  return (
    <div className="absolute h-[36px] left-1/2 top-[276px] translate-x-[-50%] w-[385px]" data-name="statRow">
      <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-right text-white w-[128px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic">
            <span className="text-[#8e8e93] text-[15px]">{`(20/25) `}</span>
            <span className="text-[17px]">{` 80%`}</span>
          </p>
        </div>
        <div className="flex flex-col font-['Barlow:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[13px] text-center tracking-[0.26px] w-[88px]">
          <p className="leading-none">FTM/A</p>
        </div>
        <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] h-full justify-center leading-[0] relative shrink-0 text-[0px] text-white w-[128px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="font-['Barlow_Semi_Condensed:SemiBold',sans-serif] leading-[normal] not-italic">
            <span className="text-[17px]">{`75%  `}</span>
            <span className="text-[#8e8e93] text-[15px]">(15/20)</span>
          </p>
        </div>
        <div className="absolute flex h-[8px] items-center justify-center left-[148px] top-[14px] w-[3px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[3px] relative w-[8px]" data-name="homeWinnerArrowIcon">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 204, 0, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 3">
                  <path d="M4 0L8 3H0L4 0Z" fill="var(--fill-0, #FFCC00)" id="homeWinnerArrowIcon" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function StatRow3() {
  return (
    <div className="absolute h-[36px] left-1/2 top-[312px] translate-x-[-50%] w-[385px]" data-name="statRow">
      <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Barlow_Semi_Condensed:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-right text-white w-[128px]">
          <p className="leading-[normal]">47</p>
        </div>
        <div className="flex flex-col font-['Barlow:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[13px] text-center tracking-[0.26px] w-[88px]">
          <p className="leading-none">Rebounds</p>
        </div>
        <div className="flex flex-col font-['Barlow_Semi_Condensed:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-white w-[128px]">
          <p className="leading-[normal]">41</p>
        </div>
        <div className="absolute flex h-[8px] items-center justify-center left-[148px] top-[14px] w-[3px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[3px] relative w-[8px]" data-name="homeWinnerArrowIcon">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 204, 0, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 3">
                  <path d="M4 0L8 3H0L4 0Z" fill="var(--fill-0, #FFCC00)" id="homeWinnerArrowIcon" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function StatRow4() {
  return (
    <div className="absolute h-[36px] left-1/2 top-[348px] translate-x-[-50%] w-[385px]" data-name="statRow">
      <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Barlow_Semi_Condensed:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-right text-white w-[128px]">
          <p className="leading-[normal]">29</p>
        </div>
        <div className="flex flex-col font-['Barlow:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[13px] text-center tracking-[0.26px] w-[88px]">
          <p className="leading-none">Assists</p>
        </div>
        <div className="flex flex-col font-['Barlow_Semi_Condensed:SemiBold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-white w-[128px]">
          <p className="leading-[normal]">27</p>
        </div>
        <div className="absolute flex h-[8px] items-center justify-center left-[148px] top-[14px] w-[3px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[3px] relative w-[8px]" data-name="homeWinnerArrowIcon">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 204, 0, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 3">
                  <path d="M4 0L8 3H0L4 0Z" fill="var(--fill-0, #FFCC00)" id="homeWinnerArrowIcon" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ScoreboardLogo() {
  return (
    <div className="bg-[#350071] h-[20px] relative rounded-[4px] shrink-0 w-[48px]" data-name="scoreboardLogo">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute left-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="tmLogo">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTmLogo} />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.6)]" />
    </div>
  );
}

function TeamAbbrev() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap" data-name="teamAbbrev">
      <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase">LAL</p>
      <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">17-12</p>
    </div>
  );
}

function AwayTeam() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="awayTeam">
      <ScoreboardLogo />
      <TeamAbbrev />
    </div>
  );
}

function BetTotal() {
  return (
    <div className="content-stretch flex gap-[10px] h-[20px] items-center justify-end leading-none not-italic overflow-clip relative shrink-0 text-white" data-name="betTotal">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow_Semi_Condensed:Bold',sans-serif] relative shrink-0 text-[20px] text-right tracking-[0.4px] w-[48px]">89</p>
    </div>
  );
}

function Away() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="away">
      <AwayTeam />
      <BetTotal />
    </div>
  );
}

function ScoreboardLogo1() {
  return (
    <div className="bg-[#1d1160] h-[20px] relative rounded-[4px] shrink-0 w-[48px]" data-name="scoreboardLogo">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute left-1/2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="tmLogo">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTmLogo1} />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.6)]" />
    </div>
  );
}

function TeamAbbrev1() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap" data-name="teamAbbrev">
      <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase">PHX</p>
      <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">19-14</p>
    </div>
  );
}

function HomeTeam() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="homeTeam">
      <ScoreboardLogo1 />
      <TeamAbbrev1 />
    </div>
  );
}

function BetSpread() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow h-[20px] items-center justify-end leading-none min-h-px min-w-px not-italic overflow-clip relative shrink-0 text-white" data-name="betSpread">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[14px] tracking-[0.28px] uppercase w-[24px]">30</p>
      <p className="font-['Barlow_Semi_Condensed:Bold',sans-serif] relative shrink-0 text-[20px] text-right tracking-[0.4px] w-[48px]">100</p>
    </div>
  );
}

function Home() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="home">
      <HomeTeam />
      <BetSpread />
    </div>
  );
}

function Boxscore() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 overflow-clip px-[8px] py-0 shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)] top-[68px] w-[385px]" data-name="boxscore">
      <Away />
      <Home />
    </div>
  );
}

function Hero() {
  return (
    <div className="absolute bg-white h-[128px] left-0 overflow-clip top-[32px] w-[385px]" data-name="hero">
      <div className="absolute flex h-[128px] items-center justify-center right-0 top-0 w-[232.5px]">
        <div className="flex-none rotate-[180deg]">
          <div className="h-[128px] relative w-[232.5px]" data-name="homeTmBackground">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232.5 128">
              <g id="homeTmBackground">
                <path d="M0 0H232.5L152.5 128H0V0Z" fill="var(--fill-0, #1D1160)" />
                <path d="M0 0H232.5L152.5 128H0V0Z" fill="url(#paint0_linear_30_367)" />
              </g>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_30_367" x1="116.25" x2="116.25" y1="128" y2="0">
                  <stop offset="0.5" stopOpacity="0" />
                  <stop offset="1" stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute right-[24px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] size-[128px] top-1/2 translate-y-[-50%]" data-name="homeTmLogo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTmLogo1} />
      </div>
      <div className="absolute h-[128px] left-0 top-0 w-[232.5px]" data-name="awayTmBackground">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232.5 128">
          <g id="awayTmBackground">
            <path d="M0 0H232.5L152.5 128H0V0Z" fill="var(--fill-0, #49256C)" />
            <path d="M0 0H232.5L152.5 128H0V0Z" fill="url(#paint0_linear_30_363)" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_30_363" x1="116.25" x2="116.25" y1="0" y2="128">
              <stop offset="0.5" stopOpacity="0" />
              <stop offset="1" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[calc(50%-104.5px)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] size-[128px] top-0 translate-x-[-50%]" data-name="awayTmLogo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgAwayTmLogo} />
      </div>
      <div className="absolute backdrop-blur-[2px] backdrop-filter bg-gradient-to-t bottom-0 from-[#0a0a0a] h-[128px] left-0 to-[rgba(10,10,10,0.5)] w-[385px]" data-name="gradient" />
      <Boxscore />
      <div className="absolute bottom-[72px] flex flex-col font-['Barlow:SemiBold',sans-serif] justify-end leading-[1.2] left-[8px] not-italic text-[9px] text-nowrap text-white tracking-[0.36px] uppercase">
        <p className="mb-0">Dec 31, 2025</p>
        <p className="mb-0">Phoenix, AZ</p>
        <p>Mortgage Matchup Arena</p>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_8px_24px_0px_rgba(255,255,255,0.2)]" />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-between left-0 px-[8px] py-[12px] top-0 w-[385px]" data-name="header">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgHeader} />
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Barlow:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-nowrap text-white tracking-[0.22px] uppercase">
        <span>{` F `}</span>
        <span className="font-['Barlow:Regular',sans-serif] text-[#8e8e93]">|</span>
        <span>{` Lakers at Suns`}</span>
      </p>
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#c7c7cc] text-[11px] text-nowrap text-right tracking-[0.22px]">
        LAL Covered +5.5<span className="text-[#8e8e93]"> </span>Over 215.5
      </p>
    </div>
  );
}

export default function Modal() {
  return (
    <div className="relative rounded-[12px] size-full" data-name="Modal">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
        <div className="absolute bg-black inset-0 rounded-[12px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-50 rounded-[12px]" style={{ backgroundImage: `url('${imgModal}')` }} />
      </div>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <StatPicker />
        <StatRow />
        <StatRow1 />
        <StatRow2 />
        <StatRow3 />
        <StatRow4 />
        <Hero />
        <Header />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border border-[#202020] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}