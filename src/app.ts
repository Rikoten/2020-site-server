import express from 'express'
import firebase from 'firebase'
import { resolve as resolvePath} from 'path'
import { add, match, Token } from './token'

// @ts-ignore firebase.json is not in the src directory
import firebaseConfig from '../firebase.json'

firebase.initializeApp(firebaseConfig)

const app = express()

app.use(express.static(resolvePath(__dirname + '/../site')))

app.get('/token', async (req, res) => {
    const token = await Token.new()
    add(token)
    res.send(token.token)
})

app.get('/token/:token', async (req, res) => {
    const token = req.params.token
    res.send(await match(token))
})

app.listen(process.env.PORT || 8080, () => {
    console.log('Started')
})
