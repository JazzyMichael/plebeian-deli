// tslint:disable: max-line-length
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { environment } from '../environments/environment';
import { SwiperModule } from 'ngx-swiper-wrapper';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthGuard, AngularFireAuthGuardModule, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// Components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { WidescreenHeaderComponent } from './nav/widescreen-header/widescreen-header.component';
import { MobileHeaderComponent } from './nav/mobile-header/mobile-header.component';
import { SidenavComponent } from './nav/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { DeliComponent } from './pages/deli/deli.component';
import { DeliHeaderComponent } from './pages/deli/deli-header/deli-header.component';
import { CategorySelectComponent } from './pages/deli/category-select/category-select.component';
import { PostLayoutComponent } from './components/post-layout/post-layout.component';
import { PostThumbnailComponent } from './components/post-layout/post-thumbnail/post-thumbnail.component';
import { PostComponent } from './pages/post/post.component';
import { PostImagesComponent } from './pages/post/post-images/post-images.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentListComponent } from './components/comments/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comments/comment-form/comment-form.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/about.component';
import { SellerComponent } from './pages/seller/seller.component';
import { EventComponent } from './pages/event/event.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PostsComponent } from './pages/profile/posts/posts.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { BuyPostComponent } from './pages/buy-post/buy-post.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { FaqComponent } from './pages/faq/faq.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { InquireServiceComponent } from './pages/inquire-service/inquire-service.component';
import { UsernameFormComponent } from './components/username-form/username-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { UsernameComponent } from './pages/username/username.component';
import { FYouComponent } from './f-you/f-you.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectLoggedInToDeli = () => redirectLoggedInTo(['deli']);

const routes: Routes = [
  { path: '', component: FYouComponent },
  { path: '**', component: FYouComponent }
  // { path: '', redirectTo: '/login', pathMatch: 'full' },

  // { path: 'exhibitions', loadChildren: () => import('./pages/exhibitions-module/exhibitions-module.module').then(m => m.ExhibitionsModuleModule) },
  // { path: 'calendar', loadChildren: () => import('./pages/calendar-module/calendar-module.module').then(m => m.CalendarModuleModule) },
  // { path: 'members', loadChildren: () => import('./pages/members-module/members-module.module').then(m => m.MembersModuleModule) },
  // { path: 'orders', loadChildren: () => import('./sections/orders/orders.module').then(m => m.OrdersModule), canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // { path: 'new', loadChildren: () => import('./sections/new/new.module').then(m => m.NewModule), canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // { path: 'messages', loadChildren: () => import('./sections/messages/messages.module').then(m => m.MessagesModule), canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // { path: 'contact', loadChildren: () => import('./sections/contact/contact.module').then(m => m.ContactModule) },

  // { path: 'deli', component: DeliComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToDeli } },
  // { path: 'set-username', component: UsernameComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },

  // { path: 'post/:id', component: PostComponent },
  // { path: 'event/:id', component: EventComponent },
  // { path: 'purchase/:id', component: BuyPostComponent },
  // { path: 'service/:id', component: InquireServiceComponent },

  // { path: 'faq', component: FaqComponent },
  // { path: 'terms', component: TermsComponent },
  // { path: 'seller', component: SellerComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // { path: 'connect', component: ConnectComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // { path: 'notifications', component: NotificationsComponent },

  // { path: 'edit-profile', component: EditProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
  // { path: ':username', component: ProfileComponent },
  // { path: '**', redirectTo: '/deli', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    DeliComponent,
    NavComponent,
    FooterComponent,
    ProfileComponent,
    LoginComponent,
    PostsComponent,
    PostComponent,
    EventComponent,
    UsernameFormComponent,
    SellerComponent,
    ConnectComponent,
    BuyPostComponent,
    TermsComponent,
    PostLayoutComponent,
    NotificationsComponent,
    CommentsComponent,
    CommentListComponent,
    CommentFormComponent,
    FaqComponent,
    AddressFormComponent,
    CategorySelectComponent,
    PostThumbnailComponent,
    DeliHeaderComponent,
    PostImagesComponent,
    FooterBarComponent,
    EditProfileComponent,
    WidescreenHeaderComponent,
    MobileHeaderComponent,
    SidenavComponent,
    InquireServiceComponent,
    UsernameComponent,
    FYouComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SwiperModule
  ],
  exports: [
    MaterialModule
  ],
  providers: [
    AngularFireAuthGuard,
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
