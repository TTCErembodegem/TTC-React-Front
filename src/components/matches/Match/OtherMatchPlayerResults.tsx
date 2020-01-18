import React, {Component} from 'react';
import PropTypes from '../../PropTypes';
import OpponentPlayer from './OpponentPlayer';
import {ReadonlyIndividualMatches} from './IndividualMatches';

export class OtherMatchPlayerResults extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
  }

  constructor() {
    super();
    this.state = {fullView: false};
  }

  render() {
    const {t} = this.context;
    const {match} = this.props;

    const SwitchButton = () => (
      <div className="row text-center">
        <button className="btn btn-default" style={{marginTop: 15}} onClick={() => this.setState({fullView: !this.state.fullView})}>
          {this.state.fullView ? t('match.report.viewDetails') : t('match.report.viewFull')}
        </button>
      </div>
    );

    if (this.state.fullView) {
      return (
        <div>
          <ReadonlyIndividualMatches match={match} />
          <SwitchButton />
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-sm-6">
          <h4 style={{marginTop: 5}}>{match.getClub('home').name} {match.home.teamCode}</h4>
          {match.getOwnPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} competition={match.competition} />)}
        </div>

        <div className="col-sm-6">
          <h4>{match.getClub('away').name} {match.away.teamCode}</h4>
          {match.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} competition={match.competition} />)}
        </div>
        <SwitchButton />
      </div>
    );
  }
}

export const OtherMatchPlayerResultsTableRow = ({match, show, colSpan = 5}) => {
  if (!show) {
    return null;
  }

  return (
    <tr key={`${match.id}_details`}>
      <td colSpan={colSpan}>
        <OtherMatchPlayerResults match={match} />
      </td>
    </tr>
  );
};


OtherMatchPlayerResultsTableRow.propTypes = {
  match: PropTypes.MatchModel.isRequired,
  show: PropTypes.bool,
  colSpan: PropTypes.number,
};
