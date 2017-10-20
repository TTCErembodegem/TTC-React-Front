export default {
  lang: 'nl',
  routes: {
    login: '/login',
    forgotPassword: '/login/nieuw-paswoord',
    profile: '/profiel',
    profileTabs: {
      main: '',
      editDetails: 'wijzig-gegevens',
      editPicture: 'wijzig-foto',
      editAvatar: 'wijzig-avatar',
      editPassword: 'wijzig-paswoord',
      editHolidays: 'ploegopstelling',
    },

    players: '/spelers',
    playerTabs: {
      list: 'lijst',
      vttl: 'vttl',
      sporta: 'sporta',
      gallery: 'gallerij',
    },

    matches: '/kalender',
    matchesToday: '/vandaag',
    matchesWeek: '/speelweek',
    match: '/match/:matchId',

    teams: '/ploegen/:competition',
    opponent: '/tegenstander/:competition/:clubId/:teamCode',

    admin: '/admin',
    links: '/links',
    facts: '/weetjes',
    administration: '/bestuur',
    generalInfo: '/club-info',
  },
  trans: {
    fullClubName: 'TTC Erembodegem',
    clubName: 'Erembodegem',
    systemUserAlias: 'Clublokaal',
    common: {
      apiSuccess: 'Greato success',
      apiFail: 'Oepsie! Mislukt...',

      save: 'Bewaren',
      cancel: 'Annuleren',

      frenoy: 'Frenoy',
      teamFormation: 'Opstelling',
      competition: 'Competitie',
      date: 'Datum',
      close: 'Sluiten',
      all: 'Alle',
      matchAtHome: 'Thuismatch',
    },
    system: {
      playerSelect: 'Wie ben je?',
    },
    nav: {
      matches: 'Kalender',
      matchesToday: 'Vandaag',
      matchesWeek: 'Speelweek',
      teamsVttl: 'Ploegkalender Vttl',
      teamsSporta: 'Ploegkalender Sporta',
      players: 'Spelers',
      login: 'Log in',
      links: 'Links',
      facts: 'TT Weetjes',
      help: 'Help',
      closeMenu: 'Menu sluiten',
      admin: 'Admin',
      administration: 'Bestuur',
      generalInfo: 'Clubinfo',
    },
    profile: {
      main: 'Profiel',
      editPassword: 'Wijzig Paswoord',
      editDetails: 'Wijzig Gegevens',
      editPicture: 'Wijzig Foto',
      editAvatar: 'Wijzig Avatar',
      editHolidays: 'Ploegopstelling',
      play: {
        tableTitle: 'Kan je spelen?',
        canPlay: 'SPELEN',
        canNotPlay: 'Kan niet',
        canMaybe: 'Misschien',
        canDontKnow: 'Weet niet',
        extraComment: 'Info voor de kapitein',
        extraCommentHelp: 'Klik op een van de knoppen om te bewaren',
      },
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
      introText: 'Geef de eerste letter(s) van je voornaam in en selecteer jezelf uit de lijst',
      loginName: 'Spelersnaam',
      password: 'Paswoord',
      passwordHint: '',
      loginButton: 'Login',
      logoutButton: 'Uitloggen',
      fail: 'Incorrect paswoord voor ${}',
      loggedIn: '${} aangelogd',
    },
    password: {
      changeTitle: 'Paswoord wijzigen',
      oldPassword: 'Huidig paswoord',
      newPassword: 'Nieuw paswoord',
      forgotLink: 'Paswoord vergeten?',
      fogotMailSent: 'Een email met een paswoord reset link is verzonden',
      sendNewButton: 'Nieuw paswoord sturen',
      passwordChangedSuccess: 'Paswoord succesvol gewijzigd',
      passwordChangedFail: 'Paswoord wijzigen is mislukt'
    },
    photos: {
      existingTitle: 'Huidige foto',
      uploadNewTitle: 'Nieuwe foto opladen',
      uploadNewInstructions: 'Sleep een foto of klik om een foto te kiezen',
      adjustTitle: 'Foto bijsnijden',
      preview: 'Preview',
      save: 'Bijsnijden opslaan',
    },
    player: {
      teamCaptain: 'Kapitein',

      name: 'Naam',
      alias: 'Alias',

      email: 'Email',
      gsm: 'Gsm',
      address: 'Adres',
      city: 'Gemeente',

      style: 'Stijl',
      bestStroke: 'Beste slag',
      styles: {
        attacker: 'Aanvaller',
        defender: 'Verdediger',
        allRounder: 'All-rounder',
      },
      editStyle: {
        title: 'Speelstijl ${}',
        tooltip: 'Speelstijl ${} wijzigen',
        bestStroke: 'Beste, meest verrassende slag',
        style: 'Speelstijl',
        saved: 'Speelstijl ${ply} aangepast door ${by}: ${newStyle}',
      },

      updatePlayerSuccess: 'Speler gegevens succesvol gewijzigd',
      updatePlayerFail: 'Speler gegevens wijzigen is mislukt'
    },
    comp: {
      index: 'Index',
      ranking: 'Klassement',
      rankingIndex: 'Volgnummer',
      sporta: {
        rankingValue: 'Waarde',
        uniqueIndex: 'LIDK nr',
        teamValue: 'Ploegwaarde',
      },
      vttl: {
        uniqueIndex: 'Comp nr',
      },
      roundFirst: 'Heenronde',
      roundBack: 'Terugronde',
      downloadScoresheet: 'Scoreblad downloaden',
      scoresheetFileName: '${frenoyId} Sporta ${teamCode} vs ${theirClub} ${theirTeam}',
    },
    players: {
      title: 'Spelers overzicht ${a}',
      search: 'Speler zoeken',

      list: 'Lijst',
      gallery: 'Spelers',

      downloadExcel: 'Excel spelerslijst downloaden',
      downloadExcelFileName: 'Spelerslijst',
    },
    clubs: {
      generalInfo: {
        title: 'Clubinfo',
        contact: 'Contact',
        openDays: 'Competitie & Training',
        ourEmail: 'Ons email',
        ourAddress: 'Ons adres',
        moneyMoney: 'Lidgeld',
        googleMap: 'Kaart',
        bankNr: 'Bankrekeningnummer',
        orgNr: 'BTW nummer vzw',
        balls: 'Wij spelen met',
      },
      managementTitle: 'Het bestuur',
      managerTypes: {
        Chairman: 'Voorzitter',
        Secretary: 'Secretaris',
        Treasurer: 'Penningmeester',
        Vttl: 'Competitie Vttl',
        Sporta: 'Competitie Sporta',
      }
    },
    match: {
      block: {
        Captain: 'Geblokkeerd door de kapitein',
        Major: 'Geblokkeerd door Jelle'
      },
      plys: {
        saveAndBlockAll: 'Bewaren en Blokkeren',
        choiceCaptain: 'OPGESTELD',
        choicePlayers: 'Keuze spelers',
        blockMatchTitle: 'Opstelling',

        snackbarSaved: 'Opstelling bewaard',
        snackbarBlocked: 'Bewaard en geblokkeerd',

        tooltipSaveAndBlock: 'Opstelling bewaren en match blokkeren',
        tooltipSave: 'Opstelling bewaren ZONDER blokkeren',
        tooltipOpenForm: 'Match opstelling bewerken',
        extraComment: 'Extra info bij de match',
      },
      week: 'Week',
      todayMatches: 'vandaag',
      nextMatches: 'volgende matchen',
      playedMatches: 'gespeelde matchen',
      date: '${}u',
      vs: 'vs',
      topMatch: 'TOPPER',
      thrillerMatch: '!! THRILLER !!',
      previousEncounterScore: 'Uitslag heenronde',
      gotoPreviousEncounter: 'Details heenronde',
      gotoNextEncounter: 'Details terugronde',
      details: 'Details',
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
        opponentsRanking: 'Tegenstanders',
        opponentsRankingTitle: 'Hun laatste uitslagen',
        opponentsFormationTitle: 'Hun opstelling',
        admin: 'Dev',
      },
      report: {
        title: 'Wedstrijdverslag',
        viewFull: 'Volledig wedstrijdblad bekijken',
        viewDetails: 'Wedstrijdblad sluiten',
        editTooltip: 'Wedstrijdverslag wijzigen',
        noReport: 'Nog niets te bespeuren...',
        placeHolder: 'Vertel...',
        reportPosted: 'Wedstrijdverslag bewaard',
        reportWrittenBy: 'door ${}',
        commentsTitle: 'Opvolging',
        commentsOpenForm: 'Reageren',
        commentsOpenFormConfirm: 'Reactie plaatsen',
        commentsPhoto: 'Foto plaatsen',
        commentPosted: 'Verklarende aantekening toegevoegd',
        commentDeleted: 'Verklarende aantekening verwijderd',
        commentVisible: 'Voor iedereen zichtbaar',
      },
      playersVictoryTitle: 'Overwinningen',
      playersOpponentsTitle: 'Tegenstanders',
      double: 'Dubbel',
      doubles: 'Dubbels',
      individual: {
        matchTitle: 'Match',
        setsTitle: 'Sets',
        resultTitle: 'Uitslag',
      },
      opponents: {
        homeTeam: 'Thuis',
        awayTeam: 'Uit',
        vsTeam: 'Tegen',
        outcome: 'Uitslag',
        timesPlayed: 'Aantredingen',
        player: 'Speler',
        victories: 'Overwinningen',
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
      adultMembership: '€92 voor volwassenen',
      youthMembership: '€52 voor -18 jarigen',
      additionalMembership: 'Een extra €68 komt bovenop het lidgeld dat kan teruggevorderd worden door 4 kaarten voor het eetfestijn te verkopen.',
    },
    links: {
      federations: 'De bonden & hun uitslagenborden',
      vttl: 'VTTL',
      vttlovl: 'VTTL Oost-Vlaanderen',
      sporta: 'Sporta',
      ittf: 'ITTF',
      ettu: 'ETTU',
      vttlResults: 'Resultaten VTTL',
      sportaResults: 'Resultaten Sporta',
      varia: 'Varia',
      vttlCalculationOne: 'Klassementsberekening VTTL (TTC Sint-Pauwels)',
      vttlCalculationTwo: 'Klassementsberekening TTC De Pinte',
      sportaCalculation: 'Klassementsberekening Sporta (TTC Sint-Pauwels)',
      francis: 'Francis tafeltennisshop',
      tabletennisDaily: 'TableTennisDaily'
    },
    week: {
      emailTitle: 'Opstelling mailen',
      sendEmail: 'Email versturen',
    },
    teamCalendar: {
      downloadExcel: 'Excel ploegopstellingen downloaden',
      downloadExcelFileName: 'Opstellingen',
      match: 'Wedstrijd',
      score: 'Score',
      position: 'Plaats',
      name: 'Clubnaam',
      matchesWon: 'Gewonnen',
      matchesLost: 'Verloren',
      matchesDraw: 'Gelijk',
      points: 'Punten',
      matches: 'Matchen',

      matchesWonBadge: 'Overwinningen',
      matchesWonAllBadge: 'Alles gewonnen!',
      matchesDrawBadge: 'Gelijk gespeeld',
      matchesLostBadge: 'Nederlagen',
      teamRanking: 'Stand in de rangschikking',

      view: {
        main: 'Overzicht',
        matches: 'Matchen',
        ranking: 'Rangschikking',
        matchesTable: 'Opstelling',
        players: 'Spelers',
        week: 'Speelweek',
      },
      individual: 'Individueel',
      frenoyresults: 'Ga naar resultaten op Frenoy',
      frenoyranking: 'Ga naar rangschikking op Frenoy',
      frenoyweek: 'Ga naar weekoverzicht op Frenoy',
      frenoyPlayerResults: 'Ga naar spelerdetails op Frenoy',
    },
    facts: require('./locales-nl-facts.js')
  },
  timeAgo: {
    prefixAgo: null,
    prefixFromNow: 'over',
    suffixAgo: 'geleden',
    suffixFromNow: null,
    seconds: 'minder dan een minuut',
    minute: 'ongeveer een minuut',
    minutes: '%d minuten',
    hour: 'ongeveer een uur',
    hours: 'ongeveer %d uur',
    day: 'een dag',
    days: '%d dagen',
    month: 'ongeveer een maand',
    months: '%d maanden',
    year: 'ongeveer een jaar',
    years: '%d jaar',
    wordSeparator: ' ',
    numbers: []
  }
};
