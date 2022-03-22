const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const tokens = require('./tokens')
const {EmailVerificacao} = require('./emails')


module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log(req.body)

    try {
      const usuario = new Usuario({
        nome,
        email
      });
      // tratado separadamente para ser transformado em hash antes de ser guardado
      await usuario.adicionaSenha(senha)

      await usuario.adiciona();

      const endereco =  'localhost:3000/usuario/verifica_email/' + usuario.id
      const emailVerificacao = new EmailVerificacao(usuario, endereco)

      emailVerificacao.enviaEmail().catch(console.log)

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: async (req, res) => {
    try{
      // token gerado e incluído na resposta
      const accessToken = tokens.access.cria(req.user.id)
      const refreshToken = await tokens.refresh.cria(req.user.id)
      res.set('Authorization', accessToken)
      res.status(200).json({refreshToken:refreshToken})

    } catch(erro){
      res.status(500).json({erro:erro.message})
    }
  },

  logout: async (req, res) => {

    try{
      // before being invoked here, req.token was setted inside the bearer strategy, it's not the pure content of the original request
      const token =  req.token
      // in case of logout before the token is expired, the token is sent to the blocklist
      // and stays there until expired
      // using a token requires it not to be expired nor in blocklist
      await tokens.access.invalida(token)
      res.status(204).send()
    }catch(erro){
      res.status(500).json({erro: erro.message})
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
