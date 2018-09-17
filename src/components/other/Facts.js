/* eslint-disable */
import React, {Component} from 'react';
import {contextTypes} from '../../utils/decorators/withContext.js';

import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';

export default class Facts extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
       <PanelGroup accordion style={{marginTop: 10}} id="navigation">
          <Panel eventKey="1">
            <Panel.Heading>
              <Panel.Title toggle><b>{this.context.t('facts.service')}</b></Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              <h1>{this.context.t('facts.serviceHeaderOne')}</h1>
              <p>
                {this.context.t('facts.serviceSectionOneComponentOne')}
              </p>
              <br />
              <h1>{this.context.t('facts.serviceSectionOneComponentTwo')}</h1>
              <p>{this.context.t('facts.serviceSectionOneComponentThree')}</p>
              <ul>
                <li><strong>{this.context.t('facts.serviceSectionOneComponentFour')}</strong>{this.context.t('facts.serviceSectionOneComponentFive')}</li>
                <li><strong>{this.context.t('facts.serviceSectionOneComponentSix')}</strong>{this.context.t('facts.serviceSectionOneComponentSeven')}</li>
                <li><strong>{this.context.t('facts.serviceSectionOneComponentEight')}</strong>{this.context.t('facts.serviceSectionOneComponentNine')}</li>
                <li><strong>{this.context.t('facts.serviceSectionOneComponentTen')}</strong>{this.context.t('facts.serviceSectionOneComponentEleven')}</li>
                <li><strong>{this.context.t('facts.serviceSectionOneComponentTwelve')}</strong>{this.context.t('facts.serviceSectionOneComponentThirteen')}</li>
              </ul>
              <br />
              <h1>{this.context.t('facts.serviceSectionOneComponentFourteen')}</h1>
              <p>
                {this.context.t('facts.serviceSectionOneComponentFifteen')}
              </p>
              <br />
              <h1>{this.context.t('facts.serviceSectionOneComponentSixteen')}</h1>
              <p>
                {this.context.t('facts.serviceSectionOneComponentSeventeen')}
              </p>
                <figure style={{textAlign: 'center'}}>
                  <img src="/img/facts/service1.gif" alt="serviceFigureOne" />
                  <figcaption>{this.context.t('facts.serviceFigureCaptionOne')}</figcaption>
                </figure>
              <br />
              <h4>{this.context.t('facts.serviceSectionOneComponentEightteen')}</h4>
              <p>
                {this.context.t('facts.serviceSectionOneComponentNineteen')}
              </p>
                <br />
                  <figure style={{textAlign: 'center'}}>
                    <img src="/img/facts/service2.gif" alt="serviceFigureTwo" />
                    <figcaption>{this.context.t('facts.serviceFigureCaptionTwo')}</figcaption>
                  </figure>
              <p>
                <br /><br />
                {this.context.t('facts.serviceSectionOneComponentTwenty')}
                <br /><br />
                {this.context.t('facts.serviceSectionOneComponentTwentyOne')}
                <br /><br />
                {this.context.t('facts.serviceSectionOneComponentTwentyTwo')}
              </p>
              <br />
              <h4></h4>
              <p>
                {this.context.t('facts.serviceSectionOneComponentTwentyFour')}
              </p>
              <br />
              <h4>{this.context.t('facts.serviceSectionOneComponentTwentyFive')}</h4>
              <p>
                {this.context.t('facts.serviceSectionOneComponentTwentySix')}
                <br /><br />
                {this.context.t('facts.serviceSectionOneComponentTwentySeven')}
                <br /><br />
                {this.context.t('facts.serviceSectionOneComponentTwentyEight')}
                <br />
                {this.context.t('facts.serviceSectionOneComponentTwentyNine')}
              </p>
            </Panel.Body>
          </Panel>


          <Panel eventKey="2">
          <Panel.Heading>
            <Panel.Title toggle><b>{this.context.t('facts.longpimples')}</b></Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <p>
                {this.context.t('facts.serviceSectionTwoComponentOne')}
                <br /><br />
                {this.context.t('facts.serviceSectionTwoComponentTwo')}
                <br /><br />
                {this.context.t('facts.serviceSectionTwoComponentThree')}
                <br /><br />
                {this.context.t('facts.serviceSectionTwoComponentFour')}
            </p>
            <figure>
              <img src="/img/facts/longpimples.jpg" className="img-responsive center-block" alt="longPimples" />
            </figure>
            <br />
            <p>
              {this.context.t('facts.serviceSectionTwoComponentFive')}
              <br /><br />
              {this.context.t('facts.serviceSectionTwoComponentSix')}
              <br /><br />
              {this.context.t('facts.serviceSectionTwoComponentSeven')}
              <br /><br />
              {this.context.t('facts.serviceSectionTwoComponentEight')}
              <br /><br />
              {this.context.t('facts.serviceSectionTwoComponentNine')}
              <br /><br />
              {this.context.t('facts.serviceSectionTwoComponentTen')}
            </p>
          </Panel.Body>
          </Panel>


          <Panel eventKey="3">
            <Panel.Heading>
              <Panel.Title toggle><b>{this.context.t('facts.speed')}</b></Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              <p>
                {this.context.t('facts.serviceSectionThreeComponentOne')}
              </p>
              <ol>
                <li>{this.context.t('facts.serviceSectionThreeComponentTwo')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentThree')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentFour')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentFive')}</li>
              </ol>
              <p>
                {this.context.t('facts.serviceSectionThreeComponentSix')}
              </p>
              <strong>{this.context.t('facts.serviceSectionThreeComponentSeven')}</strong>
              <br /><br />
              <p>
                {this.context.t('facts.serviceSectionThreeComponentEight')}
              </p>
              <ol>
                <li>{this.context.t('facts.serviceSectionThreeComponentNine')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentTen')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentEleven')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentTwelve')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentThirteen')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentFourteen')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentFifteen')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentSixteen')}</li>
                <li>{this.context.t('facts.serviceSectionThreeComponentSeventeen')}</li>
              </ol>
              <p>
                {this.context.t('facts.serviceSectionThreeComponentEightteen')}
              </p>
            </Panel.Body>
          </Panel>


          <Panel eventKey="4">
            <Panel.Heading>
              <Panel.Title toggle><b>{this.context.t('facts.astrology')}</b></Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              <h1>{this.context.t('facts.serviceSectionFourComponentOne')}</h1>
              <p>
                {this.context.t('facts.serviceSectionFourComponentTwo')}
              </p>
              <p>
                {this.context.t('facts.serviceSectionFourComponentThree')}
              </p>
              <ul>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentFour')}</strong> {this.context.t('facts.serviceSectionFourComponentFive')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentSix')}</strong> {this.context.t('facts.serviceSectionFourComponentSeven')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentEight')}</strong> {this.context.t('facts.serviceSectionFourComponentNine')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentTen')}</strong> {this.context.t('facts.serviceSectionFourComponentEleven')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentTwelve')}</strong> {this.context.t('facts.serviceSectionFourComponentThirteen')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentFourteen')}</strong> {this.context.t('facts.serviceSectionFourComponentFifteen')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentSixteen')}</strong> {this.context.t('facts.serviceSectionFourComponentSeventeen')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentEightteen')}</strong> {this.context.t('facts.serviceSectionFourComponentNineteen')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentTwenty')}</strong> {this.context.t('facts.serviceSectionFourComponentTwentyOne')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentTwentyTwo')}</strong> {this.context.t('facts.serviceSectionFourComponentTwentyThree')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentTwentyFour')}</strong> {this.context.t('facts.serviceSectionFourComponentTwentyFive')}</li>
                <li><strong>{this.context.t('facts.serviceSectionFourComponentTwentySix')}</strong> {this.context.t('facts.serviceSectionFourComponentTwentySeven')}</li>
              </ul>
            </Panel.Body>
          </Panel>


          <Panel eventKey="5">
            <Panel.Heading>
              <Panel.Title toggle><b>{this.context.t('facts.history')}</b></Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              <h1>{this.context.t('facts.serviceSectionFiveComponentOne')}</h1>
              <p>
              {this.context.t('facts.serviceSectionFiveComponentTwo')}
              </p>
              <h1>{this.context.t('facts.serviceSectionFiveComponentThree')}</h1>
              <p>
              {this.context.t('facts.serviceSectionFiveComponentFour')}
              </p>
              <h1>{this.context.t('facts.serviceSectionFiveComponentFive')}</h1>
              <p>
              {this.context.t('facts.serviceSectionFiveComponentSix')}
              </p>
            </Panel.Body>
          </Panel>
       </PanelGroup>
    );
  }
}
