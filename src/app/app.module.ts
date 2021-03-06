import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { FlashbotsService } from './services/flashbots.service';
import { FormsModule } from '@angular/forms';
import { ErrorAlertComponent } from './components/alerts/error-alert/error-alert.component';
import { HomeComponent } from './components/home/home.component';
import { FormComponent } from './components/form/form.component';



@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    SuccessModalComponent,
    ErrorAlertComponent,
    HomeComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [FormBuilder,FlashbotsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
