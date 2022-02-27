// Templates
const faqTemplate = require('../templates/faq.html')

const faq = {
  name: 'faq',
  template: faqTemplate,
  props: ['questions'],
  data(): any {
    return {
    }
  },
}

export = faq
