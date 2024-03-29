const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require('./middlewaresAutenticacao');
const autorizacao = require('../middlewares/autorizacao');

module.exports = app => {

  app
    .route('/usuario/atualiza_token')
    // usuariosControlador.login já faz o trabalho de gerar os 2 tokens
    .post(middlewaresAutenticacao.refresh, usuariosControlador.login)

  app
    .route('/usuario/login')
    .post(middlewaresAutenticacao.local, usuariosControlador.login)

  app
    .route('/usuario/logout')
    .post([middlewaresAutenticacao.bearer, middlewaresAutenticacao.refresh], usuariosControlador.logout)
    
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(
      [middlewaresAutenticacao.bearer, autorizacao('usuario', 'ler')],
      usuariosControlador.lista
    );
    

  app
    .route('/usuario/verifica_email/:token')
    .get(middlewaresAutenticacao.verificacaoEmail, usuariosControlador.verificaEmail)

  app
    .route('/usuario/:id')
    .delete(middlewaresAutenticacao.bearer, usuariosControlador.deleta);
};
