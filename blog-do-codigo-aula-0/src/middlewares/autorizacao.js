module.exports = (cargosObrigatorios) =>  (req, res, next) => {
    req.user.cargo = 'editor'
    if (cargosObrigatorios.indexOf(req.user.cargo) === -1){
        res.status(403).end()
        return
    }
    next()
}