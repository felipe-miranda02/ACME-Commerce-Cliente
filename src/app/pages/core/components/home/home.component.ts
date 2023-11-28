import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa, EmpresaDto } from 'src/app/models/empresa.interface';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private defaultEmpresa: EmpresaDto = {
    id: -1,
    nombre: 'ACME E-Commerce',
    uri: '',
    image:
      'data:image/png;base64,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',
  };

  public empresaList: any;

  constructor(
    private router: Router,
    private empresaService: EmpresaService,
  ) {}

  ngAfterViewInit() {
    let favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;
    favIcon.href = 'favicon.ico';
  }

  ngOnInit() {
    sessionStorage.setItem('empresa', JSON.stringify(this.defaultEmpresa));

    this.empresaService.getEmpresas().subscribe((empresas) => {
      this.empresaList = empresas;
      this.empresaList = this.empresaList.sort(
        (a: EmpresaDto, b: EmpresaDto) => {
          if (a.puntuacionDeSostenibilidad && b.puntuacionDeSostenibilidad) {
            return a.puntuacionDeSostenibilidad - b.puntuacionDeSostenibilidad;
          }

          return 0;
        },
      );
    });
  }

  onMiCuentaClicked() {
    this.router.navigate([`store/karamazov`]);
  }
}