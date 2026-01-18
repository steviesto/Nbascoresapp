import imgTmLogo from "figma:asset/15344a20d2bedfedf5bcdeabfa142fa47b8f41e0.png";
import imgTmLogo1 from "figma:asset/e4fa94bd1efdbcfe664bb45fc3bd4b14b3e4bb2f.png";
import imgGameCardHeader from "figma:asset/b12d49c9af3b8de76f72658b8d2e5a2d1930bc2e.png";
import imgGameCardPre from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";

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
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] items-end leading-none not-italic relative shrink-0 text-nowrap" data-name="teamAbbrev">
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
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] items-end leading-none not-italic relative shrink-0 text-nowrap" data-name="teamAbbrev">
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

function Matchup() {
  return (
    <div className="absolute left-0 top-[40px] w-[221px]" data-name="matchup">
      <div className="content-center flex flex-wrap gap-[4px] items-center justify-between overflow-clip px-[8px] py-0 relative rounded-[inherit] w-full">
        <AwayTeam />
        <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-white tracking-[0.22px] w-[48px]">224.5</p>
        <HomeTeam />
        <p className="font-['Barlow:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[11px] text-right text-white tracking-[0.22px] w-[48px]">-6.5</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function AwayPpg() {
  return (
    <div className="content-stretch flex gap-[2px] items-end leading-none not-italic relative shrink-0 text-nowrap" data-name="awayPPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function AwayOppg() {
  return (
    <div className="content-stretch flex gap-[2px] items-end leading-none not-italic relative shrink-0 text-nowrap" data-name="awayOPPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function HomePpg() {
  return (
    <div className="content-stretch flex gap-[2px] items-end leading-none not-italic relative shrink-0 text-nowrap" data-name="homePPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function HomeOppg() {
  return (
    <div className="content-stretch flex gap-[2px] items-end leading-none not-italic relative shrink-0 text-nowrap" data-name="homeOPPG">
      <p className="font-['Barlow:SemiBold',sans-serif] relative shrink-0 text-[13px] text-white tracking-[0.26px]">117.2</p>
      <p className="font-['Barlow:Medium',sans-serif] relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">13th</p>
    </div>
  );
}

function TeamStats() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[15px_16px] items-start left-[225px] overflow-clip px-[8px] py-[5px] top-[40px] w-[132px]" data-name="teamStats">
      <AwayPpg />
      <AwayOppg />
      <HomePpg />
      <HomeOppg />
    </div>
  );
}

function TeamStatsHeaderDiv() {
  return (
    <div className="absolute content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[45px] items-center leading-none left-[221px] not-italic overflow-clip px-[12px] py-[8px] text-[#8e8e93] text-[11px] text-nowrap top-[4px] tracking-[0.44px]" data-name="teamStatsHeader-div">
      <p className="relative shrink-0">PPG</p>
      <p className="relative shrink-0">oPPG</p>
    </div>
  );
}

function TimeNetworkDiv() {
  return (
    <div className="absolute left-0 top-[4px] w-[221px]" data-name="timeNetwork-div">
      <div className="content-stretch flex font-['Barlow:Bold',sans-serif] items-center justify-between leading-none not-italic overflow-clip p-[8px] relative rounded-[inherit] text-[11px] text-nowrap text-white tracking-[0.22px] w-full">
        <p className="relative shrink-0">7:30 PM</p>
        <p className="relative shrink-0 text-right">NBA LP</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function GameCardHeader() {
  return (
    <div className="absolute h-[30px] left-0 top-0 w-[377px]" data-name="gameCardHeader">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgGameCardHeader} />
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <TeamStatsHeaderDiv />
        <TimeNetworkDiv />
      </div>
      <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function GameCardPre() {
  return (
    <div className="relative rounded-[8px] size-full" data-name="gameCard-pre">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-black inset-0 rounded-[8px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-50 rounded-[8px]" style={{ backgroundImage: `url('${imgGameCardPre}')` }} />
      </div>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Matchup />
        <TeamStats />
        <GameCardHeader />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}