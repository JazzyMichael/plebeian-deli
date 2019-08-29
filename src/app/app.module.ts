import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { environment } from '../environments/environment';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
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

// 3rd Party Modules
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuillModule } from 'ngx-quill';
import { CheckoutComponent } from './checkout/checkout.component';
import { StudioViewerComponent } from './prime-cuts/studio-viewer/studio-viewer.component';
import { PrimePostComponent } from './prime-post/prime-post.component';
import { EventComponent } from './event/event.component';

// const adminOnly = map((user: any) => user ? ['admin'] : ['deli']);

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
  { path: 'prime-cuts/:id', component: PrimePostComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInTo(['/'])) },
  { path: 'checkout/:membership', component: CheckoutComponent, ...canActivate(redirectLoggedInTo(['/']))},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: ':username', component: ProfileComponent },
  { path: '**', redirectTo: '/about', pathMatch: 'full' }
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
    EventComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    PdfViewerModule,
    NgxHmCarouselModule,
    QuillModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  exports: [
    MaterialModule
  ],
  providers: [
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
