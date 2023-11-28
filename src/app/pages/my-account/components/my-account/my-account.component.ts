import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.interface';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {
  
  public cliente: Cliente = {
    nombre: "",
    apellido: "",
    image: "",
  };

  constructor(
    private acitvatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.acitvatedRoute.data.subscribe(
      ({cliente}) =>
        this.cliente = cliente
    );
  }

}
