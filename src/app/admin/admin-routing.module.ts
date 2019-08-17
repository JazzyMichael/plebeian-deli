import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { MoreComponent } from './more/more.component';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'new-post', loadChildren: () => import('./new-post/new-post.module').then(m => m.NewPostModule) },
    { path: 'featured', loadChildren: () => import('./featured/featured.module').then(m => m.FeaturedModule) },
    { path: 'exhibitions', loadChildren: () => import('./exhibitions/exhibitions.module').then(m => m.ExhibitionsModule) },
    { path: 'studios', loadChildren: () => import('./studios/studios.module').then(m => m.StudiosModule) },
    { path: 'promo-codes', loadChildren: () => import('./promo-codes/promo-codes.module').then(m => m.PromoCodesModule) },
    { path: 'store', loadChildren: () => import('./store/store.module').then(m => m.StoreModule) },
    { path: 'more', component: MoreComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
