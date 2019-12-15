import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { environment } from '../environments/environment';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  hasCustomClaim
} from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';

// Components
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ExhibitionsComponent } from './exhibitions/exhibitions.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MembersComponent } from './members/members.component';
import { ShopComponent } from './shop/shop.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PrimeCutsComponent } from './prime-cuts/prime-cuts.component';
import { DeliComponent } from './deli/deli.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './profile/posts/posts.component';
import { LoginComponent } from './login/login.component';
import { PostComponent } from './post/post.component';
import { InfoComponent } from './info/info.component';
import { EventsComponent } from './profile/events/events.component';
import { ArtistsComponent } from './profile/artists/artists.component';
import { ChatComponent } from './chat/chat.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StudioViewerComponent } from './prime-cuts/studio-viewer/studio-viewer.component';
import { PrimePostComponent } from './prime-post/prime-post.component';
import { EventComponent } from './event/event.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { UsernameFormComponent } from './username-form/username-form.component';
import { SellerComponent } from './seller/seller.component';
import { ConnectComponent } from './connect/connect.component';
import { BuyPostComponent } from './buy-post/buy-post.component';
import { TermsComponent } from './terms/terms.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ServicesComponent } from './profile/services/services.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { InquireFormComponent } from './inquire-form/inquire-form.component';
import { OrdersComponent } from './orders/orders.component';

// 3rd Party Modules
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuillModule } from 'ngx-quill';
import { NgxMasonryModule } from 'ngx-masonry';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ViewingServiceComponent } from './viewing-service/viewing-service.component';
import { ServicePaymentComponent } from './orders/service-payment/service-payment.component';
import { BoughtServicesComponent } from './orders/bought-services/bought-services.component';
import { SoldServicesComponent } from './orders/sold-services/sold-services.component';
import { SoldPostsComponent } from './orders/sold-posts/sold-posts.component';
import { BoughtPostsComponent } from './orders/bought-posts/bought-posts.component';
import { NewPrimePostComponent } from './new-prime-post/new-prime-post.component';
import { PostLayoutComponent } from './prime-cuts/post-layout/post-layout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentListComponent } from './comments/comment-list/comment-list.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { FaqComponent } from './faq/faq.component';
import { CollectPaymentComponent } from './collect-payment/collect-payment.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
import { ChoosePlanComponent } from './choose-plan/choose-plan.component';
import { AddressFormComponent } from './address-form/address-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'prime-cuts', component: PrimeCutsComponent },
  { path: 'deli', component: DeliComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'members', component: MembersComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'info', component: InfoComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'seller', component: SellerComponent, ...canActivate(redirectUnauthorizedTo(['/login'])) },
  { path: 'subscriptions', redirectTo: '/about?subscriptions=true', pathMatch: 'full' },
  { path: 'prime-cuts/:id', component: PrimePostComponent },
  { path: 'new-prime-post', component: NewPrimePostComponent, ...canActivate(redirectUnauthorizedTo(['/login'])) },
  { path: 'post/:id', component: PostComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'purchase/:id', component: BuyPostComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'connect', component: ConnectComponent, ...canActivate(redirectUnauthorizedTo(['/login'])) },
  { path: ':username', component: ProfileComponent },
  { path: '**', redirectTo: '/prime-cuts', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ExhibitionsComponent,
    CalendarComponent,
    MembersComponent,
    ShopComponent,
    SubscriptionsComponent,
    PrimeCutsComponent,
    DeliComponent,
    NavComponent,
    FooterComponent,
    ProfileComponent,
    LoginComponent,
    PostsComponent,
    PostComponent,
    InfoComponent,
    EventsComponent,
    ArtistsComponent,
    ChatComponent,
    CheckoutComponent,
    StudioViewerComponent,
    PrimePostComponent,
    EventComponent,
    PaymentFormComponent,
    UsernameFormComponent,
    SellerComponent,
    ConnectComponent,
    BuyPostComponent,
    TermsComponent,
    CreatePostComponent,
    ServicesComponent,
    CreateServiceComponent,
    InquireFormComponent,
    OrdersComponent,
    ViewingServiceComponent,
    ServicePaymentComponent,
    BoughtServicesComponent,
    SoldServicesComponent,
    SoldPostsComponent,
    BoughtPostsComponent,
    NewPrimePostComponent,
    PostLayoutComponent,
    NotificationsComponent,
    CommentsComponent,
    CommentListComponent,
    CommentFormComponent,
    SignupDialogComponent,
    FaqComponent,
    CollectPaymentComponent,
    SignupSuccessComponent,
    ChoosePlanComponent,
    AddressFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    PdfViewerModule,
    NgxHmCarouselModule,
    NgxMasonryModule,
    InfiniteScrollModule,
    QuillModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  exports: [
    MaterialModule
  ],
  entryComponents: [
    InquireFormComponent,
    SignupDialogComponent
  ],
  providers: [
    AngularFireAuthGuard,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
