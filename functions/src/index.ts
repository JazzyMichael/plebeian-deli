// https://firebase.google.com/docs/functions/typescript

if(Symbol["asyncIterator"] === undefined) ((Symbol as any)["asyncIterator"]) = Symbol.for("asyncIterator");

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

import * as Stripe from 'stripe';
// const stripe = new Stripe(functions.config().stripe.secret);
const stripe = new Stripe('sk_live_CawDzzhk3Z7d0qnQNqojJRsU');

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









// when new users are created in firestore,
// create a stripe customer for that user
// export const createStripeCustomer = functions.auth
//     .user()
//     .onCreate(async (userRecord, context) => {
//         const firebaseUID: string = userRecord.uid;
//         const firebaseEmail: string = userRecord.email;

//         const customer = await stripe.customers.create({
//             email: firebaseEmail,
//             metadata: { firebaseUID }
//         });

//         return db.doc(`users/${firebaseUID}`).set({
//             stripeId: customer.id
//         }, { merge: true });
//     });








// add payment source (credit card) to stripe customer for user
// subscribe user to plan
// update user document
// export const startSubscription = functions.https
//     .onCall(async (data, context) => {
//         if (!context || !context.auth || !context.auth.uid) {
//             throw new Error('No Context Auth');
//         }

//         const userId = context.auth.uid;
//         const userDoc = await db.doc(`users/${userId}`).get();
//         const user = userDoc.data();

//         if (!user || !user.stripeId) {
//             throw new Error('No User or Stripe Account');
//         }

//         const source = await stripe.customers.createSource(user.stripeId, {
//             source: data.source
//         });

//         if (!source) {
//             throw new Error('Stripe failed to attach card');
//         }

//         const sub = await stripe.subscriptions.create({
//             customer: user.stripeId,
//             items: [{ plan: data.planId }],
//             coupon: data.promoCode || ''
//         });

//         return db.doc(`users/${userId}`).set({
//             status: sub.status,
//             subscriptionId: sub.id,
//             itemId: sub.items.data[0].id,
//             membership: data.planName
//         }, { merge: true });
//     });


// seller account
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
    });


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


// export const signupCheckoutSession = functions.https
//     .onCall(async (data, context) => {

//         if (!data || !context || !context.auth) {
//             throw new Error('Invalid Request');
//         }

//         const membership = data.membership;

//         const userId = context.auth.uid;

//         const customerId = data.customerId || '';

//         let sessionObj: any;

//         // create payment session
//         if (data.paymentCheckout && data.item) {
//             sessionObj = {
//                 mode: 'payment',
//                 payment_method_types: ['card'],
//                 success_url: `https://plebeiandeli.art/signup-success?membership=${membership}&session_id={CHECKOUT_SESSION_ID}`,
//                 cancel_url: 'https://plebeiandeli.art/about',
//                 customer: customerId,
//                 client_reference_id: userId,
//                 line_items: [
//                     {
//                         name: data.item.name,
//                         amount: data.item.amount,
//                         quantity: 1,
//                         currency: 'usd',
//                         description: data.item.description,
//                         images: ['https://www.plebeiandeli.art/assets/images/b35-ticket-logo.png']
//                     }
//                 ]
//             };
//         }

//         // create subscription session
//         if (data.subscriptionCheckout && data.planId) {
//             sessionObj = {
//                 mode: 'subscription',
//                 payment_method_types: ['card'],
//                 success_url: `https://plebeiandeli.art/signup-success?membership=${membership}&session_id={CHECKOUT_SESSION_ID}`,
//                 cancel_url: 'https://plebeiandeli.art/about',
//                 customer: customerId,
//                 client_reference_id: userId,
//                 subscription_data: {
//                     items: [{ plan: data.planId }],
//                     trial_period_days: 30,
//                     metadata: { membership }
//                 }
//             };
//         }

//         if (!sessionObj) {
//             console.log('NO SESSION!');
//             return;
//         }

//         const session = await stripe.checkout.sessions.create(sessionObj);

//         console.log('SESSION ID', session.id);

//         await db
//             .doc(`users/${userId}`)
//             .update({ signupSessionId: session.id });

//         return session.id;
//     });

// export const stripeCheckoutWebhook = functions.https
//     .onRequest(async (req, res) => {
//         const sig = req.headers['stripe-signature'];

//         let event: any;

//         const endpointSecret = 'Dashboards webhook settings';

//         try {
//             event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//         } catch (err) {
//             const msg = `Webhook Error ${err.message}`;
//             return res.status(400).send(msg);
//         }

//         if (event.type === 'checkout.session.completed') {
//             const session = event.data.object;

//             const artistRegex = new RegExp('membership=artist');

//             const galleryRegex = new RegExp('membership=gallery');

//             const membership = artistRegex.test(session.success_url) ? 'artist' : galleryRegex.test(session.success_url) ? 'gallery' : '';

//             const userId = session.client_reference_id;

//             const timestamp = new Date();

//             if (membership) {
//                 // update user membership
//                 await db
//                     .doc(`users/${userId}`)
//                     .update({ membership });
//             } else {
//                 // update orders
//             }

//             // save session
//             await db
//                 .doc(`checkout-sessions/${session.id}`)
//                 .set({ ...session, timestamp, userId }, { merge: true });
//         }

//         return res.json({ received: true });
//     })