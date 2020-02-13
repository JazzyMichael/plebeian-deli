import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {

  title: string;
  description: string;

  serviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.createServiceForm();
  }

  createServiceForm() {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  async submit() {
    const user = await this.auth.getCurrentUser();
    const newService = {
      ...this.serviceForm.value,
      createdTimestamp: new Date(),
      userId: user.uid
    };
    await this.serviceService.addService(newService);
    this.snackBar.open('Service created!', '', { duration: 2000 });
    this.auth.navigateToProfile();
  }

}
