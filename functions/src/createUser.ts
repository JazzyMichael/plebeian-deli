export const createUser = async (user: any, db: FirebaseFirestore.Firestore) => {
    if (!user || !user.email) throw new Error('Invalid User')

    return db.doc(`users/${user.uid}`).set(user)
}
