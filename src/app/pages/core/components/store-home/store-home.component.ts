import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaDto } from 'src/app/models/empresa.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.scss'],
})
export class StoreHomeComponent {
  public empresa!: EmpresaDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ empresa }) => {
      sessionStorage.setItem('empresa', JSON.stringify(empresa));
      this.empresa = empresa;
      let favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;
      favIcon.href = this.empresa.image ?? 'null';
    });

    if (this.authService.isUserAuthenticated()) {
      this.authService.sendAuthStateChangeNotification(true);
    }
  }
}
