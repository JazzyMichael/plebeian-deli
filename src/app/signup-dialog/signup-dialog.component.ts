import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private analytics: AnalyticsService,
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  googleLogin() {
    this.analytics.loginFromPopupClick();
    this.auth.loginWithGoogle();
    this.dialogRef.close({
      googleLogin: true
    });
  }

  facebookLogin() {
    this.analytics.loginFromPopupClick();
    this.auth.loginWithFacebook();
    this.dialogRef.close({
      facebookLogin: true
    });
  }

}
