import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ApplicationComponent } from './pages/application/application.component';
import { HomeComponent } from './pages/home/home.component';
import { NotesComponent } from './pages/application/notes/notes.component';
import { LinksComponent } from './pages/application/links/links.component';
import { LinkTreeComponent } from './pages/link-tree/link-tree.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'app',
    component: ApplicationComponent,
  },
  {
    path: 'app/notes',
    component: NotesComponent
  },
  {
    path: 'app/links',
    component: LinksComponent
  },
  {
    path: 'links/:linkTreeId',
    component: LinkTreeComponent,
  },
  {
    path: '**',
    redirectTo: 'app',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
