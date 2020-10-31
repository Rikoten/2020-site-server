import firebase from 'firebase'

export type Likes = {
    // ユーザー認証をしないため、数だけ管理
    [eventId: string]: {
        likes: number
    }
}

const WRITE_CACHE_SECONDS = 5

let cache: Likes = {}
let writeCachedTime: number = 0

export let isReady = false

const firestore = firebase.firestore()

;(async () => {
    cache = (await firestore.collection('likes').doc('likes').get()).data() as Likes
    isReady = true
    console.log('likes ready')
})()

export async function getLikes(): Promise<Likes> {
    return cache
}

export async function like(eventId: string): Promise<void> {
    if (!cache[eventId]) cache[eventId] = { likes: 0 }
    cache[eventId].likes += 1

    if (Date.now() - writeCachedTime > WRITE_CACHE_SECONDS * 1000) {
        console.log('firestore')
        await firestore.collection('likes').doc('likes').set(cache)
        writeCachedTime = Date.now()
    }
}
