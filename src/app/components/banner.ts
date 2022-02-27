// Templates
const bannerTemplate = require('../templates/banner.html')

const banner = {
  name: 'banner',
  template: bannerTemplate,
  props: ['promo'],
  data(): any {
    return {
      visible: true,
    }
  },
  methods: {
    clickedCTA(): void {
      this.$emit('cta-clicked')
    },
    hide(): void {
      this.visible = false
    },
  },
}

export = banner
