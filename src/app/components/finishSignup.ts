// Templates
const finishSignupTemplate = require('../templates/finishSignup.html')

const finishSignup = {
  name: 'finishSignup',
  template: finishSignupTemplate,
  data(): any {
    return {
      name: null,
    }
  },
  methods: {
    storeName() {
      this.$emit('store-name', this.name)
    },
  },
}

export = finishSignup
