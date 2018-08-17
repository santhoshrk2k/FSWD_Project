// Decorators
import { NgModule } from '@angular/core';

// Modules
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/landing/home/home.component';

// Guards
import { IsAnonymousGuard } from './core/guards/is-anonymous.guard';

const routes: Routes = [
  {
    path: 'user',
    canLoad: [IsAnonymousGuard],
    loadChildren: './components/user/user.module#UserModule'
  },
  {
    path: 'book',
    loadChildren: './components/book/book.module#BookModule'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
