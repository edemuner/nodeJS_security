const postsDao = require('./posts-dao');
const validacoes = require('../validacoes-comuns');

class Post {
  constructor(post) {
    this.titulo = post.titulo;
    this.conteudo = post.conteudo;
    this.autor = post.autor
    this.valida();
  }

  adiciona() {
    return postsDao.adiciona(this);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.titulo, 'título');
    validacoes.campoTamanhoMinimo(this.titulo, 'título', 5);

    validacoes.campoStringNaoNulo(this.conteudo, 'conteúdo');
    validacoes.campoTamanhoMaximo(this.conteudo, 'conteúdo', 140);
  }

  static lista() {
    return postsDao.lista();
  }

  static verPost(id){
    const post = postsDao.verUm(id)
    return post
  }

  static remover(id){
    postsDao.remover(id)
    return
  }
}

module.exports = Post;
