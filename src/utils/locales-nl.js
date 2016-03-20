/*eslint-disable */
export default {
  lang: 'nl',
  routes: {
    players: '/spelers',
    login: '/login',
    changePassword: '/wijzig-paswoord',
    profile: '/profiel',
    links: '/links',
    matches: '/kalender',
    match: '/match/:matchId',
    matchesToday: '/vandaag',
    facts: '/weetjes',
  },
  trans: {
    fullClubName: 'TTC Erembodegem',
    clubName: 'Erembodegem',
    modal: {
      cancel: 'Annuleren',
      submit: 'Bewaren',
    },
    common: {
      apiSuccess: 'Greato success',
      apiFail: 'Oepsie! Mislukt...',
    },
    nav: {
      matches: 'Kalender',
      matchesToday: 'Vandaag',
      players: 'Spelers',
      login: 'Log in',
      changePassword: 'Wijzig Paswoord',
      links: 'Links',
      facts: 'TT Weetjes',
      closeMenu: 'Menu sluiten'
    },
    intro: {
      title: 'Tafeltennisclub TTC Erembodegem',
      text: 'Een kleine, toffe club met ${players} leden. Ondanks onze beperkte kern, slagen we er toch in om met ${teamsVttl} ploegen VTTL en ${teamsSporta} Sporta in competitie te treden. Fairplay en gezelligheid staan centraal bij al onze tafeltennis-activiteiten!',
      matchesToday: 'matchen vandaag',
      trainingToday: 'vandaag training vanaf 20u',
      playedMatches: 'laatst gespeelde matchen',
      loading: 'Laden...',
      ourSponsors: 'onze sponsers',
    },
    login: {
      title: 'Aanmelden',
      introText: '',
      loginName: 'Spelersnaam',
      password: 'Paswoord',
      //passwordHint: 'Hetzelfde paswoord als de oude site', // TODO: put this translation back!
      passwordHint: 'Het paswoord is "pwd"',
      loginButton: 'Login',
      logoutButton: 'Uitloggen',
      fail: 'Incorrect paswoord voor ${}',
      loggedIn: '${} aangelogd',
    },
    changePassword: {
      title: 'Paswoord wijzigen',
      oldPassword: 'Huidig paswoord',
      newPassword: 'Nieuw paswoord',
      changePasswordButton: 'Wijzig Paswoord',
    },
    players: {
      title: 'Spelers overzicht ${a}',
      index: 'Index',
      vttlMemberNumber: 'Lidnummer',
      name: 'Naam',
      vttl: 'VTTL',
      sporta: 'Sporta',
      style: 'Stijl',
      styles: {
        attacker: 'Aanvaller',
        defender: 'Verdediger',
        allRounder: 'All-rounder',
      },
      bestStroke: 'Beste slag',
      ranking: 'Klassement',
      value: 'Waarde',
      editStyle: {
        title: 'Speelstijl ${}',
        bestStroke: 'Beste, meest verassende slag',
        style: 'Speelstijl',
        saved: 'Speelstijl ${ply} aangepast',
      },
    },
    match: {
      todayMatches: 'vandaag',
      nextMatches: 'volgende matchen',
      playedMatches: 'gespeelde matchen',
      date: '${}u',
      vs: 'vs',
      previousEncounterScore: 'Uitslag heenronde',
      scoresheetSporta: {
        uniqueIndex: 'LIDK. nr.',
        ranking: 'Klassement',
        rankingValue: 'Waarde',
        teamValue: 'Ploegwaarde',
      },
      scoresheetVttl: {
        uniqueIndex: 'Computer nummer',
        rankingIndex: 'Volgnummer',
        index: 'Index',
        ranking: 'Klassement',
      },
      form: {
        title: 'Matchverloop',
      },
      tabs: {
        players: 'Spelers',
        playersTitle: 'Onze opstelling',
        matches: 'Individueel',
        matchesTitle: 'Individuele matchuitslagen',
        report: 'Verslag',
        reportTitle: 'Het wedstrijdverslag',
        club: 'Lokaal',
        clubTitle: 'Hun clublokaal',
        scoresheet: 'Wedstrijdblad',
        scoresheetTitle: 'Wedstrijdblad',
        opponentsRanking: 'Tegenstanders',
        opponentsRankingTitle: 'Hun laatste uitslagen',
        opponentsFormation: 'Opstelling',
        opponentsFormationTitle: 'Hun opstelling',
      },
      report: {
        title: 'Wedstrijdverslag',
        noReport: 'Nog niets te bespeuren...',
        placeHolder: 'Vertel...',
        postReport: 'Bewaren',
        reportPosted: 'Wedstrijdverslag bewaard',
        reportWrittenBy: 'door ${}',
        commentsTitle: 'Opvolging',
        commentsOpenForm: 'Reageren',
        commentPosted: 'Verklarende aantekening toegevoegd',
      },
      playersVictoryTitle: 'Overwinningen',
      playersOpponentsTitle: 'Tegenstanders',
      individual: {
        matchTitle: 'Match',
        setsTitle: 'Sets',
        resultTitle: 'Uitslag',
      },
      opponents: {
        date: 'Datum',
        homeTeam: 'Thuis',
        awayTeam: 'Uit',
        vsTeam: 'Tegen',
        outcome: 'Uitslag',
        timesPlayed: 'Aantredingen',
        player: 'Speler',
        playerRanking: '',
        victories: 'Overwinningen / Nederlagen',
        formation: 'Opstelling'
      },
      enemyVictory: '${}ov.',
      club: {
        locationTitle: 'Clublokaal',
        locationUnknown: 'Niet gekend',
        websiteKnown: 'Ga naar website'
      },
      chooseOtherPlayer: 'Andere speler opstellen'
    },
    footer: {
      location: 'Groeneweg 28, 9300 Erembodegem',
      trainingDays: 'Training: di. en do. vanaf 20u',
      competitionDays: 'Competitie: ma., wo. en vr. om 20u',
      telephoneNumber: '0495/24 94 20',
      adultMembership: '€90 voor volwassenen',
      youthMembership: '€50 voor -18 jarigen',
      contact: 'Contacteer ons'
    },
    links: {
      federations: 'De bonden & hun uitslagenborden',
      vttl: 'VTTL',
      vttlovl: 'VTTL Oost-Vlaanderen',
      sporta: 'Sporta',
      ittf: 'ITTF',
      vttlResults: 'Resultaten VTTL',
      sportaResults: 'Resultaten Sporta',
      varia: 'Varia',
      vttlCalculation: 'Klassementsberekening VTTL',
      sportaCalculation: 'Klassementsberekening Sporta',
      francis: 'Francis tafeltennisshop',
      ttactua: 'Tafeltennisactua',
    },
    facts: require('./locales-nl-facts.js')
  }
};