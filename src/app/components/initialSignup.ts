// Templates
const initialSignupTemplate = require('../templates/initialSignup.html')

const initialSignup = {
  name: 'initialSignup',
  template: initialSignupTemplate,
  data(): any {
    return {
      email: null,
    }
  },
  methods: {
    showReCaptcha() {
      this.$emit('show-recaptcha')
    },

    storeEmail() {
      this.$emit('store-email', this.email)
    },

    signupValid() {
      // eslint-disable-next-line max-len
      const _emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return _emailRegix.test(String(this.email).toLowerCase())
    },
  },
}

export = initialSignup
