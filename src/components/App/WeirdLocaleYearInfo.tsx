import React from 'react';

export const WeirdLocaleYearInfo = ({params}: any) => ( // eslint-disable-line
  <div>
    <h2>
      WIJZIGING ZAAL
    </h2>
    <b>Opgelet: TTC Erembodegem speelt niet meer op Groeneweg 28</b>

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
