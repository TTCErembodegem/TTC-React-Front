import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { IndividualMatches } from '../IndividualMatches';
import MatchModel from '../../../../models/MatchModel';
import { IFullStoreMatchOwn, IMatch } from '../../../../models/model-interfaces';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getPlayer: vi.fn(),
    getTeam: vi.fn().mockReturnValue({
      id: 493,
      teamCode: 'A',
      competition: 'Sporta',
      frenoy: { getWeekUrl: (week: number) => `https://ttonline.sporta.be/?week_name=0${week}` },
    }),
    getClub: vi.fn().mockReturnValue({ id: 2, name: 'Other', codeVttl: '', codeSporta: '' }),
  },
}));

const match = new MatchModel({
  id: 1,
  competition: 'Sporta',
  teamId: 493,
  week: 5,
  frenoyMatchId: 'O05/012',
  isHomeMatch: true,
  opponent: { clubId: 2, teamCode: 'B' },
  comments: [],
  players: [],
  games: [],
} as unknown as IFullStoreMatchOwn) as unknown as IMatch;

describe('IndividualMatches without games', () => {
  it('shows the Frenoy link to the match', () => {
    renderWithProviders(
      <TestRouter>
        <IndividualMatches match={match} ownPlayerId={0} />
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: 'O05/012' })).toHaveAttribute('href', 'https://ttonline.sporta.be/?week_name=05');
  });
});
