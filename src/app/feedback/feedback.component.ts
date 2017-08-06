import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    styleUrls: ['./feedback.component.scss'],
    templateUrl: './feedback.component.html',
})
export class FeedbackComponent {
    willUse: string = '';
    affectChoice: string = '';
    noWhy: string = '';
    yesWhy: string = '';
    feedback: string = '';
    email: string = '';
    submitted = false;
    canSubmit = false;

    constructor(private http: Http) {}

    submit() {
        this.http.post('/email.php', {
            willUse: this.willUse,
            affectChoice: this.affectChoice,
            noWhy: this.noWhy,
            yesWhy: this.yesWhy,
            feedback: this.feedback,
            email: this.email,
        }).subscribe();
        this.submitted = true;
    }
}
