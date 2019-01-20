import { Constants } from 'expo'

const ENV = {
  dev: {
    databaseUrl: "https://bleacher-tech-vb-8ee23.firebaseio.com/"
  },
  staging: {
    databaseUrl: "https://bleacher-tech-vb-a0b51.firebaseio.com/"
  },
  prod: {
    databaseUrl: "https://bleacher-tech-vb-583c9.firebaseio.com/"
  }
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.dev
  if (env.indexOf('dev') !== -1) return ENV.dev
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('prod') !== -1) return ENV.prod
}


export default getEnvVars(Constants.manifest.releaseChannel)