import storeUtil from '../storeUtil.js';

export default class PlayerModel {
  constructor(json = {security: 'Player'}) {
    this.alias = json.alias || json.name || '';
    this.contact = new PlayerContactModel(json.contact); // playerId, email, mobile, address, city
    this.id = json.id;
    this.active = json.active;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.sporta = json.sporta; // clubId, competition, frenoyLink, position (=index), ranking, rankingIndex, rankingValue
    this.vttl = json.vttl;
    this.style = json.style || {}; // playerId, name, bestStroke
    this.quitYear = json.quitYear;
    this.security = json.security;
    this.hasKey = json.hasKey;
  }

  get name() {
    return this.firstName + ' ' + this.lastName;
  }

  get slug() {
    return this.name.toLowerCase().replace(/\s/g, '-');
  }

  getCompetition(competition) {
    if (!competition) {
      return {};
    }

    const comp = competition === 'Vttl' ? this.vttl : this.sporta;
    return comp || {};
  }

  isMe() {
    return this.id === storeUtil.getUser().playerId;
  }

  getTeam(competition) {
    const teams = storeUtil.getTeams()
      .filter(team => team.competition === competition)
      .filter(team => team.players.some(tp => tp.playerId === this.id && (tp.type === 'Captain' || tp.type === 'Standard')));

    return teams.first();
  }
}


export function displayMobile(n) {
  if (!n) {
    return '';
  }
  return n.replace(/^(\d{3,4})(\d{2})(\d{2})(\d{2})$/, '$1/$2 $3 $4');
}


class PlayerContactModel {
  constructor(contact) {
    // playerId, email, mobile, address, city
    Object.assign(this, contact);
  }

  getMobile() {
    return displayMobile(this.mobile);
  }
}


export var playerUtils = {
  getPlayerImageSize() {
    return {
      width: 200,
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
    return '/img/players/' + playerId + '.png?3';
  },
  getAvatarImageUrl(playerId) {
    return '/img/players/' + playerId + '_avatar.png?3';
  },
};

export function createFrenoyLink(comp) {
  // old and reliable but with frenoyLink that needs to be fetched manually
  if (!comp.frenoyLink) {
    return createFrenoyLinkByUniqueId(comp.competition, comp.uniqueIndex);
  }
  if (comp.competition === 'Vttl') {
    return 'https://competitie.vttl.be/index.php?menu=6&result=1&sel=' + comp.frenoyLink;
  } else {
    return 'https://ttonline.sporta.be/competitie/index.php?menu=6&result=1&sel=' + comp.frenoyLink;
  }
}

export function createFrenoyLinkByUniqueId(comp, uniqueId) {
  // new and restfull but may contains glitches
  if (comp === 'Vttl') {
    return 'https://competitie.vttl.be/' + uniqueId;
  } else {
    return 'https://ttonline.sporta.be/competitie/' + ('000000' + uniqueId).slice(-6);
  }
}

export function getPlayingStatusClass(playingStatus) {
  if (!playingStatus) {
    return null;
  }
  if (playingStatus.status) {
    playingStatus = playingStatus.status;
  }
  switch (playingStatus) {
  case 'Play':
  case 'Major':
  case 'Captain':
    return 'success';
  case 'NotPlay':
    return 'danger';
  case 'Maybe':
    return 'info';
  default:
    return null;
  }
}

export function getPlayingStatusColor(playingStatus) {
  if (!playingStatus) {
    return null;
  }
  if (playingStatus.status) {
    playingStatus = playingStatus.status;
  }
  switch (playingStatus) {
  case 'Play':
  case 'Major':
  case 'Captain':
    return '#FFB00F';
  case 'NotPlay':
    return '#c9302c';
  case 'Maybe':
    return '#31b0d5';
  default:
    return undefined;
  }
}
