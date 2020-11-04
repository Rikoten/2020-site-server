import express from 'express'
import cookieParser from 'cookie-parser'
import firebase from 'firebase'
import { add, match, revoke, Token } from './token'

// @ts-ignore firebase.json is not in the src directory
import firebaseConfig from '../firebase.json'
firebase.initializeApp(firebaseConfig)

import { like, isReady as isLikesReady, getLikes } from './likes'
import { isReady as isViewsReady, getViews, addViews } from './views'


const isIntime = () => (
    new Date('Sat, 07 Nov 2020 09:00:00 GMT +9').getTime() <= Date.now() &&
    Date.now() <= new Date('Sat, 07 Nov 2020 20:00:00 GMT +9').getTime()
) || (
    new Date('Sun, 08 Nov 2020 09:00:00 GMT +9').getTime() <= Date.now() &&
    Date.now() <= new Date('Sun, 08 Nov 2020 20:00:00 GMT +9').getTime()
)

const app = express()
app.use(cookieParser())

app.use('*', async (req, res, next) => {
    if (!isLikesReady || !isViewsReady) {
        res.sendStatus(500)
        return
    }
    next()
})

const overTimeRouter = express.Router()

overTimeRouter.use(express.static('./site/overtime'))
overTimeRouter.all('*', (req, res) => {
    res.redirect('/')
})

app.use((req, res, next) => {
    if (!isIntime()) {
        overTimeRouter(req, res, next)
    } else {
        next()
    }
})

app.use('/event/', async (req, res, next) => {
    await revoke(req.cookies['X-CSRF-Token'])
    const token = await Token.new()
    await add(token)
    res.cookie('X-CSRF-Token', token.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    next()
})

app.get('/api/like', async (req, res) => {
    res.send(await getLikes())
})

app.post('/api/like/:eventId', async (req, res) => {
    const id = req.params['eventId']

    const token = req.cookies['X-CSRF-Token']
    const liked = (req.cookies['X-Liked'] ?? '').split(',').find((it: any) => it == id)

    const isRightToken = await match(token)
    if (!isRightToken || liked) {
        res.sendStatus(403)
        return
    }

    await like(id)
    await revoke(token)

    res.cookie('X-Liked', (req.cookies['X-Liked'] ?? '') + ',' + id, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    res.sendStatus(200)
})

app.get('/api/views/:eventId', async (req, res) => {
    const id = req.params['eventId']
    res.send({
        views: await getViews(id)
    })
})

app.use('/event/', async (req, res, next) => {
    const id = req.query.id
    const viewed = (req.cookies['X-Viewed'] ?? '').split(',').find((it: any) => it == id)
    if (viewed) {
        next()
        return
    }

    if (typeof id == 'string') await addViews(id)
    res.cookie('X-Viewed', (req.cookies['X-Viewed'] ?? '') + ',' + id, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    next()
})

app.use(express.static('./site'))

app.use('*', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT || 8080, () => {
    console.log('Started')
})
