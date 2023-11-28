import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CentroPickUp,
  ServicioEntrega,
} from 'src/app/models/empresa.interface';
import { RealizarPagoDto } from 'src/app/models/payment.interface';
import { ProductoOrden } from 'src/app/models/producto.interface';
import { DireccionUsuarioDto } from 'src/app/models/user.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ClientService } from 'src/app/services/client.service';
import { OrdenService } from 'src/app/services/orden.service';

export const atLeastOne = (validator: ValidatorFn): any => {
  return (group: FormGroup) => {
    const hasAtLeastOne =
      group &&
      group.controls &&
      Object.keys(group.controls).some(
        (k) =>
          (k == 'direccion' || k == 'pickup') && !validator(group.controls[k]),
      );

    return hasAtLeastOne ? null : { atLeastOne: true };
  };
};

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  orderForm: FormGroup = new FormGroup({});
  add_direccion_form: FormGroup = new FormGroup({});
  errorMessage: string = '';
  showError: boolean = false;
  direcciones: DireccionUsuarioDto[] = [];
  showAgregarDirecciones = false;
  serviciosEntrega: ServicioEntrega[] = [];
  pickup_centers: CentroPickUp[] = [];
  productos?: ProductoOrden[];
  subtotal?: number;
  private user: string | null;
  private empresaId: string;
  private orderId?: number;
  sumQuantity = 0;

  radio_options = ['Envio a domicilio', 'Retiro en Pick-up center'];
  paymentMethods?: { id: number; label: string; method_value: number }[];

  mapOptions: google.maps.MapOptions = {
    center: { lat: -34.897524, lng: -56.164536 },
    zoom: 13,
    disableDefaultUI: true,
  };

  @ViewChild('map_add_dir') map_add_dir!: GoogleMap;
  @ViewChild('search') searchElementRef!: ElementRef<HTMLInputElement>;

  marker!: google.maps.LatLngLiteral;
  location!: google.maps.LatLng;
  statusMap = false;

  constructor(
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private clientService: ClientService,
    private orderService: OrdenService,
  ) {
    this.user = authService.getUserId();
    this.empresaId = authService.getEmpresaId();
    // this.orderId = +route.snapshot.queryParamMap.get('orderId')!;
    const dataCheckout = this.orderService.getDatosCheckout();
    if (dataCheckout) {
      this.orderId = dataCheckout?.orderId!;
      this.subtotal = dataCheckout?.subTotal!;
      this.productos = dataCheckout?.productos!;
      this.paymentMethods = checkoutService.getPaymentMethods();
    } else {
      const empresaURI = this.authService.getEmpresaURI();
      this.router.navigate([`store/${empresaURI}/account/historial`]);
    }
  }

  ngAfterViewInit() {
    this.initSearch();
  }

  ngOnInit(): void {
    this.orderForm = new FormGroup(
      {
        radioOption: new FormControl('Envio a domicilio', [
          Validators.required,
        ]),
        direccion: new FormControl(null),
        servicio_entrega: new FormControl(null),
        pickup: new FormControl<CentroPickUp | null>({
          value: null,
          disabled: true,
        }),
        payment: new FormControl<number>(4, [Validators.required]),
      },
      { validators: [atLeastOne(Validators.required)] },
    );

    this.add_direccion_form = new FormGroup({
      searchInput: new FormControl('', [Validators.required]),
      nombre: new FormControl(''),
    });

    this.orderForm.get('direccion')?.valueChanges.subscribe((value) => {
      if (value != null && value != '') {
        this.orderForm
          .get('servicio_entrega')
          ?.setValidators([Validators.required]);
      } else {
        this.orderForm.get('servicio_entrega')?.setValidators([]);
      }
      this.orderForm.get('servicio_entrega')?.updateValueAndValidity();
    });

    this.orderForm.get('radioOption')?.valueChanges.subscribe((value) => {
      if (value == 'Envio a domicilio') {
        this.orderForm.get('pickup')?.patchValue(null);
        this.orderForm.controls['pickup'].disable();
      }
    });

    this.getDireccionesUsuario();

    this.checkoutService.getServiciosEntregaEmpresa(this.empresaId).subscribe({
      next: (value) => {
        this.serviciosEntrega = [...value];
      },
      error: (err) => {
        console.log(' error obteniendo los servicios de entrega de la empresa');
      },
    });

    this.checkoutService.getCentrosPickUp(this.empresaId).subscribe({
      next: (value) => {
        this.pickup_centers = [...value];
        this.pickup_centers.forEach(
          (pc) => (pc.position = { lat: pc.latitud, lng: pc.longitud }),
        );
      },
      error: (err) => {
        console.log(' error obteniendo los servicios de entrega de la empresa');
      },
    });

    this.sumQuantity =
      this.productos?.reduce((acc, prod) => acc + prod.cantidad, 0) ?? 0;
  }

  validateControl = (controlName: string) => {
    return (
      this.orderForm.get(controlName)?.invalid &&
      this.orderForm.get(controlName)?.touched
    );
  };

  hasError = (controlName: string, errorName: string) => {
    return this.orderForm.get(controlName)?.hasError(errorName);
  };

  getSelectedDireccion = () => {
    return this.direcciones.find(
      (d) => d.id === +this.orderForm.value.direccion,
    );
  };

  getSelectedServicioEntrega = () => {
    return this.serviciosEntrega.find(
      (s) => s.id === +this.orderForm.value.servicio_entrega,
    );
  };

  handleMarkerSelect(pickup: CentroPickUp) {
    this.orderForm.get('pickup')?.patchValue(pickup);
    this.orderForm.controls['pickup'].enable();
  }

  private getDireccionesUsuario() {
    this.checkoutService.getDireccionesUsuario(this.user!).subscribe({
      next: (value) => {
        this.direcciones = [...value];
      },
      error: (err) => {
        console.log(' error obteniendo las direcciones del usuario: ', err);
      },
    });
  }

  getTotal = () => {
    const subtotal = this.subtotal!;
    return this.orderForm.value.servicio_entrega
      ? subtotal + this.getSelectedServicioEntrega()?.costo!
      : subtotal;
  };

  getLabelMarkerMap = (i: number) => {
    return String.fromCharCode(i + 65);
  };

  finalizarPedido(formValue: any) {
    const body: RealizarPagoDto = {
      direccion_id:
        +this.orderForm.value.direccion || +this.orderForm.value.pickup?.id,
      cliente_id: this.user!,
      orden_id: this.orderId!,
      servicio_entrega_id: +this.orderForm.value.servicio_entrega || null,
      metodo_pago: this.orderForm.value.payment,
    };
    if (body.metodo_pago == 4) {
      // Flujo Mercado Pago
      this.checkoutService.realizarPago(body).subscribe({
        next: (url) => {
          window.open(url, '_self');
        },
        error: (err) => {
          console.log('error en pago : ', err);
        },
      });
    } else {
      this.checkoutService.finalizarCompra(body).subscribe({
        next: (res) => {
          this.orderService.setDatosCheckout(undefined);
          const empresaURI = this.authService.getEmpresaURI();
          this.router.navigate([`store/${empresaURI}/account/historial`]);
        },
        error: (err) => {
          console.log('error en pago : ', err);
        },
      });
    }

    // Test Visa:
    // Número: 4509 9535 6623 3704
    // Código de seguridad: 123
    //  Fecha de vencimiento: 11/25
  }

  initSearch() {
    if (this.searchElementRef.nativeElement && !this.statusMap) {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
      );
      this.statusMap = true;

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          const location = place.geometry?.location;
          if (!location) return;

          const latitud = location.lat();
          const longitud = location.lng();

          this.marker = { lat: latitud, lng: longitud };
          this.map_add_dir.center = this.marker;
          this.mapOptions = {
            center: this.marker,
          };
          this.add_direccion_form
            .get('searchInput')
            ?.patchValue(autocomplete.getPlace().formatted_address);
        });
      });
    }
  }

  agregarDireccion(addDirFormValue: any) {
    if (!this.marker) {
      alert(
        'La direccion no es valida. Seleccione una de las opciones que se le lista al ingresar los datos',
      );
      return;
    }
    const dir = { ...addDirFormValue };
    const body: DireccionUsuarioDto = {
      direccionFormateada: addDirFormValue.searchInput,
      nombre: addDirFormValue.nombre,
      latitud: this.marker.lat,
      longitud: this.marker.lng,
    };

    this.clientService.agregarDireccion(this.user!, body).subscribe({
      next: (res) => {
        this.getDireccionesUsuario();
      },
    });
  }

  formatServicoEntrega(n: number) {
    switch (n) {
      case 1:
        return ' (Fosil)';
      case 2:
        return ' (Hidrico)';
      case 3:
        return ' (Electrico)';
      case 4:
        return ' (Medio Liviano)';
      default:
        return '';
    }
  }
}
