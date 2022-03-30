const AccessControl = require('accesscontrol')
const controle = new AccessControl()

controle
    .grant('assinante')
        .readAny('post')

    .grant('editor')
        .extend('assinante')
        .createOwn('post')
        .deleteOwn('post')

    .grant('admin')
        .readAny('post')
        .createAny('post')
        .deleteAny('post')
        .readAny('usuario')
        .deleteAny('usuario')

module.exports = controle