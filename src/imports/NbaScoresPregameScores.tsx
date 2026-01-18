import imgGameCardHeader from "figma:asset/2807656b353c38974e5a742538684c5e7b2b3101.png";
import imgTmLogo from "figma:asset/15344a20d2bedfedf5bcdeabfa142fa47b8f41e0.png";
import imgTmLogo1 from "figma:asset/e4fa94bd1efdbcfe664bb45fc3bd4b14b3e4bb2f.png";
import imgGameCardPre from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Chevron down">
          <path d="M5 7.5L10 12.5L15 7.5" id="Icon" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TeamSelector() {
  return (
    <div className="content-stretch flex h-[36px] items-center relative shrink-0" data-name="Team Selector">
      <p className="font-['Barlow:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[28px] text-nowrap text-white">NBA</p>
      <ChevronDown />
    </div>
  );
}

function Date() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[4px] items-start leading-[normal] relative shrink-0 text-center w-[48px]" data-name="date">
      <p className="relative shrink-0 text-[#999] text-[7.901px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Mon Dec
      </p>
      <p className="relative shrink-0 text-[22px] text-white w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        29
      </p>
    </div>
  );
}

function Date1() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[4px] items-start leading-[normal] relative shrink-0 text-[#404040] text-center w-[48px]" data-name="date">
      <p className="relative shrink-0 text-[7.901px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tue Dec
      </p>
      <p className="relative shrink-0 text-[22px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        30
      </p>
    </div>
  );
}

function Date2() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[4px] items-start leading-[normal] relative shrink-0 text-[#404040] text-center w-[48px]" data-name="date">
      <p className="relative shrink-0 text-[7.901px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Wed Dec
      </p>
      <p className="relative shrink-0 text-[22px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        31
      </p>
    </div>
  );
}

function DatePicker() {
  return (
    <div className="content-stretch flex gap-[4px] h-[36px] items-center overflow-clip relative shrink-0" data-name="datePicker">
      <Date />
      <Date1 />
      <Date2 />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip pl-[16px] pr-[8px] py-0 relative shrink-0 w-[393px]" data-name="pageHeader">
      <TeamSelector />
      <DatePicker />
    </div>
  );
}

function TimeNetworkDiv() {
  return (
    <div className="relative shrink-0 w-[221px]" data-name="timeNetwork-div">
      <div className="content-stretch flex font-['Barlow:Bold',sans-serif] items-center justify-between leading-none not-italic overflow-clip p-[8px] relative rounded-[inherit] text-[11px] text-nowrap text-white tracking-[0.22px] w-full">
        <p className="relative shrink-0">7:30 PM</p>
        <p className="relative shrink-0 text-right">NBA LP</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function TeamStatsHeaderDiv() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[16px] items-center leading-none not-italic overflow-clip px-[12px] py-[8px] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.44px]" data-name="teamStatsHeader-div">
      <p className="relative shrink-0 w-[56px]">PPG</p>
      <p className="relative shrink-0 w-[56px]">oPPG</p>
    </div>
  );
}

function GameCardHeader() {
  return (
    <div className="relative shrink-0 w-[377px]" data-name="gameCardHeader">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgGameCardHeader} />
      <div className="content-stretch flex items-center justify-between overflow-clip px-0 py-[2px] relative rounded-[inherit] w-full">
        <TimeNetworkDiv />
        <TeamStatsHeaderDiv />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="awayTeam">
      <ScoreboardLogo />
      <TeamAbbrev />
    </div>
  );
}

function BetTotal() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-clip relative shrink-0" data-name="betTotal">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-white tracking-[0.22px] w-[48px]">224.5</p>
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="homeTeam">
      <ScoreboardLogo1 />
      <TeamAbbrev1 />
    </div>
  );
}

function BetSpread() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-end overflow-clip relative shrink-0" data-name="betSpread">
      <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-white tracking-[0.22px] w-[48px]">-6.5</p>
    </div>
  );
}

function Matchup() {
  return (
    <div className="relative shrink-0 w-[221px]" data-name="matchup">
      <div className="content-center flex flex-wrap gap-[4px] items-center justify-between overflow-clip px-[8px] py-0 relative rounded-[inherit] w-full">
        <AwayTeam />
        <BetTotal />
        <HomeTeam />
        <BetSpread />
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function AwayPpg() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap w-[56px]" data-name="awayPPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">30th</p>
    </div>
  );
}

function AwayOppg() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap w-[56px]" data-name="awayOPPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function HomePpg() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap w-[56px]" data-name="homePPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function HomeOppg() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center leading-none not-italic relative shrink-0 text-nowrap w-[56px]" data-name="homeOPPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function TeamStats() {
  return (
    <div className="content-center flex flex-wrap gap-[4px_16px] h-[44px] items-center overflow-clip px-[8px] py-[5px] relative shrink-0 w-[152px]" data-name="teamStats">
      <AwayPpg />
      <AwayOppg />
      <HomePpg />
      <HomeOppg />
    </div>
  );
}

function GameCardPre() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[377px]" data-name="gameCard-pre">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-black inset-0 rounded-[8px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-50 rounded-[8px]" style={{ backgroundImage: `url('${imgGameCardPre}')` }} />
      </div>
      <div className="content-end flex flex-wrap gap-[8px_4px] items-end overflow-clip pb-[16px] pt-0 px-0 relative rounded-[inherit] w-full">
        <GameCardHeader />
        <Matchup />
        <TeamStats />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

export default function NbaScoresPregameScores() {
  return (
    <div className="bg-[#141415] content-stretch flex flex-col gap-[16px] items-center px-0 py-[64px] relative size-full" data-name="NBA Scores Pregame Scores">
      <PageHeader />
      <GameCardPre />
    </div>
  );
}