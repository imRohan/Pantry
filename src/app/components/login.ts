// Templates
const loginTemplate = require('../templates/login.html')

// Interfaces

const login = {
  name: 'login',
  template: loginTemplate,
  data(): any {
    return {
      id: null,
    }
  },
  methods: {
    idInvalid() {
      return this.id === null
    },
    login(): void {
      this.$emit('login', this.id)
    },
  },
}

export = login
