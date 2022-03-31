const  middlewareAutenticacao  = require('../usuarios/middlewaresAutenticacao')

module.exports = (req, res, next) => {
    req.estaAutenticado = false
    if (req.get('Authorization')){
        return middlewareAutenticacao.bearer(req, res, next)
    }
    next()
}