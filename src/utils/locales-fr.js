/*eslint-disable */
export default {
  lang: 'fr',
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
      all: 'alle',
      vttl: 'vttl',
      sporta: 'sporta',
      gallery: 'gallerij',
    },

    matches: '/kalender',
    match: '/match/:matchId',
    matchesToday: '/vandaag',
    matchesWeek: '/speelweek',

    teams: '/ploegen/:competition',

    admin: '/admin',
    links: '/links',
    facts: '/weetjes',
    administration: '/bestuur',
    generalInfo: '/club-info',
  },
  trans: {
    fullClubName: 'TTC Erembodegem',
    clubName: 'Erembodegem',
    systemUserAlias: 'Salle de club',
    common: {
      apiSuccess: 'Succès',
      apiFail: 'Une erreur est survenue',

      save: 'Sauver',
      cancel: 'Annuler',

      frenoy: 'Frenoy',
      teamFormation: 'Formation',
      competition: 'Compétition',
      date: 'Date',
    },
    system: {
      playerSelect: 'Qui êtes-vous?',
    },
    nav: {
      matches: 'Calendrier',
      matchesToday: 'Aujourdhui',
      matchesWeek: 'Semaine de jouer',
      teamsVttl: 'Calendrier des équipes Vttl',
      teamsSporta: 'Calendrier des équipes Sporta',
      players: 'Joueurs',
      login: 'Connecter',
      links: 'Lien',
      facts: 'Faits intéressants de TT',
      help: 'Help',
      closeMenu: 'Fermer menu',
      admin: 'Admin',
      administration: 'Administration',
      generalInfo: 'Info de club',
    },
    profile: {
      main: 'Profil',
      editPassword: 'Modifier mot de passe',
      editDetails: 'Modifier données',
      editPicture: 'Modifier photo',
      editAvatar: 'Modifier Avatar',
      editHolidays: 'Formation équipe',
      play: {
        tableTitle: 'Pouvez-vous jouer?',
        canPlay: 'JOUER',
        canNotPlay: 'Pas possible',
        canMaybe: 'Peut-être',
        canDontKnow: 'Ne sais pas',
        extraComment: 'Info voor de kapitein',
        extraCommentHelp: 'Klik op een van de knoppen om te bewaren',
      },
    },
    intro: {
      title: 'Club de tennis de table Erembodegem',
      text: 'Un club amusant avec ${players} members. Malgré notre base limitée, ' +
        'nous pouvons jouer avec ${teamsVttl} équipes VTTL et ${teamsSporta} équipes Sporta en compétition' +
        'FairPlay et le plaisir sont au coeur de toutes nos activités de tennis de table!',
      matchesToday: 'Matchs aujourdhui',
      trainingToday: 'Entraînement aujourdhui à partir de 20h',
      playedMatches: 'Derniers matchs joués',
      loading: 'Charger...',
      ourSponsors: 'nos sponsers',
    },
    login: {
      title: 'Connecter',
      introText: '',
      loginName: 'Nom de joueur',
      password: 'Mot passe',
      passwordHint: 'Pas reçu e-mail? Email wouter...',
      loginButton: 'Connecter',
      logoutButton: 'Déconnecter',
      fail: 'Mot de passe mauvais pour ${}',
      loggedIn: '${} est connecté',
    },
    password: {
      changeTitle: 'Modifier mot de passe',
      oldPassword: 'Mot de passe courant',
      newPassword: 'Nouveau mot de passe',
      forgotLink: 'Oublier mot de passe?',
      fogotMailSent: 'E-mail avec votre nouveau mot de passe est envoyé',
      sendNewButton: 'Envoyer un nouveau mot de passe',
      passwordChangedSuccess: 'Mot de passe est modifié',
      passwordChangedFail: 'Modifier mot de passe est raté'
    },
    photos: {
      uploadNewTitle: 'Télécharger nouveau photo',
      uploadNewInstructions: 'Faire glisser ou cliquer photo pour choisir',
      adjustTitle: 'Récolter photo',
      preview: 'Aperçu',
      save: 'Sauver récolte',
    },
    player: {
      teamCaptain: 'Kapitein',

      name: 'Nom',
      alias: 'Alias',

      email: 'Email',
      gsm: 'Gsm',
      address: 'Adresse',
      city: 'Ville',

      style: 'Style',
      bestStroke: 'Meilleur coup',

      styles: { // TODO: styles kunnen momenteel niet vertaald worden
        attacker: 'Aanvaller',
        defender: 'Verdediger',
        allRounder: 'All-rounder',
      },
      editStyle: {
        title: 'Style de jeux ${}',
        tooltip: 'Modifier Style de jeux de ${}',
        bestStroke: 'Meilleur coup',
        style: 'Style de jeux',
        saved: 'Style de jeux ${ply} modifié par ${by}: ${newStyle}',
      },

      updatePlayerSuccess: 'Joueur est modifié',
      updatePlayerFail: 'Modifier joueur est raté'
    },
    comp: {
      index: 'Index',
      ranking: 'Classement',
      rankingIndex: 'Nombre de série',
      sporta: {
        rankingValue: 'Valeur',
        uniqueIndex: 'LIDK nr',
        teamValue: 'Valeur équipe',
      },
      vttl: {
        uniqueIndex: 'Comp nr'
      },
      roundFirst: 'Heenronde',
      roundBack: 'Terugronde',
      downloadScoresheet: 'Télécharger feuille de match',
      scoresheetFileName: '${frenoyId} Sporta ${teamCode} vs ${theirClub} ${theirTeam}',
    },
    players: {
      title: 'Aperçu de joueurs ${a}',
      search: 'Chercher jouer',

      all: 'Tous',
      gallery: 'Galerie',

      downloadExcel: 'Excel export',
      downloadExcelFileName: 'ListeJoueurs',
    },
    clubs: {
      generalInfo: {
        title: 'Infos de club',
        contact: 'Contact',
        openDays: 'Compétition & Entraînement',
        ourEmail: 'Notre adresse mail',
        ourAddress: 'Notre adresse',
        moneyMoney: 'Cotisation',
        googleMap: 'Route',
        other: 'Autres',
        bankNr: 'Compte bancaire',
        orgNr: 'numéro de TVA vzw',
      },
      managementTitle: 'Adminstration',
      managerTypes: {
        Chairman: 'Président',
        Secretary: 'Sécretaire',
        Treasurer: 'Trésorier'
      }
    },
    match: {
      block: {
        Captain: 'Bloqué par capitaine',
        Major: 'Bloqué par Jelle'
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
        tooltipOpenForm: 'Opstelling bewerken',
        extraComment: 'Extra info bij de match',
      },
      week: 'Semaine',
      todayMatches: 'aujourdhui',
      nextMatches: 'matchs suivantes',
      playedMatches: 'matchs joués',
      date: '${}u',
      vs: 'vs',
      topMatch: 'TOPPER',
      degradationMatch: 'THRILLER',
      previousEncounterScore: 'Score premier tour',
      gotoPreviousEncounter: 'Détails premier tour',
      gotoNextEncounter: 'Details second tour',
      details: 'Details',
      tabs: {
        players: 'Joueurs',
        playersTitle: 'Notre formation',
        matches: 'Individuel',
        matchesTitle: 'Score individuel',
        report: 'Reportage',
        reportTitle: 'Formulaire de match',
        club: 'Salle',
        clubTitle: 'Leur salle de club',
        scoresheet: 'Formulaire de match',
        opponentsRanking: 'Adversaires',
        opponentsRankingTitle: 'Leur dernières scores',
        opponentsFormationTitle: 'Leur formation',
        admin: 'Dev',
      },
      report: {
        title: 'Reportage de match',
        editTooltip: 'Modifier reportage de match',
        noReport: 'Pas de reportage',
        placeHolder: 'Raconte...',
        reportPosted: 'Reportage de match est sauvé',
        reportWrittenBy: 'par ${}',
        commentsTitle: 'Succession',
        commentsOpenForm: 'Réagir',
        commentsOpenFormConfirm: 'Ajouter commentaire',
        commentsPhoto: 'Ajouté photo',
        commentPosted: 'Ajouté commentaire',
        commentDeleted: 'Supprimé commentaire',
        commentVisible: 'Visible à tout le monde',
      },
      playersVictoryTitle: 'Victoires',
      playersOpponentsTitle: 'Adversaires',
      individual: {
        matchTitle: 'Match',
        setsTitle: 'Sets',
        resultTitle: 'Score',
      },
      opponents: {
        homeTeam: 'Maison',
        awayTeam: 'Dehors',
        vsTeam: 'Contre',
        outcome: 'Score',
        timesPlayed: 'Présences',
        player: 'Jouer',
        playerRanking: '',
        victories: 'Victoires / Défaites',
        formation: 'Formation'
      },
      enemyVictory: '${}vic.',
      club: {
        locationTitle: 'Salle de club',
        locationUnknown: 'Pas connu',
        websiteKnown: 'Visitez website'
      },
      chooseOtherPlayer: 'Mettre autre joueur'
    },
    footer: {
      location: 'Groeneweg 28, 9300 Erembodegem',
      trainingDays: 'Entraînement: di. en do. 20h',
      competitionDays: 'Compétition: ma., wo. en vr. 20h', //  'en za. om 14u' --> niet meer goed op mobile :(
      telephoneNumber: '0495/24 94 20',
      adultMembership: '€92 pour adultes',
      youthMembership: '€52 voor jeunes',
      contact: 'Contactez-nous'
    },
    links: {
      federations: 'Les fédérations',
      vttl: 'VTTL',
      vttlovl: 'VTTL flandre orientale',
      sporta: 'Sporta',
      ittf: 'ITTF',
      ettu: 'ETTU',
      vttlResults: 'Résultats VTTL',
      sportaResults: 'Résultats Sporta',
      varia: 'Varia',
      vttlCalculationOne: 'Calculation de classement VTTL (TTC Sint-Pauwels)',
      vttlCalculationTwo: 'Calculation de classement TTC De Pinte',
      sportaCalculation: 'Calculation de classement Sporta (TTC Sint-Pauwels)',
      francis: 'Francis tafeltennisshop',
      tabletennisDaily: 'TableTennisDaily'
    },
    teamCalendar: {
      downloadExcelFileName: 'Formations',
      match: 'Match',
      score: 'Score',
      position: 'Place',
      name: 'Nom de club',
      matchesWon: 'Victoire',
      matchesLost: 'Défaite',
      matchesDraw: 'Match nul',
      points: 'Points',
      matches: 'Matchs',

      matchesWonBadge: 'Victoires',
      matchesDrawBadge: 'Egalités',
      matchesLostBadge: 'Défaits',

      viewMain: 'Résumé',
      viewMatches: 'Matchs',
      viewRanking: 'Rangschikking',
      playersPicked: 'Formation',
      individual: 'Individuel',
      frenoyResults: 'Résultats Frenoy',
    },
    facts: require('./locales-fr-facts.js')
  },
 timeAgo: {
    prefixAgo: 'il y a',
    prefixFromNow: 'd\'ici',
    suffixAgo: "il y a",
    suffixFromNow: null,
    seconds: 'moins d\'une minute',
    minute: 'une minute',
    minutes: '%d minutes',
    hour: 'une heure',
    hours: '%d heures',
    day: 'un jour',
    days: '%d jours',
    month: 'un mois',
    months: '%d mois',
    year: 'un an',
    years: '%d ans',
    wordSeparator: " ",
    numbers: []
  }
};
