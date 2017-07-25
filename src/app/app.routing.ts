import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PartnersComponent } from "./partners/partners.component";
import { ResourcesComponent } from "./resources/resources.component";

export const ROUTES: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'partners', component: PartnersComponent},
    {path: 'resources', component: ResourcesComponent},
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
