// https://firebase.google.com/docs/functions/typescript

if(Symbol["asyncIterator"] === undefined) ((Symbol as any)["asyncIterator"]) = Symbol.for("asyncIterator");

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

import * as Stripe from 'stripe';
// const stripe = new Stripe(functions.config().stripe.secret);
const stripe = new Stripe('sk_test_uk0YsGUapOzUY7TH1ni1SUTB00cneBKJSY');

import fetch from 'node-fetch';

export const userCreate = functions.auth.user().onCreate((user: any) => {

    if (!user || !user.uid) throw new Error('Invalid User')

    const providerData = user.providerData && user.providerData[0]

    if (!providerData) throw new Error('No Auth Provider Data')

    const createdTimestamp = admin.firestore.FieldValue.serverTimestamp()

    const random = Math.random().toString().slice(2, 8)

    const username = providerData.displayName.split(' ').join('').substring(0, 4) + `${random}`

    const userData = {
        uid: user.uid,
        email: providerData.email,
        displayName: providerData.displayName,
        photoURL: providerData.photoURL,
        profileUrl: providerData.photoURL,
        providerId: providerData.providerId,
        providerUid: providerData.uid,
        username,
        createdTimestamp,
        membership: 'artist'
    }

    return db.doc(`users/${user.uid}`).set(userData)
})

export const newComment = functions.firestore
    .document('posts/{postId}/comments/{commentId}')
    .onCreate((snap, context) => {
        const newCommentValue = snap.data()

        const { postId, postUserId, username, userId } = newCommentValue

        if (!postUserId) throw new Error('No Post User Id')

        const createdTimestamp = admin.firestore.FieldValue.serverTimestamp()

        const notification = {
            type: 'comment',
            username,
            postId,
            postUserId,
            userId,
            createdTimestamp,
            new: true
        }

        return db.collection(`users/${postUserId}/notifications`).add(notification)
    })

export const replyComment = functions.firestore
    .document('posts/{postId}/comments/{commentId}')
    .onUpdate((change, context) => {
        const { authorReply } = change.after.data()

        if (!authorReply) return Promise.resolve()

        const createdTimestamp = admin.firestore.FieldValue.serverTimestamp()

        const notification = {
            type: 'comment-reply',
            username: authorReply.username,
            postId: authorReply.postId,
            postUserId: authorReply.userId,
            userId: authorReply.sourceCommentUserId,
            originalCommentId: authorReply.sourceCommentId,
            createdTimestamp,
            new: true
        }

        return db.collection(`users/${authorReply.sourceCommentUserId}/notifications`).add(notification)
    })

export const postDelete = functions.firestore
    .document('posts/{postId}')
    .onDelete(async (snapshot, context) => {
        const post = snapshot.data()

        console.log({ postImages: post.images})

        if (!post || !post.images || !post.images.length) {
            console.log('no post images', post)
            return
        }

        if (!post.images[0].thumbnailPathBase || !post.images[0].fileType || !post.images[0].path) {
            console.log('invalid images', post.images)
            return
        }

        const imgPaths: any[] = post.images.map(img => {
            return [
                `${img.path}`,
                `${img.thumbnailPathBase}_100x100.${img.fileType}`,
                `${img.thumbnailPathBase}_250x250.${img.fileType}`,
                `${img.thumbnailPathBase}_500x500.${img.fileType}`
            ]
        })

        function flatten(a) {
            return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
        }

        const paths = flatten(imgPaths)

        const promises = paths.map(p => admin.storage().bucket('plebeian-deli.appspot.com').file(p).delete())

        try {
            await Promise.all(promises)
        } catch (error) {
            console.log({ msg: 'ERROR DELETING IMAGES', error })
            return
        }
    })

export const eventDelete = functions.firestore
    .document('events/{eventId}')
    .onDelete(async (snapshot, context) => {
        const event = snapshot.data()

        if (!event || !event.imagePath || !event.thumbnailStoragePathBase || !event.imageFileType) {
            return
        }

        const storagePaths = [
            `${event.imagePath}`,
            `${event.thumbnailStoragePathBase}_100x100.${event.imageFileType}`,
            `${event.thumbnailStoragePathBase}_250x250.${event.imageFileType}`,
            `${event.thumbnailStoragePathBase}_500x500.${event.imageFileType}`
        ]

        const promises = storagePaths.map(p => admin.storage().bucket('plebeian-deli.appspot.com').file(p).delete())

        try {
            await Promise.all(promises)
        } catch (error) {
            console.log({ msg: 'Error deleting event images', error })
            return
        }
    })

// Create Stripe Seller Account
export const createSellerAccount = functions.https
    .onCall(async (data, context) => {
        if (!context || !context.auth || !context.auth.uid) {
            throw new Error('No Context Auth');
        }

        const userId = context.auth.uid;
        
        const body = {
            client_secret: 'sk_live_CawDzzhk3Z7d0qnQNqojJRsU',
            code: data.code,
            grant_type: 'authorization_code'
        };

        const stripeCredentialsUrl = 'https://connect.stripe.com/oauth/token';

        const res = await fetch(stripeCredentialsUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const stripeRes = await res.json();

        console.log('stripe res', stripeRes)

        if (!stripeRes || stripeRes.error) {
            throw new Error('stripe create seller error');
        }

        return db.doc(`users/${userId}`).update({
            approvedSeller: true,
            stripeConnectData: stripeRes
        });
    })

// Create Stripe Checkout Session
export const createStripeCheckoutSession = functions.https
    .onCall(async (data, context) => {

        const { sellerStripeAccountID, item } = data

        if (!sellerStripeAccountID || !item) {
            throw new Error('Invalid Cloud Function Arguments')
        }

        await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                name: item.name,
                description: item.description,
                amount: item.amount,
                quantity: item.quantity,
                images: [item.thumbnailUrl],
                currency: 'usd'
            }],
            payment_intent_data: {
                application_fee_amount: 1,
                transfer_data: {
                    destination: sellerStripeAccountID,
                },
            },
            success_url: '',
            cancel_url: ''
        })
    })

// Stripe Webhook
export const stripeCheckoutWebhook = functions.https
    .onRequest(async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event: any;

        const endpointSecret = 'Dashboards webhook settings';

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            return res.status(400).send(`Stripe Webhook Error ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;


            const userId = session.client_reference_id;

            const timestamp = new Date();

            // save session
            await db
                .doc(`checkout-sessions/${session.id}`)
                .set({ ...session, timestamp, userId }, { merge: true });
        }

        return res.json({ received: true });
    })





// create connect charge
// export const createConnectCharge = functions.https
//     .onCall(async (data, context) => {
//         if (!context || !context.auth || !context.auth.uid) {
//             throw new Error('No Context Auth');
//         }

//         if (!data.orderType) {
//             throw new Error('No Order Type');
//         }

//         if (!data.postId || !data.postQuantity || !data.price || !data.sellerId || !data.sellerAccountId) {
//             throw new Error('Missing post data or seller account id');
//         }

//         if (!data.source) {
//             throw new Error('No payment source');
//         }

//         const userId = context.auth.uid;

//         const orderType = data.orderType;

//         stripe.charges.create({
//             amount: data.price,
//             currency: 'usd',
//             source: data.source
//         }, {
//             stripe_account: data.sellerAccountId
//         })
//         .then(charge => {
//             console.log(charge);

//             if (orderType === 'post') {
//                 const orderObj = {
//                     buyerId: userId,
//                     sellerId: data.sellerId,
//                     postId: data.postId,
//                     postPrice: data.price,
//                     purchasedTimestamp: new Date(),
//                     paymentRes: charge,
//                     shipped: false,
//                     messages: []
//                 };

//                 // update post quantity
//                 const postUpdateObj = {
//                     quantity: data.postQuantity - 1
//                 };
//             } else if (orderType === 'service') {
//                 // update service obj
//                 const serviceObj = {

//                 };
//             } else {
//                 console.log('WEIRD ORDER TYPE', orderType);
//             }

//             return charge;
//         })
//         .catch(error => {
//             console.log(error);
//             throw new Error('charge error');
//         });
//     });



