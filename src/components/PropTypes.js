import { PropTypes as ReactPropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import MatchModel from '../models/MatchModel.js';
import TeamModel from '../models/TeamModel.js';
import ClubModel from '../models/ClubModel.js';
import UserModel from '../models/UserModel.js';
import PlayerModel from '../models/PlayerModel.js';
import { contextTypes } from '../utils/decorators/withContext.js';

export default Object.assign({}, ReactPropTypes, {
  contextTypes,

  MatchModel: ReactPropTypes.instanceOf(MatchModel),
  TeamModel: ReactPropTypes.instanceOf(TeamModel),
  ClubModel: ReactPropTypes.instanceOf(ClubModel),
  PlayerModel: ReactPropTypes.instanceOf(PlayerModel),
  UserModel: ReactPropTypes.instanceOf(UserModel),

  MatchModelList: ImmutablePropTypes.listOf(ReactPropTypes.instanceOf(MatchModel).isRequired),
  TeamModelList: ImmutablePropTypes.listOf(ReactPropTypes.instanceOf(TeamModel).isRequired),
  ClubModelList: ImmutablePropTypes.listOf(ReactPropTypes.instanceOf(ClubModel).isRequired),
  PlayerModelList: ImmutablePropTypes.listOf(ReactPropTypes.instanceOf(PlayerModel).isRequired),

  competition: ReactPropTypes.oneOf(['Vttl', 'Sporta']),

  viewport: ReactPropTypes.shape({
    width: ReactPropTypes.number.isRequired,
    height: ReactPropTypes.number.isRequired
  }).isRequired,

  map: ImmutablePropTypes.map,
});

export { util as storeUtil } from '../store.js';
export { connect } from 'react-redux';
export { browserHistory } from 'react-router';
export keyMirror from 'fbjs/lib/keyMirror';

export withViewport from '../utils/decorators/withViewport.js';
export withContext from '../utils/decorators/withContext.js';
export withStyles from '../utils/decorators/withStyles.js';