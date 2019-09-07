import { Component, OnInit, Input } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InquireFormComponent } from 'src/app/inquire-form/inquire-form.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  @Input() user: any;
  @Input() editable: boolean;

  services$: Observable<any>;

  editing: boolean;
  editingService: any;
  title: string;
  description: string;

  constructor(
    private serviceService: ServiceService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.services$ = this.serviceService.getUserServices(this.user.uid);
  }

  startNewService() {
    this.editing = true;
    this.editingService = null;
  }

  cancelNewService() {
    this.editing = false;
    this.editingService = null;
  }

  saveService(event: any) {
    const service = { ...event, userId: this.user.uid };

    if (this.editingService) {
      this.serviceService
        .updateService(this.editingService.serviceId, service);
    } else {
      this.serviceService
        .addService(service);
    }

    this.editing = false;
    this.editingService = null;
    this.title = '';
    this.description = '';
  }

  editService(serviceObj: any) {
    this.editing = true;
    this.editingService = serviceObj;
  }

  deleteService(service: any) {
    this.serviceService.deleteService(service.serviceId);
  }

  inquire(title: string = 'Open Commission') {
    if (this.editable) {
      return;
    }

    const dialogRef = this.dialog.open(InquireFormComponent, {
      data: { serviceTitle: title }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog closed res', result);
    });
  }

}
