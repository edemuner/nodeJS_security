const Post = require('./posts-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');

module.exports = {
  adiciona: async (req, res) => {
    try {
      const post = new Post(req.body);
      await post.adiciona();
      
      res.status(201).send(post);
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

  lista: async (req, res) => {
    try {
      const posts = await Post.lista();
      res.send(posts);
    } catch (erro) {
      return res.status(500).json({ erro: erro });
    }
  },

  obterDetalhes: async (req, res) => {
    try{
      const id = req.params.id
      const post = await Post.verPost(id)
      res.status(200).json({post:post})
    } catch(erro){
      res.status(500).json({erro:erro.message})
    }
  },

  remover: (req, res) => {
    console.log('ainda sob implementação')
    res.status(200).end()
  }

};
