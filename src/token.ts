import crypto from 'crypto'

export class Token {
    time!: number
    token!: string

    private constructor() { }

    static async new() {
        const token = new Token()
        token.time = Date.now()
        token.token = await Token.generateToken()

        return token
    }

    private static async generateToken(): Promise<string> {
        const hash = crypto.createHash('sha256')
        const rondom = crypto.randomInt(281474976710655 /* Max number for crypto.randomInt */)

        const token = hash.update('' + Date.now() + rondom).digest('base64')

        return token
    }
}

const TOKEN_EXPIRE_SECONDS = 600
let tokens: Token[] = []

export async function add(token: Token): Promise<void> {
    tokens.push(token)
    dropExpired()
    console.log('tokens ' + tokens.length)
}

async function dropExpired() {
    tokens = tokens.filter(it => it.time + TOKEN_EXPIRE_SECONDS * 1000 > Date.now())
}

export async function revoke(token: string): Promise<void> {
    const index = tokens.findIndex(it => it.token == token)
    if (index >= 0) tokens.splice(index, 1)
}

export async function match(token: string): Promise<boolean> {
    const found = tokens.find(it =>
        it.token == token &&
        it.time < Date.now() &&
        it.time + TOKEN_EXPIRE_SECONDS * 1000 > Date.now()
    )

    return Boolean(found)
}
