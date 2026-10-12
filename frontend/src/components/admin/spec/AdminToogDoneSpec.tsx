import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { AdminToogDone } from '../AdminToogDone';
import http from '../../../utils/httpClient';
import { IToogDone } from '../../../models/model-interfaces';

// storeUtil pulls in the real store, which cycles back through matchesReducer
vi.mock('../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn(),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]), getTeamMatches: vi.fn().mockReturnValue([]) },
  },
}));

const preloadedState = {
  players: [
    { id: 1, alias: 'Wouter', firstName: 'Wouter', lastName: 'Van Schandevijl' },
    { id: 2, alias: 'Jorn', firstName: 'Jorn', lastName: 'Theunissen' },
  ],
};

const done: IToogDone[] = [
  { date: '2026-09-12T00:00:00', playerId: 2, competitions: ['Sporta'] },
  { date: '2026-09-19T00:00:00', playerId: 1, competitions: ['Vttl'] },
  { date: '2026-09-26T00:00:00', playerId: 1, competitions: ['Vttl', 'Sporta'] },
];

const renderDone = (rows: IToogDone[]) => {
  vi.spyOn(http, 'get').mockResolvedValue(rows);
  return renderWithProviders(<AdminToogDone />, { preloadedState });
};

describe('AdminToogDone', () => {
  afterEach(() => vi.restoreAllMocks());

  it('fetches the done list', async () => {
    renderDone(done);
    await screen.findByText('Wouter Van Schandevijl');
    expect(http.get).toHaveBeenCalledWith('/toog/done');
  });

  it('lists each player once with their count, most first', async () => {
    renderDone(done);
    await screen.findByText('Wouter Van Schandevijl');

    const [, first, second] = screen.getAllByRole('row');
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(within(first!).getByText('Wouter Van Schandevijl')).toBeInTheDocument();
    expect(within(first!).getByText('2')).toBeInTheDocument();
    expect(within(second!).getByText('Jorn Theunissen')).toBeInTheDocument();
    expect(within(second!).getByText('1')).toBeInTheDocument();
  });

  it('expands a row with the days and competitions', async () => {
    renderDone(done);

    fireEvent.click(await screen.findByText('Wouter Van Schandevijl'));

    expect(screen.getByText('za 19/09/2026')).toBeInTheDocument();
    expect(screen.getByText('za 26/09/2026')).toBeInTheDocument();
    expect(screen.getByText('Vttl, Sporta')).toBeInTheDocument();
    expect(screen.queryByText('za 12/09/2026')).not.toBeInTheDocument();
  });

  it('collapses the row on a second click', async () => {
    renderDone(done);

    fireEvent.click(await screen.findByText('Wouter Van Schandevijl'));
    fireEvent.click(screen.getByText('Wouter Van Schandevijl'));

    expect(screen.queryByText('za 19/09/2026')).not.toBeInTheDocument();
  });

  it('says nobody did the toog yet', async () => {
    renderDone([]);
    expect(await screen.findByText('Nog niemand stond dit seizoen aan de toog')).toBeInTheDocument();
  });
});
