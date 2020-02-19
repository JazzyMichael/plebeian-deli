// tslint:disable: max-line-length
import { BrowserModule } from '@angular/platform-browser';
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
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthGuard, AngularFireAuthGuardModule, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// Components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { WidescreenHeaderComponent } from './nav/widescreen-header/widescreen-header.component';
import { MobileHeaderComponent } from './nav/mobile-header/mobile-header.component';
import { SidenavComponent } from './nav/sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';

import { DeliComponent } from './deli/deli.component';
import { DeliHeaderComponent } from './deli/deli-header/deli-header.component';
import { CategorySelectComponent } from './deli/category-select/category-select.component';
import { PostLayoutComponent } from './post-layout/post-layout.component';
import { PostThumbnailComponent } from './post-layout/post-thumbnail/post-thumbnail.component';
import { PostComponent } from './post/post.component';
import { PostImagesComponent } from './post/post-images/post-images.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentListComponent } from './comments/comment-list/comment-list.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { SellerComponent } from './seller/seller.component';
import { ChatComponent } from './chat/chat.component';
import { EventComponent } from './event/event.component';
import { TermsComponent } from './terms/terms.component';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './profile/posts/posts.component';
import { ConnectComponent } from './connect/connect.component';
import { BuyPostComponent } from './buy-post/buy-post.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FaqComponent } from './faq/faq.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { InquireServiceComponent } from './inquire-service/inquire-service.component';
import { UsernameFormComponent } from './username-form/username-form.component';
import { AddressFormComponent } from './address-form/address-form.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectLoggedInToDeli = () => redirectLoggedInTo(['deli']);

const routes: Routes = [
  { path: '', redirectTo: '/deli', pathMatch: 'full' },

  { path: 'exhibitions', loadChildren: () => import('./exhibitions-module/exhibitions-module.module').then(m => m.ExhibitionsModuleModule) },
  { path: 'calendar', loadChildren: () => import('./calendar-module/calendar-module.module').then(m => m.CalendarModuleModule) },
  { path: 'members', loadChildren: () => import('./members-module/members-module.module').then(m => m.MembersModuleModule) },
  { path: 'orders', loadChildren: () => import('./orders-module/orders-module.module').then(m => m.OrdersModuleModule), canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },

  { path: 'deli', component: DeliComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToDeli } },

  { path: 'new-post', component: CreatePostComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'new-service', component: CreateServiceComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'new-event', component: CreateEventComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },

  { path: 'post/:id', component: PostComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'purchase/:id', component: BuyPostComponent },
  { path: 'service/:id', component: InquireServiceComponent },

  { path: 'faq', component: FaqComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'seller', component: SellerComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'connect', component: ConnectComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'notifications', component: NotificationsComponent },

  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin} },
  { path: ':username', component: ProfileComponent },
  { path: '**', redirectTo: '/deli', pathMatch: 'full' }
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
    ChatComponent,
    EventComponent,
    UsernameFormComponent,
    SellerComponent,
    ConnectComponent,
    BuyPostComponent,
    TermsComponent,
    CreatePostComponent,
    CreateServiceComponent,
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
    CreateEventComponent,
    InquireServiceComponent
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
    AngularFireAuthGuardModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule
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
