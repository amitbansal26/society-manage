import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

    private token: String;

    invitation;
    loadedInvite = false;
    accountInfo: FirebaseObjectObservable<any>;

    constructor(private af: AngularFire, private route: ActivatedRoute) { }

    ngOnInit() {
        // get the token from the url
        this.route.params.forEach((params: Params) => {
            this.token = params['token'];
            if (this.token) {
                console.log('[Join] looking up invitation for token: ' + this.token);

                // Look up the corresponding invite to the token
                this.af.database.object('invitations/' + this.token)
                    .subscribe(
                        data => {                       // If there is an invitation, show it
                            this.invitation = data;
                            this.loadedInvite = true;
                        },
                        err => {                        // If there is not an invitation, say so
                            console.log(err);
                            this.loadedInvite = true;
                        }
                    );
            }
        });

        // Check whether the logged in user is eligible for a membership connect
        this.route.data.forEach((data: { auth: any }) => {
            if (data.auth) {
                let auth = data.auth.auth;
                this.accountInfo = this.af.database.object('/users/' + auth.uid);   // info including membership & token

                if (this.token) {
                    this.af.database.object('/users/' + auth.uid + '/join_token')       // Write the temp token to the user info
                        .set(this.token);
                }
            }
        });
    }

    acceptInvite() {
        // Make accept invite writes in the database
    }
}
