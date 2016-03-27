/*eslint-disable */
export default {
  lang: 'nl',
  routes: {
    players: '/spelers',
    login: '/login',
    changePassword: '/profiel/wijzig-paswoord',
    profilePhotos: '/profiel/fotos',
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
    systemUserAlias: 'Clublokaal',
    modal: {
      cancel: 'Annuleren',
      submit: 'Bewaren',
    },
    common: {
      apiSuccess: 'Greato success',
      apiFail: 'Oepsie! Mislukt...',
    },
    system: {
      playerSelect: 'Wie ben je?',
    },
    nav: {
      matches: 'Kalender',
      matchesToday: 'Vandaag',
      players: 'Spelers',
      login: 'Log in',
      changePassword: 'Wijzig Paswoord',
      profilePhotos: 'Wijzig Foto',
      links: 'Links',
      facts: 'TT Weetjes',
      closeMenu: 'Menu sluiten'
    },
    intro: {
      title: 'Tafeltennisclub TTC Erembodegem',
      text: 'Een kleine, toffe club met ${players} leden. Ondanks onze beperkte kern, ' +
        'slagen we er toch in om met ${teamsVttl} ploegen VTTL en ${teamsSporta} Sporta in competitie te treden. ' +
        'Fairplay en gezelligheid staan centraal bij al onze tafeltennis-activiteiten!',
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
      passwordHint: 'Geen email ontvangen? Email wouter...',
      loginButton: 'Login',
      logoutButton: 'Uitloggen',
      fail: 'Incorrect paswoord voor ${}',
      loggedIn: '${} aangelogd',
    },
    photos: {
      uploadNewTitle: 'Nieuwe foto opladen',
      uploadNewInstructions: 'Sleep een foto of klik om een foto te kiezen',
      adjustTitle: 'Foto bijsnijden',
      preview: 'Preview',
      save: 'Bijsnijden opslaan',
    },
    profile: {
      headerText: 'Profiel',
      loggedInText: 'Ingelogd als:'
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
      alle: 'Alle',
      team: 'ploeg',
      rankingVTTL: 'Klassement VTTL:',
      rankingSporta: 'Klassement Sporta:',
      indexVTTL: 'Index VTTL:',
      indexSporta: 'Index Sporta:',
      memberNumberVTTL: 'Lidnummer VTTL:',
      memberNumberSporta: 'Lidnummer Sporta:',
      styleAll: 'Stijl:',
      styles: {
        attacker: 'Aanvaller',
        defender: 'Verdediger',
        allRounder: 'All-rounder',
      },
      bestStroke: 'Beste slag',
      bestStrokeAll: 'Beste slag:',
      ranking: 'Klassement',
      value: 'Waarde',
      editStyle: {
        title: 'Speelstijl ${}',
        tooltip: 'Speelstijl ${} wijzigen',
        bestStroke: 'Beste, meest verrassende slag',
        style: 'Speelstijl',
        saved: 'Speelstijl ${ply} aangepast door ${by}: ${newStyle}',
      },
    },
    match: {
      todayMatches: 'vandaag',
      nextMatches: 'volgende matchen',
      playedMatches: 'gespeelde matchen',
      date: '${}u',
      vs: 'vs',
      topMatch: 'TOPPER',
      degradationMatch: 'THRILLER',
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
        admin: 'Dev',
        adminTitle: 'Dev',
      },
      report: {
        title: 'Wedstrijdverslag',
        editTooltip: 'Wedstrijdverslag wijzigen',
        noReport: 'Nog niets te bespeuren...',
        placeHolder: 'Vertel...',
        postReport: 'Bewaren',
        reportPosted: 'Wedstrijdverslag bewaard',
        reportWrittenBy: 'door ${}',
        commentsTitle: 'Opvolging',
        commentsOpenForm: 'Reageren',
        commentPosted: 'Verklarende aantekening toegevoegd',
        commentVisible: 'Voor iedereen zichtbaar',
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
      competitionDays: 'Competitie: ma., wo. en vr. 20u', //  'en za. om 14u' --> niet meer goed op mobile :(
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
  },
  timeAgo: {
    prefixAgo: null,
    prefixFromNow: "over",
    suffixAgo: "geleden",
    suffixFromNow: null,
    seconds: "minder dan een minuut",
    minute: "ongeveer een minuut",
    minutes: "%d minuten",
    hour: "ongeveer een uur",
    hours: "ongeveer %d uur",
    day: "een dag",
    days: "%d dagen",
    month: "ongeveer een maand",
    months: "%d maanden",
    year: "ongeveer een jaar",
    years: "%d jaar",
    wordSeparator: " ",
    numbers: []
  }
};