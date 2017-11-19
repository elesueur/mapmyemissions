import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ClarityModule } from 'clarity-angular';
import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { NguiMapModule } from "@ngui/map";
import { ReCaptchaModule } from 'angular2-recaptcha';
import { FacebookModule } from 'ngx-facebook';

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PartnersComponent } from "./partners/partners.component";
import { ResourcesComponent } from "./resources/resources.component";
import { FeedbackComponent } from "./feedback/feedback.component";

import { GoogleAnalyticsEventsService } from "./providers/google-analytics.provider";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        PartnersComponent,
        ResourcesComponent,
        FeedbackComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        ClarityModule.forRoot(),
        NguiMapModule.forRoot({
            apiUrl: 'https://maps.google.com/maps/api/js?libraries=visualization,places,drawing&key=AIzaSyAgMoNJo7ftPFCnX3Ue8qcJVDUsNKMAxQ4'
        }),
        ReCaptchaModule,
        ROUTING,
        FacebookModule.forRoot()
    ],
    providers: [
        GoogleAnalyticsEventsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
