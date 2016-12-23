import proxyquire from 'proxyquire';
import { List, Map } from 'immutable';

import { getPlayerStats } from '../TeamModel.js';
import MatchModel from '../MatchModel.js';

// const teamJson = {
//   id: 0,
//   competition: '',
//   opponents: [],
//   players: [],
//   ranking: [],
//   year: 2017,
//   frenoy: {}
// };

describe('TeamModel', () => {
  describe('getPlayerStats', () => {
    beforeEach(function() {
      this.matches = List([
        new MatchModel({
          isHomeMatch: true,
          opponent: {},
          comments: [],
          players: [{
            playerId: 1,
            name: 'ply1',
            uniqueIndex: 1
          }, {
            playerId: 2,
            name: 'ply2',
            uniqueIndex: 2
          }, {
            name: 'opp1',
            uniqueIndex: -1,
            ranking: 'E6'
          }, {
            name: 'opp2',
            uniqueIndex: -2,
            ranking: 'E2'
          }],
          games: [{
            homePlayerUniqueIndex: 1,
            outPlayerUniqueIndex: -1,
            outcome: 'Won'
          }, {
            homePlayerUniqueIndex: 1,
            outPlayerUniqueIndex: -1,
            outcome: 'Lost'
          }, {
            homePlayerUniqueIndex: 1,
            outPlayerUniqueIndex: -1,
            outcome: 'Lost'
          }, {
            homePlayerUniqueIndex: 2,
            outPlayerUniqueIndex: -1,
            outcome: 'Lost'
          }, {
            homePlayerUniqueIndex: 2,
            outPlayerUniqueIndex: -2,
            outcome: 'Won'
          }],
        })
      ]);
    });

    it('should calculate wins/losses against opponent rankings', function() {
      const result = getPlayerStats(this.matches);
      expect(result[0].won.E6).toBe(1);
      expect(result[0].lost.E6).toBe(2);

      expect(result[1].lost.E6).toBe(1);
      expect(result[1].won.E2).toBe(1);
    });

    it('should count player total games played', function() {
      const result = getPlayerStats(this.matches);
      expect(result[0].games).toBe(3);
      expect(result[1].games).toBe(2);
    });

    it('should count player victories', function() {
      const result = getPlayerStats(this.matches);
      expect(result[0].victories).toBe(1);
      expect(result[1].victories).toBe(1);
    });
  });
});
