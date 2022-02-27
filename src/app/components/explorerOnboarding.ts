// Templates
const explorerOnboardingTemplate = require('../templates/explorerOnboarding.html')

const explorerOnboarding = {
  name: 'explorerOnboarding',
  template: explorerOnboardingTemplate,
  data(): any {
    return {
    }
  },
  methods: {
    loadBasket(): void {
      this.$emit('load-basket')
    },
  },
}

export = explorerOnboarding
