import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { MobileLiveMatchInProgress } from '../MobileLiveMatchInProgress';
import { IMatch, ITeam } from '../../../../models/model-interfaces';
import { TeamFrenoyModel } from '../../../../models/TeamFrenoyModel';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn().mockReturnValue({ getCaptainPlayerIds: () => [] }),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

vi.mock('../../../../utils/httpClient', () => ({
  default: {
    get: vi.fn().mockResolvedValue([]),
    post: vi.fn().mockResolvedValue({}),
  },
}));

const createMockMatch = (competition: 'Sporta' | 'Vttl'): IMatch => {
  const frenoy = new TeamFrenoyModel({ divisionId: 1957, linkId: '1957_A', teamId: '' } as never, { year: 2026, competition } as ITeam);
  return {
    id: 1,
    competition,
    frenoyDivisionId: 1957,
    frenoyMatchId: 'OVLH01/001',
    week: 5,
    games: [],
    players: [],
    comments: [],
    block: 'Major',
    isHomeMatch: true,
    description: '',
    opponent: { clubId: 10, teamCode: 'A' },
    teamId: 1,
    date: { isBefore: () => true, subtract: () => ({ isBefore: () => true }), format: () => '19:00', isSame: () => true },
    getTeam: () => ({
      competition,
      frenoy,
      renderOwnTeamTitle: () => 'TTC Aalst A',
      getDivisionRanking: () => ({ empty: true }),
      getThriller: () => null,
    }),
    renderOpponentTitle: () => 'Opponent A',
    getOwnPlayers: () => [],
    getTheirPlayers: () => [{ position: 1, name: 'Player 1', ranking: 'C6', uniqueIndex: 100, won: 0, home: false, status: 'Major', alias: 'P1' }],
    getOpponentClub: () => ({ id: 10, name: 'Test Club', codeVttl: 'OB001', codeSporta: '', mainLocation: null }),
    isSyncedWithFrenoy: false,
    isStandardStartTime: () => true,
    getTeamPlayerCount: () => 4,
  } as unknown as IMatch;
};

const renderInProgress = (match: IMatch, playerId = 1) =>
  renderWithProviders(
    <TestRouter>
      <MobileLiveMatchInProgress match={match} />
    </TestRouter>,
    { preloadedState: { user: { playerId, teams: [1], security: [] }, readonlyMatches: [] } },
  );

describe('Sporta encode link', () => {
  it('links to the Sporta week page of the division for Sporta matches', () => {
    renderInProgress(createMockMatch('Sporta'));

    expect(screen.getByRole('button', { name: 'sporta' })).toHaveAttribute('href', 'https://ttonline.sporta.be/index.php?menu=4&week_name=05&div_id=1957_A');
  });

  it('is not shown for Vttl matches', () => {
    renderInProgress(createMockMatch('Vttl'));

    expect(screen.queryByRole('button', { name: 'sporta' })).not.toBeInTheDocument();
  });

  it('is not shown for anonymous users', () => {
    renderInProgress(createMockMatch('Sporta'), 0);

    expect(screen.queryByRole('button', { name: 'sporta' })).not.toBeInTheDocument();
  });
});
