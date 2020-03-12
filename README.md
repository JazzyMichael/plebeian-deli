# Plebeian Deli

Latest Stable Releases of Angular, Material, Firebase, & PWA spec

## A Network for Artists and Galleries

Marketplace platform built with Stripe.

Latest Stable Release of Angular & Firebase

### Third Party NPM Packages

*Last updated: 3/4/20*

- angular-calendar & date-fns for calendar page
- Swiper.js & ngx-swiper-wrapper for carousels
- ngx-infinite-scroll wrapper component for infinite scroll

### Environment
- Angular environment contains public keys for Firebase and Stripe
- Firebase Client SDK and @angular/firebase wrapper library
- Stripe Client SDK from CDN link in index.html

- Firebase Cloud Functions environment contains private keys for stripe
    - firebase functions:config:get
    - firebase functions:config:set stripe.prodscret="prodkey" stripe.testsecret="testkey"
    - firebase functions:config:unset stripe.prodsecret stripe.testsecret
