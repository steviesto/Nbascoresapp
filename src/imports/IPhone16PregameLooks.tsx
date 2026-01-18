import svgPaths from "./svg-8zwks7qa0c";
import imgScoreboard from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";
import imgRectangle1 from "figma:asset/a6b0cfce687180106b7ccddd668771d80038d0ba.png";
import imgRectangle2 from "figma:asset/673ff3a788b84b73c6bdb418da0d46dc88ba3034.png";
import imgTmLogo from "figma:asset/e4fa94bd1efdbcfe664bb45fc3bd4b14b3e4bb2f.png";
import imgTmLogo1 from "figma:asset/15344a20d2bedfedf5bcdeabfa142fa47b8f41e0.png";
import imgRectangle3 from "figma:asset/71b1baf91d004b451965208a3435814ae457f40a.png";

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
    <div className="absolute content-stretch flex items-center left-[16px] top-[74px]" data-name="Team Selector">
      <p className="font-['Barlow:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[28px] text-nowrap text-white">NBA</p>
      <ChevronDown />
    </div>
  );
}

function Time() {
  return (
    <div className="basis-0 content-stretch flex grow h-[22px] items-center justify-center min-h-px min-w-px pb-0 pt-[1.5px] px-0 relative shrink-0" data-name="Time">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.328 13">
        <g id="Frame">
          <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, white)" width="24" x="0.5" y="0.5" />
          <path d={svgPaths.p7a14d80} fill="var(--fill-0, white)" id="Cap" opacity="0.4" />
          <rect fill="var(--fill-0, white)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="basis-0 grow h-[22px] min-h-px min-w-px relative shrink-0" data-name="Levels">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[7px] items-center justify-center pb-0 pl-0 pr-px pt-px relative size-full">
          <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
            <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
                <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, white)" fillRule="evenodd" id="Cellular Connection" />
              </svg>
            </div>
          </div>
          <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
            <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
                <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
              </svg>
            </div>
          </div>
          <Frame />
        </div>
      </div>
    </div>
  );
}

function StatusBarIPhone() {
  return (
    <div className="absolute content-stretch flex gap-[154px] items-center justify-center left-1/2 pb-[19px] pt-[21px] px-[24px] top-0 translate-x-[-50%] w-[393px]" data-name="Status bar - iPhone">
      <Time />
      <Levels />
    </div>
  );
}

function Calendar() {
  return (
    <div className="absolute left-[calc(50%+176.5px)] size-[16px] top-[calc(50%-342px)] translate-x-[-50%] translate-y-[-50%]" data-name="Calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Calendar">
          <path d={svgPaths.p3a9103f0} id="Icon" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Scoreboard() {
  return (
    <div className="absolute h-[28px] left-[calc(50%+1.5px)] rounded-[8px] top-[calc(50%-342px)] translate-x-[-50%] translate-y-[-50%] w-[56px]" data-name="scoreboard">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-[#0048ff] inset-0 rounded-[8px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-40 rounded-[8px]" style={{ backgroundImage: `url('${imgScoreboard}')` }} />
      </div>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute flex h-[48px] items-center justify-center left-0 top-[-12px] w-[28px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[28px] pointer-events-none relative w-[48px]">
              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover size-full" src={imgRectangle1} />
              <div aria-hidden="true" className="absolute border-[#285bd9] border-[0px_0px_1px] border-solid inset-0" />
            </div>
          </div>
        </div>
        <p className="absolute font-['Barlow_Semi_Condensed:Bold',sans-serif] leading-none left-[42px] not-italic text-[20px] text-center text-white top-[7px] translate-x-[-50%] w-[24px]">29</p>
        <p className="absolute font-['Barlow:Bold',sans-serif] leading-none left-[14px] not-italic text-[9px] text-center text-white top-[15px] tracking-[0.36px] translate-x-[-50%] uppercase w-[24px]">dec</p>
        <p className="absolute font-['Barlow:Bold',sans-serif] leading-none left-[14px] not-italic text-[8px] text-center text-white top-[7px] tracking-[0.32px] translate-x-[-50%] uppercase w-[24px]">mon</p>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#2f55b2] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_8px_0px_#020a1e]" />
    </div>
  );
}

function Scoreboard1() {
  return (
    <div className="absolute h-[28px] left-[calc(50%+65.5px)] rounded-[4px] top-[calc(50%-342px)] translate-x-[-50%] translate-y-[-50%] w-[56px]" data-name="scoreboard">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[4px]">
        <div className="absolute bg-black inset-0 rounded-[4px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-50 rounded-[4px]" style={{ backgroundImage: `url('${imgScoreboard}')` }} />
      </div>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute flex h-[48px] items-center justify-center left-0 top-[-12px] w-[28px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[28px] pointer-events-none relative w-[48px]">
              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover size-full" src={imgRectangle2} />
              <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0" />
            </div>
          </div>
        </div>
        <p className="absolute font-['Barlow_Semi_Condensed:Bold',sans-serif] leading-none left-[42px] not-italic text-[20px] text-center text-white top-[7px] translate-x-[-50%] w-[24px]">30</p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[14px] not-italic text-[#8e8e93] text-[9px] text-center top-[15px] tracking-[0.36px] translate-x-[-50%] uppercase w-[24px]">dec</p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[14px] not-italic text-[#8e8e93] text-[8px] text-center top-[6px] tracking-[0.32px] translate-x-[-50%] uppercase w-[24px]">tue</p>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Scoreboard2() {
  return (
    <div className="absolute h-[28px] left-[calc(50%+129.5px)] rounded-[4px] top-[calc(50%-342px)] translate-x-[-50%] translate-y-[-50%] w-[56px]" data-name="scoreboard">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[4px]">
        <div className="absolute bg-black inset-0 rounded-[4px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-50 rounded-[4px]" style={{ backgroundImage: `url('${imgScoreboard}')` }} />
      </div>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute flex h-[48px] items-center justify-center left-0 top-[-12px] w-[28px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="h-[28px] pointer-events-none relative w-[48px]">
              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover size-full" src={imgRectangle2} />
              <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0" />
            </div>
          </div>
        </div>
        <p className="absolute font-['Barlow_Semi_Condensed:Bold',sans-serif] leading-none left-[42px] not-italic text-[20px] text-center text-white top-[7px] translate-x-[-50%] w-[24px]">31</p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[14px] not-italic text-[#8e8e93] text-[9px] text-center top-[15px] tracking-[0.36px] translate-x-[-50%] uppercase w-[24px]">dec</p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[14px] not-italic text-[#8e8e93] text-[8px] text-center top-[6px] tracking-[0.32px] translate-x-[-50%] uppercase w-[24px]">wed</p>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function ScoreboardLogoNbaPhx() {
  return (
    <div className="bg-[#1d1160] h-[20px] relative rounded-[4px] shrink-0 w-[48px]" data-name="scoreboardLogo/NBA/PHX">
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

function Frame1() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] items-end leading-none not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase">PHX</p>
      <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">19-14</p>
    </div>
  );
}

function HomeTeam() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[8px] top-[64px]" data-name="homeTeam">
      <ScoreboardLogoNbaPhx />
      <Frame1 />
    </div>
  );
}

function ScoreboardLogoNbaLal() {
  return (
    <div className="bg-[#350071] h-[20px] relative rounded-[4px] shrink-0 w-[48px]" data-name="scoreboardLogo/NBA/LAL">
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

function Frame2() {
  return (
    <div className="content-stretch flex font-['Barlow:SemiBold',sans-serif] gap-[4px] items-end leading-none not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[14px] text-white tracking-[0.28px] uppercase">LAL</p>
      <p className="relative shrink-0 text-[#8e8e93] text-[11px] tracking-[0.22px]">17-12</p>
    </div>
  );
}

function AwayTeam() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[8px] top-[40px]" data-name="awayTeam">
      <ScoreboardLogoNbaLal />
      <Frame2 />
    </div>
  );
}

function Scoreboard3() {
  return (
    <div className="absolute h-[96px] left-1/2 rounded-[8px] top-[122px] translate-x-[-50%] w-[377px]" data-name="scoreboard">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-black inset-0 rounded-[8px]" />
        <div className="absolute bg-repeat bg-size-[30.719999313354492px_30.719999313354492px] bg-top-left inset-0 opacity-50 rounded-[8px]" style={{ backgroundImage: `url('${imgScoreboard}')` }} />
      </div>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[209px] not-italic text-[11px] text-nowrap text-right text-white top-[71px] tracking-[0.22px] translate-x-[-100%]">-6.5</p>
        <HomeTeam />
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[209px] not-italic text-[11px] text-nowrap text-right text-white top-[47px] tracking-[0.22px] translate-x-[-100%]">224.5</p>
        <AwayTeam />
        <div className="absolute flex h-[40px] items-center justify-center left-[221px] top-[43px] w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[40px]">
              <div className="absolute inset-[-1px_0_0_-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 1">
                  <g filter="url(#filter0_d_1_155)" id="Line 1">
                    <line stroke="var(--stroke-0, #212121)" strokeLinecap="round" x1="1.5" x2="40.5" y1="0.5" y2="0.5" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1" id="filter0_d_1_155" width="41" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dx="-1" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_155" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_155" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[233px] not-italic text-[#d1d1d6] text-[0px] text-nowrap top-[46px] tracking-[0.26px]">
          <span className="text-[13px] text-white">117.2</span>
          <span className="text-[13px]"> </span>
          <span className="font-['Barlow:Medium',sans-serif] text-[#8e8e93] text-[11px]">13th</span>
        </p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[299px] not-italic text-[0px] text-nowrap text-white top-[46px] tracking-[0.26px]">
          <span className="text-[13px]">{`116.9 `}</span>
          <span className="font-['Barlow:Medium',sans-serif] text-[#8e8e93] text-[11px]">17th</span>
        </p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[233px] not-italic text-[0px] text-nowrap text-white top-[70px] tracking-[0.26px] uppercase">
          <span className="text-[13px]">{`115.1 `}</span>
          <span className="font-['Barlow:Medium',sans-serif] text-[#8e8e93] text-[11px]">21st</span>
        </p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[299px] not-italic text-[0px] text-nowrap text-white top-[70px] tracking-[0.26px] uppercase">
          <span className="text-[13px]">{`113.3 `}</span>
          <span className="font-['Barlow:Medium',sans-serif] text-[#8e8e93] text-[11px]">7th</span>
        </p>
        <div className="absolute h-[32px] left-0 pointer-events-none top-0 w-[377px]">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover size-full" src={imgRectangle3} />
          <div aria-hidden="true" className="absolute border-[#181919] border-[0px_0px_1px] border-solid inset-0" />
        </div>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[233px] not-italic text-[#8e8e93] text-[11px] text-nowrap top-[12px] tracking-[0.44px]">PPG</p>
        <p className="absolute font-['Barlow:SemiBold',sans-serif] leading-none left-[299px] not-italic text-[#8e8e93] text-[11px] text-nowrap top-[12px] tracking-[0.44px]">oPPG</p>
        <p className="absolute font-['Barlow:Bold',sans-serif] leading-none left-[8px] not-italic text-[11px] text-nowrap text-white top-[12px] tracking-[0.22px]">7:00 PM EST</p>
        <p className="absolute font-['Barlow:Bold',sans-serif] leading-none left-[209px] not-italic text-[11px] text-nowrap text-right text-white top-[12px] tracking-[0.22px] translate-x-[-100%]">NBA LP</p>
        <div className="absolute flex h-[24px] items-center justify-center left-[221px] top-[4px] w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[24px]">
              <div className="absolute inset-[-1px_0_0_-4.17%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 1">
                  <g filter="url(#filter0_d_1_169)" id="Line 2">
                    <line stroke="var(--stroke-0, #212121)" strokeLinecap="round" x1="1.5" x2="24.5" y1="0.5" y2="0.5" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1" id="filter0_d_1_169" width="25" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dx="-1" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_169" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_169" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      <div aria-hidden="true" className="absolute border-[#202020] border-[1px_0px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

export default function IPhone16PregameLooks() {
  return (
    <div className="bg-[#141415] relative size-full" data-name="iPhone 16 - Pregame Looks">
      <TeamSelector />
      <StatusBarIPhone />
      <Calendar />
      <Scoreboard />
      <Scoreboard1 />
      <Scoreboard2 />
      <Scoreboard3 />
    </div>
  );
}