import ReactPropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import MatchModel from '../models/MatchModel.js';
import TeamModel from '../models/TeamModel.js';
import ClubModel from '../models/ClubModel.js';
import UserModel from '../models/UserModel.js';
import PlayerModel from '../models/PlayerModel.js';
import {contextTypes} from '../utils/decorators/withContext.js';

export {default as storeUtil} from '../storeUtil.js';
export {connect} from 'react-redux';
export {browseTo} from '../routes.js';
export {default as keyMirror} from 'fbjs/lib/keyMirror';

export {default as withViewport} from '../utils/decorators/withViewport.js'; // eslint-disable-line
export {default as withContext} from '../utils/decorators/withContext.js'; // eslint-disable-line
export {default as withStyles} from '../utils/decorators/withStyles.js'; // eslint-disable-line
export {withTooltip} from '../utils/decorators/withTooltip.js';
export {withTracker} from '../utils/decorators/withTracker.js';
export {withRouter} from 'react-router-dom';


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
