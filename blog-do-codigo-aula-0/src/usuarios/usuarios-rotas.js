const usuariosControlador = require('./usuarios-controlador');
const passport = require('passport')
const middlewaresAutenticacao = require('./middlewaresAutenticacao')

module.exports = app => {

  app
    .route('/usuario/login')
    .post(middlewaresAutenticacao.local, usuariosControlador.login)

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route('/usuario/:id')
    .delete(passport.authenticate('bearer',{ session: false }), usuariosControlador.deleta);
};
