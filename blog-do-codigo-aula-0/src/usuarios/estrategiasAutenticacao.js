const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Usuario = require('./usuarios-modelo')
const bcrypt = require('bcrypt')
const { InvalidArgumentError } = require('../erros')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')
const blocklist = require('../../redis/blocklist-access-token')


function verificaUsuario(usuario){
    if (!usuario){
        throw new InvalidArgumentError('Não existe usuário com esse e-mail')
    }
}

async function verificaSenha(senha, senhaHash){
    const senhaValida = await bcrypt.compare(senha, senhaHash)
    if (!senhaValida){
        throw new InvalidArgumentError('E-mail ou senha inválidos')
    }
}

async function verificaTokenNablocklist(token){
    const tokenNablocklist = await blocklist.contemToken(token)
    if (tokenNablocklist){
        throw new jwt.JsonWebTokenError('Token inválido por logout')
    }
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try{
            const usuario = await Usuario.buscaPorEmail(email)
            verificaUsuario(usuario)
            await verificaSenha(senha, usuario.senhaHash)
            done(null, usuario)
        } catch(erro){
            done(erro)
        }
    })
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try{
                await verificaTokenNablocklist(token)
                const payload = jwt.verify(token, process.env.CHAVE_JWT)
                const usuario = await Usuario.buscaPorId(payload.id)
                done(null, usuario, { token: token })
            } catch(erro){
                done(erro)
            }
        }
    )
)