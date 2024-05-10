export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      labels: {
        id: 'ID',
        name: 'Name',
        region: 'Region',
        org: 'Organization',
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
        inviteLink: 'Tournament Link',
        randomize: 'Randomize matches',
        reorder: 'Reorder',
      },
      prompts: {
        deleteJudge: 'Delete this judge?',
        deleteAthlete: 'Delete this athlete?',
        deleteTournament: 'Delete this tournament?',
      },
      public: {
        button: {
          open: 'Open',
          qr: 'QR',
        },
        judge: {
          changeButton: 'Change Judge',
          submit: 'Submit',
          total: 'Total',
        }
      }
    },
    fr: {
      labels: {
        name: '',
        region: '',
        adminCode: '',
        techniques: 'Techniques',
        colour: 'Couleur',
        language: 'Langue',
        fontSize: 'Zoom',
      },
      titles: {
        tournaments: '',
        judges: '',
        athletes: '',
      },
      public: {
        button: {
          open: 'Ouvrir',
          qr: 'QR',
        },
        judge: {
          changeButton: 'Changer de juge',
          submit: 'Envoyer',
          total: 'Totale',
        }
      }
    }
  }
}));
