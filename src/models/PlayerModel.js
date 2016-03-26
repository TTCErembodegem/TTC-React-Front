export default class PlayerModel {
  constructor(json) {
    this.alias = json.alias;
    this.contact = json.contact || {};
    this.id = json.id;
    this.active = json.active;
    this.name = json.name;
    this.sporta = json.sporta;
    this.vttl = json.vttl;
    this.style = json.style || {};
  }

  getCompetition(competition) {
    return competition === 'Vttl' ? this.vttl : this.sporta;
  }
}

export function createFrenoyLink(comp) {
  // old and reliable but with frenoyLink that needs to be fetched manually
  if (comp.competition === 'Vttl') {
    return 'http://competitie.vttl.be/index.php?menu=6&result=1&sel=' + comp.frenoyLink;
  } else {
    return 'http://tafeltennis.sporcrea.be/competitie/index.php?menu=6&result=1&sel=' + comp.frenoyLink;
  }
}

export function createFrenoyLinkByUniqueId(comp, uniqueId) {
  // new and restfull but may contains glitches
  if (comp === 'Vttl') {
    return 'http://competitie.vttl.be/' + uniqueId;
  } else {
    // TODO: does not work for Sporta
    //return 'http://tafeltennis.sporcrea.be/competitie/' + uniqueId;
    return null;
  }
}