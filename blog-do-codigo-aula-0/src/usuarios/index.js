const middlewaresAutenticacao = require('./middlewaresAutenticacao');

module.exports = {
  rotas: require('./usuarios-rotas'),
  controlador: require('./usuarios-controlador'),
  modelo: require('./usuarios-modelo'),
  estategiasAutenticacao: require('./estrategiasAutenticacao'),
  middlewaresAutenticacao: require('./middlewaresAutenticacao')
}