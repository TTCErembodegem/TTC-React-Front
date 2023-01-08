import React from 'react';
import t from '../../locales';

export const WeirdLocaleYearInfo = ({params}) => ( // eslint-disable-line
  <div>
    <h4>
      WIJZIGING NAAM
    </h4>
    <b>Opgelet: TTC Erembodegem heet vanaf heden TTC Aalst</b>

    <br />

    <h3>Sportzaal Technigo</h3>
    <b>{params.location}</b>
    <br />
    {params.competitionDays}
    <br />{params.trainingDays}
    <br />{t('clubs.training.trainingDays2')}
    <br />{t('clubs.training.trainingDays3')}
    <br />
    Jeugdwerking vanaf 8 jaar
  </div>
);
