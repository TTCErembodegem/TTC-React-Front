import React from 'react';
import Paper from 'material-ui/Paper';

const eetfesijnStyle = {
  padding: 0,
  width: '100%',
  margin: 'auto',
};

const eetfestijnGoogleMaps = "https://maps.google.com/maps?q=Botermelkstraat+63,+9300+Aalst&hl=en&ll=50.953115,4.061058&spn=0.009449,0.023475&sll=50.952442,4.062345&sspn=0.001188,0.002934&t=m&hnear=Botermelkstraat+63,+Aalst+9300+Aalst,+Oost-Vlaanderen,+Vlaams+Gewest,+Belgium&z=16";

const eetfestijnSets = {
  date: 'Zaterdag 23 september 2017',
  startHour: '18u00',
  endHour: '22u00',
  meat: {
    price: 17,
  },
  fish: {
    price: 17,
  },
  child: {
    price: '8,50'
  },
  support: {
    price: "2,50"
  }
};

export const Eetfestijn = () => {
  return (
    <Paper style={eetfesijnStyle}>
      <div id="eetfestijn">
        <h1 style={{fontSize: 26}}>
        Eetfestijn TTC Erembodegem
        <br />
        {eetfestijnSets.date}
        </h1>

        Van {eetfestijnSets.startHour} tot {eetfestijnSets.endHour} in zaal <a className="eetfestijn" href={eetfestijnGoogleMaps} target="_blank">Sint-Paulus</a>
        <br />
        Botermelkstraat 63, 9300 Aalst

        <br /><br />

        <table width="100%">
          <tbody>
            <tr><th colSpan={2} style={{textAlign: 'center'}}><font size="+1">Menu</font></th></tr>
            <tr>
              <td width="99%"><b>Varkenshaasje</b> met sla, tomaten<br /> en saus naar keuze</td><td width="1%">&euro;{eetfestijnSets.meat.price}</td>
            </tr>
            <tr>
              <td><b>Kabeljauw</b> met normandische saus</td><td>&euro;{eetfestijnSets.fish.price}</td>
            </tr>
            <tr>
              <td><b>Kindermenu</b>: kip met appelmoes</td><td><font size="-1">&euro;{eetfestijnSets.child.price}</font></td>
            </tr>
          </tbody>
        </table>

        <br />
        <span>Steunkaarten ook beschikbaar voor &euro;{eetfestijnSets.support.price}</span>
      </div>
    </Paper>
  )
}
