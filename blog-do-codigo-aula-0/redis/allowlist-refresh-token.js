const redis = require('redis')
const manipulaLista = require('./manipulaLista')
const allowlist = redis.createClient({prefix:'allowlist-refresh-token:'})

module.exports = manipulaLista(allowlist)