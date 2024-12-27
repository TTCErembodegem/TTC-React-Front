import React, { useState } from 'react';
import OpponentPlayer from './OpponentPlayer';
import { ReadonlyIndividualMatches } from './IndividualMatches';
import { IMatch } from '../../../models/model-interfaces';
import { t } from '../../../locales';

export const OtherMatchPlayerResults = ({match}: {match: IMatch}) => {
  const [fullView, setFullView] = useState(false);

  if (!match) {
    return null;
  }

  const SwitchButton = (
    <div className="row text-center">
      <button type="button" className="btn btn-outline-secondary" style={{marginTop: 15}} onClick={() => setFullView(!fullView)}>
        {fullView ? t('match.report.viewDetails') : t('match.report.viewFull')}
      </button>
    </div>
  );

  if (fullView) {
    return (
      <div>
        <ReadonlyIndividualMatches match={match} />
        {SwitchButton}
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-sm-6">
        <h4 style={{marginTop: 5}}>{match.getClub('home')?.name} {match.home.teamCode}</h4>
        {match.getOwnPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} competition={match.competition} />)}
      </div>

      <div className="col-sm-6">
        <h4>{match.getClub('away')?.name} {match.away.teamCode}</h4>
        {match.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} competition={match.competition} />)}
      </div>
      {SwitchButton}
    </div>
  );
};

export const OtherMatchPlayerResultsTableRow = ({match, show, colSpan = 5}: OtherMatchPlayerResultsTableRowProps) => {
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


type OtherMatchPlayerResultsTableRowProps = {
  match: IMatch;
  show: boolean;
  colSpan?: number;
};
