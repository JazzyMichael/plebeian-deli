import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inquire-service',
  templateUrl: './inquire-service.component.html',
  styleUrls: ['./inquire-service.component.scss']
})
export class InquireServiceComponent implements OnInit {
  user: any;
  service: any;
  images: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private services: ServiceService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');

      if (!id) {
        return this.router.navigateByUrl('/deli');
      }

      document.querySelector('.mat-drawer-content').scrollTop = 0;
      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      const doc = await this.services.getService(id).toPromise();

      if (doc && doc.exists) {
        this.service = doc.data();
      } else {
        return this.router.navigateByUrl('/deli');
      }
    })
  }

  addImage(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Images Plz');
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.images.push({ file, url: e.target.result });
    }

    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  submit() {
    alert('Not available yet');
  }

}