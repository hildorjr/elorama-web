import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { ApplicationComponent } from './pages/application/application.component';
import { NotesComponent } from './pages/application/notes/notes.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';
import { HomeComponent } from './pages/home/home.component';
import { LinksComponent } from './pages/application/links/links.component';
import { LinkTreeComponent } from './pages/link-tree/link-tree.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ApplicationComponent,
    NotesComponent,
    LinksComponent,
    LanguageSwitchComponent,
    HomeComponent,
    LinkTreeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    ColorPickerModule,
    LoadingBarHttpClientModule,
    MarkdownModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en-US',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
