import { Component, OnInit, Input } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
    private ordersService: OrdersService,
    private authService: AuthService
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

  inquire(title: string = 'Open Commission', description?: string) {
    return;

    // const dialogRef = this.dialog.open(InquireFormComponent, {
    //   data: { serviceTitle: title }
    // });

    // dialogRef.afterClosed().subscribe(async result => {
    //   console.log('dialog closed res', result);

    //   const currentUser = await this.authService.getCurrentUser();

    //   const serviceOrder = {
    //     serviceTitle: title,
    //     serviceDescription: description || '',
    //     orderDescription: result.orderDescription,
    //     orderImages: result.orderImages,
    //     inquiredTimestamp: new Date(),
    //     sellerId: this.user.uid,
    //     buyerId: currentUser.uid,
    //     messages: [],
    //     accepted: false,
    //     purchased: false,
    //     shipped: false
    //   };

    //   console.log('service order', serviceOrder);

    //   this.ordersService.placeServiceOrder(serviceOrder);
    // });
  }

}
