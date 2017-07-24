import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ClarityModule } from 'clarity-angular';
import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { NguiMapModule } from "@ngui/map";

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PartnersComponent } from "./partners/partners.component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        PartnersComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        ClarityModule.forRoot(),
        NguiMapModule.forRoot({
            apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyAgMoNJo7ftPFCnX3Ue8qcJVDUsNKMAxQ4'
        }),
        ROUTING
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
