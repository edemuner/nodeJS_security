const { middlewareAutenticacao } = require('../usuarios')

module.exports = (req, res, next) => {
    if (req.get('Authorization')){
        req.estaAutenticado
        return middlewareAutenticacao.bearer(req, res, next)
    }
    next()
}