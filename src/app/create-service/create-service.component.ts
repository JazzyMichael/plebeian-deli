import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {

  serviceForm: FormGroup;
  editingService: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.editingService = this.serviceService.editingService || null;
    this.createServiceForm();
  }

  createServiceForm() {
    this.serviceForm = this.fb.group({
      title: [this.editingService && this.editingService.title || '', Validators.required],
      description: [this.editingService && this.editingService.description || '', Validators.required]
    });
    this.serviceService.editingService = null;
  }

  async submit() {
    const user = await this.auth.getCurrentUser();
    const newService = {
      ...this.serviceForm.value,
      createdTimestamp: new Date(),
      userId: user.uid
    };
    if (this.editingService) {
      await this.serviceService.updateService(this.editingService.serviceId, newService);
      this.snackBar.open('Service Updated!', '', { duration: 2000 });
    } else {
      await this.serviceService.addService(newService);
      this.snackBar.open('Service created!', '', { duration: 2000 });
    }
    this.auth.navigateToProfile();
  }

}
