export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    en: {
      labels: {
        name: 'Name',
        region: 'Region',
        rank: 'Rank',
        adminCode: 'Admin Code',
      },
      titles: {
        tournaments: 'Tournaments',
        judges: 'Judges',
        athletes: 'Athletes',
      },
      buttons: {
        logout: 'Logout',
        changeJudge: 'Change Judges',
        createTournament: 'Create Tournament',
        addJudge: 'Add Judge',
        addAthlete: 'Add Athlete',
        submit: 'Submit',
      },
      prompts: {
        deleteJudge: 'Delete this judge?',
        deleteAthlete: 'Delete this athlete?',
        deleteTournament: 'Delete this tournament?',
      }
    },
    fr: {
      adminCodeLabel: '',
      labels: {
        name: '',
        region: '',
      },
      titles: {
        tournaments: '',
        judges: '',
        athletes: '',
      },
    }
  }
}));
