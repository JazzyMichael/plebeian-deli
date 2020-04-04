import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private cs: ContactService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    const newContactMessage = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      message: this.contactForm.value.message,
      createdAt: new Date(),
      acknowledged: false,
      acknowledgedBy: ''
    };

    await this.cs.saveMessage(newContactMessage);

    this.contactForm.reset();
    this.snackbar.open('Contact Message Sent!', '', { duration: 5000 });
    this.router.navigateByUrl('/deli');
  }

  isTester(uid: string) {
    return [
      'raKDGj7QGwMpGlED5JQRVDSQZ983',
      'Yg1KGgr6HCUjI1kvdVjlXujwJ7Z2',
      'cZAJAT0Th3Qu4M91Jc2MFqMxsls1',
      'kCmmJ90ZibOW7KrmG27lxYYqnN93'
    ].includes(uid);
  }

}
