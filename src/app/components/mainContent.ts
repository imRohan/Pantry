// Templates
const mainContentTemplate = require('../templates/mainContent.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

// Components
const dashboard = require('./dashboard.ts')
const sdk = require('./sdk.ts')
const home = require('./home.ts')
const onboarding = require('./onboarding.ts')
const about = require('./about.ts')

const mainContent = {
  props: ['view'],
  name: 'mainContent',
  components: {
    dashboard,
    sdk,
    home,
    onboarding,
    about,
  },
  template: mainContentTemplate,
  data(): any {
    return {
      pantryID: null,
    }
  },
  methods: {
    changeView(view: typeof IView): void {
      this.$emit('change-view', view)
    },
    displayOnboarding(pantryID: string): void {
      this.pantryID = pantryID
      this.$emit('change-view', IView.created)
    },
  },
}

export = mainContent
