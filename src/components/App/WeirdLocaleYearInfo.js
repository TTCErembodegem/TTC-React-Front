import React from 'react';

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
    {params.trainingDays}
    <br />
    {params.competitionDays}
    <br />
  </div>
);
