import { useState, useEffect, useRef, useMemo } from 'react';
import BoxScoreModal from './BoxScoreModal';
import PregameModal from './PregameModal';

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
    fgPct?: string;
    threePA?: string;
    threePM?: string;
    ftA?: string;
    ftM?: string;
    turnovers?: string;
    statsLoading?: boolean;
    id?: string;
    streak?: string;
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
    fgPct?: string;
    threePA?: string;
    threePM?: string;
    ftA?: string;
    ftM?: string;
    turnovers?: string;
    statsLoading?: boolean;
    id?: string;
    streak?: string;
  };
  time: string;
  network: string;
  spread: string;
  total: string;
  status: 'pre' | 'in' | 'post';
  statusDetail?: string;
  period?: number;
  date?: string;
  clock?: string;
  quarter?: number;
  eventId?: string;
  boxScoreData?: any;
  arena?: string;
  city?: string;
  state?: string;
  broadcast?: string;
}

interface ScoresProps {
  hideScores: boolean;
  selectedDate: number;
  onDateChange: (index: number) => void;
  dates: Array<{ day: string; date: string; month: string; fullDate: string }>;
  selectedTeam: string | null;
  onTeamChange: (team: string | null) => void;
  availableTeams: string[];
  games: EnrichedGame[];
  loading: boolean;
  error: string | null;
  statsLoading: boolean;
  onGameClick: (game: EnrichedGame) => void;
  onPregameClick: (game: EnrichedGame) => void;
  PageHeader: any;
  GameCardFinal: any;
  GameCardLive: any;
  GameCardPre: any;
}

export function Scores({
  hideScores,
  selectedDate,
  onDateChange,
  dates,
  selectedTeam,
  onTeamChange,
  availableTeams,
  games,
  loading,
  error,
  statsLoading,
  onGameClick,
  onPregameClick,
  PageHeader,
  GameCardFinal,
  GameCardLive,
  GameCardPre,
}: ScoresProps) {
  const nextGameRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  // Filter and sort games
  const displayGames = useMemo(() => {
    let filtered = games;

    // Filter by selected team if applicable
    if (selectedTeam) {
      filtered = games.filter(game => 
        game.awayTeam.code === selectedTeam || game.homeTeam.code === selectedTeam
      );
    }

    // Sort games: live -> pre -> post
    return filtered.sort((a, b) => {
      const statusOrder = { in: 0, pre: 1, post: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [games, selectedTeam]);

  // Find next game index for team view
  const nextGameIndex = useMemo(() => {
    if (!selectedTeam) return -1;
    
    const now = new Date();
    const upcomingGames = displayGames.filter(game => {
      if (game.status === 'in') return true;
      if (game.status === 'post') return false;
      
      const gameDate = new Date(game.date || '');
      return gameDate >= now;
    });
    
    if (upcomingGames.length > 0) {
      return displayGames.indexOf(upcomingGames[0]);
    }
    
    return -1;
  }, [displayGames, selectedTeam]);

  // Auto-scroll to next game
  useEffect(() => {
    if (selectedTeam && nextGameIndex >= 0 && nextGameRef.current && !hasScrolledRef.current) {
      setTimeout(() => {
        nextGameRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
      hasScrolledRef.current = true;
    }
    
    if (!selectedTeam) {
      hasScrolledRef.current = false;
    }
  }, [selectedTeam, nextGameIndex]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-8 pb-5 flex-shrink-0">
        <PageHeader 
          selectedDate={selectedDate} 
          onDateChange={onDateChange} 
          dates={dates}
          selectedTeam={selectedTeam}
          onTeamChange={onTeamChange}
          availableTeams={availableTeams}
        />
      </div>

      {/* Game Cards */}
      <div className="scroll-container flex-1 overflow-y-auto px-4 pb-24">
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
                      <GameCardFinal game={game} selectedTeam={selectedTeam} onCardClick={onGameClick} hideScores={hideScores} />
                    ) : game.status === 'in' ? (
                      <GameCardLive game={game} selectedTeam={selectedTeam} onCardClick={onGameClick} hideScores={hideScores} />
                    ) : (
                      <GameCardPre game={game} selectedTeam={selectedTeam} onCardClick={onPregameClick} />
                    )}
                  </div>
                );
              }
              
              return game.status === 'post' ? (
                <GameCardFinal key={game.id} game={game} selectedTeam={selectedTeam} onCardClick={onGameClick} hideScores={hideScores} />
              ) : game.status === 'in' ? (
                <GameCardLive key={game.id} game={game} selectedTeam={selectedTeam} onCardClick={onGameClick} hideScores={hideScores} />
              ) : (
                <GameCardPre key={game.id} game={game} selectedTeam={selectedTeam} onCardClick={onPregameClick} />
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
    </div>
  );
}
