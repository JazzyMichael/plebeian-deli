import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from 'src/app/services/service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit, OnDestroy {
  editingService: any;
  serviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private serviceService: ServiceService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.editingService = this.serviceService.editingService || null;
    this.createServiceForm();
  }

  ngOnDestroy(): void {
    this.serviceService.editingService = null;
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
