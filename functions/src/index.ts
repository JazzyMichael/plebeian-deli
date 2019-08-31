// https://firebase.google.com/docs/functions/typescript

if(Symbol["asyncIterator"] === undefined) ((Symbol as any)["asyncIterator"]) = Symbol.for("asyncIterator");

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

import * as Stripe from 'stripe';
const stripe = new Stripe(functions.config().stripe.secret);
// const stripe = new Stripe('sk_live_CawDzzhk3Z7d0qnQNqojJRsU');

import fetch from 'node-fetch';



// when new users are created in firestore,
// create a stripe customer for that user
export const createStripeCustomer = functions.auth
    .user()
    .onCreate(async (userRecord, context) => {
        const firebaseUID: string = userRecord.uid;
        const firebaseEmail: string = userRecord.email;

        const customer = await stripe.customers.create({
            email: firebaseEmail,
            metadata: { firebaseUID }
        });

        return db.doc(`users/${firebaseUID}`).update({
            stripeId: customer.id
        });
    });





// add payment source (credit card) to stripe customer for user
// subscribe user to plan
// update user document
export const startSubscription = functions.https
    .onCall(async (data, context) => {
        if (!context || !context.auth || !context.auth.uid) {
            throw new Error('No Context Auth');
        }

        const userId = context.auth.uid;
        const userDoc = await db.doc(`users/${userId}`).get();
        const user = userDoc.data();

        if (!user || !user.stripeId) {
            throw new Error('No User or Stripe Account');
        }

        const source = await stripe.customers.createSource(user.stripeId, {
            source: data.source
        });

        if (!source) {
            throw new Error('Stripe failed to attach card');
        }

        const sub = await stripe.subscriptions.create({
            customer: user.stripeId,
            items: [{ plan: data.planId }],
            coupon: data.promoCode || ''
        });

        return db.doc(`users/${userId}`).update({
            status: sub.status,
            subscriptionId: sub.id,
            itemId: sub.items.data[0].id,
            membership: data.planName
        });
    });


// seller account
export const createSellerAccount = functions.https
    .onCall(async (data, context) => {
        if (!context || !context.auth || !context.auth.uid) {
            throw new Error('No Context Auth');
        }

        const userId = context.auth.uid;
        
        const body = {
            client_secret: 'sk_test_EivFXuy6nOXJYZ7ScayMi2rK',
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
//         //


//         stripe.charges.create({
//             amount: data.amount,
//             currency: 'usd',
//             source: data.source
//         }, {
//             stripe_account: 'seller stripe account id'
//         })
//         .then(charge => {
//             console.log(charge);
//             return charge;
//         })
//         .catch(error => {
//             console.log(error);
//             throw new Error('charge error');
//         });
//     });