export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      labels: {
        id: 'ID',
        name: 'Name',
        region: 'Region',
        rank: 'Rank',
        actions: 'Actions',
        adminCode: 'Admin Code',
        techniques: 'Techniques',
        scores: 'Scores',
        total: 'Total',
        colour: 'Colour',
        language: 'Language',
        fontSize: 'Zoom',
        uke: 'Uke',
        tori: 'Tori',
      },
      titles: {
        tournaments: 'Tournaments',
        judges: 'Judges',
        athletes: 'Athletes',
      },
      buttons: {
        logout: 'Logout',
        changeJudge: 'Change Judges',
        createTournament: 'Add Tournament',
        addJudge: 'Add Judge',
        addAthlete: 'Add Athlete',
        submit: 'Submit',
        save: 'Save',
        cancel: 'Cancel',
        makeCopy: 'Make a copy',
        addMat: 'Add Mat',
        editMat: 'Edit Mat',
        deleteMat: 'Delete Mat',
        addGroup: 'Add Group',
        editGroup: 'Edit Group',
        deleteGroup: 'Delete Group',
        addMatch: 'Add Match',
        editMatch: 'Edit Match',
        deleteMatch: 'Delete Match',
        results: 'Results',
        inviteLink: 'View invite link',
        randomize: 'Randomize matches',
        reorder: 'Reorder',
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
