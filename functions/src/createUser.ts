import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

export const createUser = async (user: any) => {
    if (!user || !user.email) throw new Error('Invalid User')

    return db.doc(`users/${user.uid}`).set(user)
}
