import firebase from 'firebase'

export type Views = {
    [eventId: string]: {
        views: number
    }
}

const WRITE_CACHE_SECONDS = 10

let cache: Views = {}
let writeCachedTime = 0

export let isReady = false

const firestore = firebase.firestore()

;(async () => {
    cache = (await firestore.collection('views').doc('views').get()).data() as Views
    isReady = true
    console.log('Views ready')
})()

export async function getViews(eventId: string): Promise<number> {
    return cache[eventId]?.views ?? 0
}

export async function getAllViews(): Promise<Views> {
    return cache
}

export async function addViews(eventId: string): Promise<void>{
    if (!cache[eventId]) cache[eventId] = { views: 0 }
    cache[eventId].views += 1

    if (Date.now() - writeCachedTime > WRITE_CACHE_SECONDS * 1000) {
        console.log('update views firebase')
        await firestore.collection('views').doc('views').set(cache)
        writeCachedTime = Date.now()
    }
}
