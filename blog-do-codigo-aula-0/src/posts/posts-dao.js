const db = require('../../database');

module.exports = {

  adiciona: post => {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO posts (
          titulo, 
          conteudo
        ) VALUES (?, ?)
      `,
        [post.titulo, post.conteudo],
        erro => {
          if (erro) {
            return reject('Erro ao adicionar o post!');
          }

          return resolve();
        }
      );
    });
  },

  lista: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM posts`, (erro, resultados) => {
        if (erro) {
          return reject('Erro ao listar os posts!');
        }

        return resolve(resultados);
      });
    });
  },

  verUm: id => {
    return new Promise((resolve, reject) => {
      console.log(id)
      db.get(`SELECT * FROM posts WHERE id = ?`, id, (erro, resultados) => {
        if (erro) {
          return reject('Erro na consulta à base de dados')
        }
        return resolve(resultados)
      })
    })
  }
};
