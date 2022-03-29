const AccessControl = require('accesscontrol')
const controle = new AccessControl()

controle.grant('assinante').readAny('post') // checar se é necessário passar o segundo parâmetro com os atributos que podem ser lidos

module.exports = controle