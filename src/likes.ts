import firebase from 'firebase'

export type Likes = {
    // ユーザー認証をしないため、数だけ管理
    likes: number
}

const firestore = firebase.firestore()

export async function like(id: string) {
    // @ts-expect-error
    const collection = firestore.collection('likes')
    console.log('liked: ' + id)
}
