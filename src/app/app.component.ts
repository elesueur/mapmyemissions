import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private router: Router) {
       this.router.events.subscribe(event => {
           let myWindow: any = window as any;
           if (event instanceof NavigationEnd) {
               myWindow.ga('set', 'page', event.url);
               myWindow.ga('send', 'pageview');
           }
       });
    }
}
