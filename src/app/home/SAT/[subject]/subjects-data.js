// Import config
import satConfig from './data/sat-config.json'

// Import data file
import satData from '../SAT.json'

export const subjects = {
  english: {
    config: {
      ...satConfig,
      subject: 'SAT - English',
      sections: satConfig.sections.filter(s => s.id === 'english')
    },
    dataFiles: {
      english: satData
    }
  },
  maths: {
    config: {
      ...satConfig,
      subject: 'SAT - Maths',
      sections: satConfig.sections.filter(s => s.id === 'maths')
    },
    dataFiles: {
      maths: satData
    }
  },
  combined: {
    config: {
      ...satConfig,
      subject: 'SAT - Combined Resources',
      sections: satConfig.sections.filter(s => s.id === 'combined')
    },
    dataFiles: {
      combined: satData
    }
  }
}
