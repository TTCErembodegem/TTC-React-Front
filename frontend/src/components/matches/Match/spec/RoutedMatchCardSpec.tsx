import { vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { RoutedMatchCard } from '../RoutedMatchCard';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn(),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

describe('RoutedMatchCard', () => {
  it('scrolls to the top of the page when opened', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    renderWithProviders(
      <TestRouter initialEntries={['/match/1']}>
        <Routes>
          <Route path="/match/:matchId" element={<RoutedMatchCard />} />
        </Routes>
      </TestRouter>,
    );

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });
});
