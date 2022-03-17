const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken')
const blacklist = require('../../redis/manipulaBlacklist')

function criaTokenJWT(usuario){
  const payload = {
    id: usuario.id
  }
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn:'15m'}) 
  return token
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });
      // tratado separadamente para ser transformado em hash antes de ser guardado
      await usuario.adicionaSenha(senha)

      await usuario.adiciona();

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

  login: (req, res) => {
    // token gerado e incluído na resposta
    const token = criaTokenJWT(req.user)
    res.set('Authorization', token)
    res.status(204).send()
  },

  logout: async (req, res) => {

    try{
      // before being invoked here, req.token was setted inside the bearer strategy, it's not the pure content of the original request
      const token =  req.token
      // in case of logout before the token is expired, the token is sent to the blacklist
      // and stays there until expired
      // using a token requires it not to be expired nor in blacklist
      await blacklist.adiciona(token)
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
