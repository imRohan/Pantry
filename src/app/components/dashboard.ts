// External Files
const axios = require('axios')

// Configs
const configs = require('../config.ts')

// Constants
const API_PATH = configs.apiPath

// Templates
const dashboardTemplate = require('../templates/dashboard.html')

// Components
const explorer = require('./explorer.ts')
const login = require('./login.ts')
const banner = require('./banner.ts')

const dashboard = {
  name: 'dashboard',
  template: dashboardTemplate,
  props: ['pantryID'],
  components: {
    explorer,
    login,
    banner,
  },
  data(): any {
    return {
      signedIn: false,
      id: null,
      pantry: null,
      promo: {
        emoji: '🔥',
        snippet: 'Free Stickers?',
        title: 'Fill out our user survey and get free Pantry stickers!',
      },
    }
  },
  methods: {
    async login(pantryID: string): Promise<void> {
      try {
        await this.fetchPantry(pantryID)
        this.createSession()
        this.signedIn = true
      } catch {
        alert('Login Failed. Is your PantryID correct?')
      }
    },
    async refresh(): Promise<void> {
      await this.fetchPantry(this.id)
    },
    async fetchPantry(pantryId: string): Promise<void> {
      const { data } = await axios({
        method: 'GET',
        url: `${API_PATH}/pantry/${pantryId}`,
      })
      this.id = pantryId
      this.pantry = { ...data, id: this.id }
    },
    async loadFromSession(): Promise<void> {
      if (sessionStorage.getItem('pantry-id') !== null) {
        await this.login(sessionStorage.getItem('pantry-id'))
      }
    },
    createSession(): void {
      sessionStorage.setItem('pantry-id', this.id)
    },
    urlPantryID(): string[] {
      return window.location.search.match(/(\?|&)pantryid\=([^&]*)/)
    },
    async loadFromURL(): Promise<void> {
      if (this.urlPantryID() === null) { return }
      const _pantryId = decodeURIComponent(this.urlPantryID()[2])
      await this.login(_pantryId)
    },
    bannerCTAClicked(): void {
      window.location.href = 'https://tally.so/r/m6yPAn'
    },
  },
  mounted(): void {
    this.loadFromSession()
    this.loadFromURL()
  },
}

export = dashboard
