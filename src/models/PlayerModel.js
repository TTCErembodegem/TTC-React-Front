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
    var comp = competition === 'Vttl' ? this.vttl : this.sporta;
    return comp || {};
  }
}

export var playerUtils = {
  getPlayerImageSize() {
    return {
      width: 230,
      height: 200
    };
  },
  getPlayerAvatarImageSize() {
    return {
      width: 40,
      height: 40
    };
  },
  getImageUrl(playerId) {
    return '/img/players/' + playerId + '.png';
  },
  getAvatarImageUrl(playerId) {
    return '/img/players/' + playerId + '_avatar.png';
  },
};

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
    return 'http://tafeltennis.sporcrea.be/competitie/' + ('000000' + uniqueId).slice(-6);
  }
}