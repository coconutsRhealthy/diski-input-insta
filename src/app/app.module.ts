import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DataDirective } from './data/data-input-insta.directive';
import { InputComponent } from './input-page/input-page.component';
import { InstaComponent } from './insta/insta.component';

const routes: Routes = [
    {
      path: 'input',
      component: InputComponent
    },
    {
      path: 'insta',
      component: InstaComponent
    }
]

@NgModule({
  declarations: [
    AppComponent,
    DataDirective,
    InstaComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
