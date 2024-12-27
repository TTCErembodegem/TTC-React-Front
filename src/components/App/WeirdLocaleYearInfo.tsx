import React from 'react';
import { t } from '../../locales';

export const WeirdLocaleYearInfo = ({params}: any) => ( // eslint-disable-line
  <div>
    <h2>
      WIJZIGING NAAM
    </h2>
    <b>Opgelet: TTC Erembodegem heet vanaf heden TTC Aalst</b>

    <br />

    <h3>Sportzaal Technigo</h3>
    <b>{params.location}</b>
    <br />
    <br />{t('clubs.training.trainingDays2')}
    <br />{t('clubs.training.trainingDays3')}
    <br />
    Jeugdwerking vanaf 8 jaar
    <br />
    {params.competitionDays}
    <br />
  </div>
);
