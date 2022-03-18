const redis = require('redis')
const blocklist = redis.createClient({ prefix: 'blocklist:' })
const manipulaLista = require('./manipulaLista')
const manipulaBlockList = manipulaLista(blocklist)

// const { promisify } = require('util')
// const existsAsync = promisify(blocklist.exists).bind(blocklist)
// const setAsync = promisify(blocklist.set).bind(blocklist)
const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')

function geraTokenHash(token){
    return createHash('sha256').update(token).digest('hex')
}

module.exports = {
    adiciona: async token => {
        const dataExpiracao = jwt.decode(token).exp
        const tokenHash = geraTokenHash(token)
        await manipulaBlockList.adiciona(tokenHash, '', dataExpiracao)
    },
    contemToken: async token => {
        const tokenHash = geraTokenHash(token)
        return manipulaBlockList.contemChave(tokenHash)
    }
 }