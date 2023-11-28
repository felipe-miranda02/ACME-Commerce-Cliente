import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaDto } from 'src/app/models/empresa.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public tiendaName: string = 'ACME Commerce';
  public isUserAuthenticated: boolean = false;
  public navbarCollapsed = true;
  public empresa: EmpresaDto = {
    id: -1,
    nombre: 'ACME Commerce',
    uri: '',
  };
  public searchForm = new FormGroup({
    filter: new FormControl(''),
  });
  
  public navbarClasses = ' bg-light';
  public navbarStyle = {};

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  ngOnInit(): void {
    const empresaString = sessionStorage.getItem('empresa');
    if (empresaString != null) {
      this.empresa = JSON.parse(empresaString);
    }
  }

  ngAfterViewInit()	: void {
  }

  onHeaderNameClicked() {
    if (this.empresa.id == -1) {
      this.router.navigate([]);
    } else {
      this.router.navigate([`/store/${this.empresa.uri}/producto`]);
    }
  }

  public onSearchSubmit(searchFormValue: any) {
    if (searchFormValue !== null && searchFormValue !== undefined) {
      if (searchFormValue != '') {
        this.router.navigate(
          [`store/${this.empresa.uri}/producto`],  
          { queryParams: { filter: searchFormValue.filter } }
        );
      } else {
        this.router.navigate(
          [`store/${this.empresa.uri}/producto`]);
      }
    }
  }

  onHistorialClicked() {
    this.router.navigate([`store/${this.empresa.uri}/account/historial`]);
  }

  onCarritoClicked() {
    this.router.navigate([`store/${this.empresa.uri}/cart`]);
  }

  onLoginClicked() {
    this.router.navigate([`store/${this.empresa.uri}/auth/login`]);
  }

  onMiCuentaClicked() {
    this.router.navigate([`store/${this.empresa.uri}/account/data`]);
  }
}
