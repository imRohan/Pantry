// Templates
const onboardingTemplate = require('../templates/onboarding.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

const onboarding = {
  name: 'onboarding',
  template: onboardingTemplate,
  props: ['pantryID'],
  data(): any {
    return {
    }
  },
  methods: {
    getStarted(): void {
      this.$emit('change-view', IView.dashboard)
    },
    createSession(): void {
      sessionStorage.setItem('pantry-id', this.pantryID)
    },
  },
  mounted(): void {
    this.createSession()
  },
}

export = onboarding
