import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {

  constructor(
    private auth: AuthService,
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  googleLogin() {
    this.auth.loginWithGoogle();
    this.dialogRef.close({
      googleLogin: true
    });
  }

  facebookLogin() {
    this.auth.loginWithFacebook();
    this.dialogRef.close({
      facebookLogin: true
    });
  }

}
