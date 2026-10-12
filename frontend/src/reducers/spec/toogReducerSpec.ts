import { describe, it, expect } from 'vitest';
import toogReducer, { addToogDone, assignToog, fetchToogAssigned, fetchToogDone, removeToogDone } from '../toogReducer';
import { IToogAdminDay, IToogAssignment, IToogDone } from '../../models/model-interfaces';

const day1 = '2026-10-10T00:00:00';
const day2 = '2026-10-17T00:00:00';
const pastDay = '2026-09-26T00:00:00';

describe('toogReducer assigned', () => {
  it('stores the fetched assignments', () => {
    const assigned: IToogAssignment[] = [{ date: day1, playerId: 1 }];
    const state = toogReducer(undefined, { type: fetchToogAssigned.fulfilled.type, payload: assigned });
    expect(state.assigned).toEqual(assigned);
  });

  it('follows the board assigning someone', () => {
    const initial = {
      mine: [],
      admin: [],
      done: [],
      assigned: [
        { date: pastDay, playerId: 3 },
        { date: day1, playerId: 1 },
      ],
    };
    const admin: IToogAdminDay[] = [
      { date: day1, homeTeamIds: [], availablePlayerIds: [], assignedPlayerId: null },
      { date: day2, homeTeamIds: [], availablePlayerIds: [], assignedPlayerId: 2 },
    ];

    const state = toogReducer(initial, { type: assignToog.fulfilled.type, payload: admin });

    expect(state.assigned).toEqual([
      { date: pastDay, playerId: 3 },
      { date: day2, playerId: 2 },
    ]);
  });
});

describe('toogReducer done', () => {
  it('stores the fetched done list', () => {
    const done: IToogDone[] = [{ date: pastDay, playerId: 1, competitions: ['Vttl'] }];
    const state = toogReducer(undefined, { type: fetchToogDone.fulfilled.type, payload: done });
    expect(state.done).toEqual(done);
  });

  it('replaces the done list after adding or removing a day', () => {
    const done: IToogDone[] = [{ date: pastDay, playerId: 2, competitions: [] }];
    expect(toogReducer(undefined, { type: addToogDone.fulfilled.type, payload: done }).done).toEqual(done);
    expect(toogReducer({ mine: [], admin: [], assigned: [], done }, { type: removeToogDone.fulfilled.type, payload: [] }).done).toEqual([]);
  });
});
