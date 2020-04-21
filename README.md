# Update 4/7/20
I am no longer project is on hold, feel free to contribute!

# Plebeian Deli

Latest Stable Releases of Angular, Material, Firebase, & PWA spec

## A Network for Artists and Galleries

Marketplace platform built with Stripe.

Latest Stable Release of Angular & Firebase

### File Structure
- Pages contains components for single routes or pages (login, post view, etc...)
- Sections contains routing modules with multiple pages for each section (orders, messages, etc...)
- Components contains re-usable components provided in the root module
- Nav is the primary navigation container for mobile & desktop (sidenav, headers)
- Material contains theming and material design components
- Services contains Angular Services, all provided in root

### Third Party NPM Packages
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
