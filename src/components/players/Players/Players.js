import React, { PropTypes, Component } from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Icon from '../../controls/Icon.js';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import PlayerModel from '../../../models/PlayerModel.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    //clubs: state.clubs,
    //matches: state.matches,
    //teams: state.teams,
  };
})
@withStyles(styles)
export default class Players extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object,
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
  };

  render() {
    // TODO: abstract this away in PlayerModel
    var baseUrlVTTLPartOne = 'http://competitie.vttl.be/index.php?menu=6&sel=';
    var baseUrlVTTLPartTwo = '&result=1';
    var baseUrlSportaPartOne = 'http://tafeltennis.sporcrea.be/competitie/index.php?menu=6&sel=';
    var baseUrlSportaPartTwo = '&result=1';
    var playersVTTL = this.props.players.filter(x => x.vttl).sort((a, b) => a.vttl.position - b.vttl.position);
    var playersSporta = this.props.players.filter(x => x.sporta).sort((a, b) => a.sporta.position - b.sporta.position);
    var playersVTTLAndSporta = this.props.players.filter(x => x.sporta && x.vttl).sort((a,b) => a.sporta.position - b.sporta.position);
    return (
      <Tabs style={{marginTop: 10}}>
        <Tab label={this.context.t('players.vttl')} >
         <div>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>{this.context.t('players.index')}</th>
                <th>{this.context.t('players.vttlMemberNumber')}</th>
                <th>{this.context.t('players.name')}</th>
                <th>{this.context.t('players.ranking')}</th>
                <th>{this.context.t('players.style')}</th>
                <th>{this.context.t('players.bestStroke')}</th>
              </tr>
            </thead>
            <tbody>
              {playersVTTL.map(ply => (<tr key={ply.id}>
                <td>{ply.vttl.rankingIndex}</td>
                <td>{ply.vttl.uniqueIndex}</td>
                <td>{ply.name}</td>
                <td>
                  {ply.vttl.ranking}&nbsp;
                  <a href={baseUrlVTTLPartOne + ply.vttl.frenoyLink + baseUrlVTTLPartTwo} target="_blank">
                  <Icon fa="fa fa-search" /></a>
                </td>
                <td>{ply.style.name}</td>
                <td>{ply.style.bestStroke}</td></tr>))}
            </tbody>
          </table>
          </div>
        </Tab>
        <Tab label={this.context.t('players.sporta')} >
          <div>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>{this.context.t('players.index')}</th>
                  <th>{this.context.t('players.vttlMemberNumber')}</th>
                  <th>{this.context.t('players.name')}</th>
                  <th>{this.context.t('players.ranking')}</th>
                  <th>{this.context.t('players.value')}</th>
                  <th>{this.context.t('players.style')}</th>
                  <th>{this.context.t('players.bestStroke')}</th>
                </tr>
              </thead>
              <tbody>
                {playersSporta.map(ply => (<tr key={ply.id}>
                  <td>{ply.sporta.rankingIndex}</td>
                  <td>{ply.sporta.uniqueIndex}</td>
                  <td>{ply.name}</td>
                  <td>
                  {ply.sporta.ranking}&nbsp;
                  <a href={baseUrlSportaPartOne + ply.sporta.frenoyLink + baseUrlSportaPartTwo} target="_blank">
                  <Icon fa="fa fa-search" /></a>
                  </td>
                  <td>{ply.sporta.rankingValue}</td>
                  <td>{ply.style.name}</td>
                  <td>{ply.style.bestStroke}</td></tr>))}
              </tbody>
            </table>
          </div>
        </Tab>
        <Tab label={this.context.t('players.alle')}>
          <Accordion style={{marginTop: 10}}>
            <Panel header={this.context.t('players.vttlAndSporta')} eventKey="1">
              <div>
              {playersVTTLAndSporta.map(ply => (
                  <Card key={ply.id}>
                    <CardHeader title={ply.name} />} />
                    <CardText>
                      <h1>{this.context.t('players.vttl')}</h1>
                      <br />
                      <p>{this.context.t('players.indexVTTL')} {ply.vttl.rankingIndex}</p>
                      <p>{this.context.t('players.memberNumberVTTL')} {ply.vttl.uniqueIndex}</p>
                      <p>{this.context.t('players.rankingVTTL')} {ply.vttl.ranking}</p>
                      <br />
                      <h1>{this.context.t('players.sporta')}</h1>
                      <p>{this.context.t('players.indexSporta')} {ply.sporta.rankingIndex}</p>
                      <p>{this.context.t('players.memberNumberSporta')} {ply.sporta.uniqueIndex}</p>
                      <p>{this.context.t('players.rankingSporta')} {ply.sporta.ranking}</p>
                    </CardText>
                  </Card>
                ))}
              </div>
            </Panel>
            <Panel header={this.context.t('players.vttlOnly')} eventKey="2">
              <div>
              {playersVTTL.map(ply => (
                  <Card key={ply.id}>
                    <CardHeader title={ply.name} />} />
                    <CardText>
                      <p>{this.context.t('players.indexVTTL')} {ply.vttl.rankingIndex}</p>
                      <p>{this.context.t('players.memberNumberVTTL')} {ply.vttl.uniqueIndex}</p>
                      <p>{this.context.t('players.rankingVTTL')} {ply.vttl.ranking}</p>
                    </CardText>
                  </Card>
                ))}
              </div>
            </Panel>
            <Panel header={this.context.t('players.sportaOnly')} eventKey="3">
              <div>
              {playersSporta.map(ply => (
                  <Card key={ply.id}>
                    <CardHeader title={ply.name} />} />
                    <CardText>
                      <p>{this.context.t('players.indexSporta')} {ply.sporta.rankingIndex}</p>
                      <p>{this.context.t('players.memberNumberSporta')} {ply.sporta.uniqueIndex}</p>
                      <p>{this.context.t('players.rankingSporta')} {ply.sporta.ranking}</p>
                    </CardText>
                  </Card>
                ))}
              </div>
            </Panel>
          </Accordion>
        </Tab>
      </Tabs>
    );
  }
}