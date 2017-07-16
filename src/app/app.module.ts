import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ClipComponent } from './clip/clip.component';

const appRoutes = <Routes>[
  { path: "clip/:id", component: ClipComponent },
  { path: '', redirectTo: 'clip/129', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ClipComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
