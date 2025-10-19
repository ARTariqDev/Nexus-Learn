// Import all configs
import csConfig from './data/cs-config.json'
import physicsConfig from './data/physics-config.json'
import itConfig from './data/it-config.json'
import fmConfig from './data/fm-config.json'
import mathsConfig from './data/maths-config.json'

// Import all data files
import csBooks from '../CS/CS_Books.json'
import csYearly from '../CS/CS_Yearly.json'

import physicsBooks from '../Physics/Physics_Books.json'

import itBooks from '../IT/IT_Books.json'
import itYearly from '../IT/IT_Yearly.json'

import fmBooks from '../FM/FM_Books.json'
import fmSA from '../FM/FM_SA.json'
import fmYearly from '../FM/FM_Yearly.json'

import mathsTopicals from '../Maths/Maths_Topicals.json'

export const subjects = {
  CS: {
    config: csConfig,
    dataFiles: {
      books: csBooks,
      yearly: csYearly
    }
  },
  Physics: {
    config: physicsConfig,
    dataFiles: {
      books: physicsBooks
    }
  },
  IT: {
    config: itConfig,
    dataFiles: {
      books: itBooks,
      yearly: itYearly
    }
  },
  FM: {
    config: fmConfig,
    dataFiles: {
      books: fmBooks,
      sa_resources: fmSA,
      yearly: fmYearly
    }
  },
  Maths: {
    config: mathsConfig,
    dataFiles: {
      p1_topicals: mathsTopicals,
      p3_topicals: mathsTopicals,
      s1_topicals: mathsTopicals
    }
  }
}
