import express from 'express'
import cookieParser from 'cookie-parser'
import firebase from 'firebase'
import { add, match, revoke, Token } from './token'

// @ts-ignore firebase.json is not in the src directory
import firebaseConfig from '../firebase.json'
firebase.initializeApp(firebaseConfig)

import { like, isReady, getLikes } from './likes'


const app = express()
app.use(cookieParser())

app.use('*', async (req, res, next) => {
    if (!isReady) {
        res.sendStatus(500)
        return
    }
    next()
})

app.use('/event/', async (req, res, next) => {
    await revoke(req.cookies['X-CSRF-Token'])
    const token = await Token.new()
    await add(token)
    res.cookie('X-CSRF-Token', token.token)
    next()
})

app.get('/api/like', async (req, res) => {
    res.send(await getLikes())
})

app.post('/api/like/:eventId', async (req, res) => {
    const token = req.cookies['X-CSRF-Token']
    const isRightToken = await match(token)
    if (!isRightToken) {
        res.sendStatus(403)
        return
    }

    await like(req.params['eventId'])
    await revoke(token)
    res.sendStatus(200)
})

app.use(express.static('./site'))

app.listen(process.env.PORT || 8080, () => {
    console.log('Started')
})
