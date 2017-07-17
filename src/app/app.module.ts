import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ClipComponent } from './clip/clip.component';
import { SceneViewComponent } from './scene-view/scene-view.component';
import { ClipBoundaryComponent } from './clip-boundary/clip-boundary.component';

const appRoutes = <Routes>[
  { path: "clip/:id", component: ClipComponent },
  { path: '', redirectTo: 'clip/129', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ClipComponent,
    SceneViewComponent,
    ClipBoundaryComponent
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
