import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InputComponent } from './input-page/input-page.component';
import { InstaComponent } from './insta/insta.component';
import { InstaCarouselComponent } from './insta-carousel/insta-carousel.component';

const routes: Routes = [
    {
      path: 'input',
      component: InputComponent
    },
    {
      path: 'insta',
      component: InstaComponent
    },
    {
      path: 'insta-carousel',
      component: InstaCarouselComponent
    }
]

@NgModule({
  declarations: [
    AppComponent,
    InstaComponent,
    InstaCarouselComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
