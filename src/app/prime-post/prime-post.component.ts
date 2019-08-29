import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PrimeCutsService } from '../services/prime-cuts.service';

@Component({
  selector: 'app-prime-post',
  templateUrl: './prime-post.component.html',
  styleUrls: ['./prime-post.component.scss']
})
export class PrimePostComponent implements OnInit {
  primePost$: Observable<any>;
  userPrimePosts$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private primeCutsService: PrimeCutsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');

      if (!postId) {
        return this.router.navigateByUrl('/prime-cuts');
      }

      document.querySelector('.main-container').scrollTop = 0;

    });
  }

}
