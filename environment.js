import { Constants } from 'expo'

const ENV = {
  dev: {
    databaseUrl: "https://bleacher-tech-vb-8ee23.firebaseio.com/",
    adMobUnitIDSavedGameList: "ca-app-pub-3940256099942544/6300978111",
    adMobUnitIDScorerGameList:"ca-app-pub-3940256099942544/6300978111",
    adMobUnitIDSearchGameList:"ca-app-pub-3940256099942544/6300978111",    
    adMobAppId: "ca-app-pub-9134982336587133~6469499803",
    iosStandaloneAppClientId: "501872305874-aori48d36fm0e5krv4sqg9n3ndm2e4fo.apps.googleusercontent.com"
  },
  staging: {
    databaseUrl: "https://bleacher-tech-vb-a0b51.firebaseio.com/",
    adMobUnitIDSavedGameList: "ca-app-pub-3940256099942544/6300978111",
    adMobUnitIDScorerGameList:"ca-app-pub-3940256099942544/6300978111",
    adMobUnitIDSearchGameList:"ca-app-pub-3940256099942544/6300978111",    
    adMobAppId: "ca-app-pub-9134982336587133~6469499803",
    iosStandaloneAppClientId: "501872305874-aori48d36fm0e5krv4sqg9n3ndm2e4fo.apps.googleusercontent.com"
  },
  prod: {
    databaseUrl: "https://bleacher-tech-vb-583c9.firebaseio.com/",
    adMobUnitIDSavedGameList: "ca-app-pub-9134982336587133/6827983649",
    adMobUnitIDScorerGameList:"ca-app-pub-9134982336587133/5837377741",
    adMobUnitIDSearchGameList:"ca-app-pub-9134982336587133/1131845976",    
    adMobAppId: "ca-app-pub-9134982336587133~6469499803",
    iosStandaloneAppClientId: "501872305874-crvnq10vrhfug3qco7bh3lfmialc3a0l.apps.googleusercontent.com"
  }
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '' || env === 'default') return ENV.dev
  if (env.indexOf('dev') !== -1) return ENV.dev
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('prod') !== -1) return ENV.prod
}


export default getEnvVars(Constants.manifest.releaseChannel)