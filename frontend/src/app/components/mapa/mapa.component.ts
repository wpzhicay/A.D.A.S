import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MedicionesService } from '../../services/mediciones.service';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MapaComponent implements AfterViewInit, OnDestroy {


  map!: L.Map;
  marker!: L.Marker;
  lineaRuta!: L.Polyline;


  ruta: L.LatLngExpression[] = [];


  latitud = -2.926469;
  longitud = -78.951933;
  voltaje = 0;
  corriente = 0;
  bateria = 0;
  velocidad = 0;
  temperatura = 0;


  private updateSubscription?: Subscription;
  private updateRutaSubscription?: Subscription;



  constructor(
    private medicionesService: MedicionesService
  ) {
    console.log("Constructor mapa");
  }



  ngAfterViewInit(): void {


    setTimeout(()=>{


      this.inicializarMapa();


      // Ahora que existe el mapa cargamos datos

      this.cargarRuta();

      this.cargarMedicion();



      this.updateSubscription =
      interval(10000)
      .subscribe(()=>{

        this.cargarMedicion();

      });



      this.updateRutaSubscription =
      interval(60000)
      .subscribe(()=>{

        this.cargarRuta();

      });



    },500);



  }



  ngOnDestroy(): void {


    this.updateSubscription?.unsubscribe();

    this.updateRutaSubscription?.unsubscribe();


    if(this.map){

      this.map.remove();

    }


  }





  inicializarMapa(){


    console.log("Inicializando mapa");


    this.map = L.map('map')
    .setView(
      [
        this.latitud,
        this.longitud
      ],
      15
    );



    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom:19,
        attribution:'© OpenStreetMap'
      }
    )
    .addTo(this.map);



    // línea de recorrido

    this.lineaRuta =
    L.polyline(
      [],
      {
        color:'#FF6B35',
        weight:4,
        dashArray:'5,5'
      }
    )
    .addTo(this.map);




    // marcador

    this.marker =
    L.marker(
      [
        this.latitud,
        this.longitud
      ]
    )
    .addTo(this.map)
    .bindPopup(
      this.generarPopup()
    );



    setTimeout(()=>{

      this.map.invalidateSize();

    },500);



    console.log("Mapa listo");


  }






  cargarRuta(){


    if(!this.lineaRuta){
      return;
    }


    this.medicionesService
    .getMedicionRuta()
    .subscribe({

      next:(data:any[])=>{


        if(data && data.length){


          this.ruta =
          data.map(p=>[

            Number(p.latitud),
            Number(p.longitud)

          ]);



          this.lineaRuta
          .setLatLngs(
            this.ruta
          );


        }


      },


      error:(err)=>{

        console.error(
          "Error ruta",
          err
        );

      }


    });


  }







  cargarMedicion(){


    if(!this.marker){
      return;
    }


    this.medicionesService
    .getMediciones()
    .subscribe({

      next:(data:any[])=>{


        if(data && data.length){


          const ultima=data[0];



          this.latitud =
          Number(ultima.latitud);



          this.longitud =
          Number(ultima.longitud);



          this.voltaje =
          Number(ultima.voltaje);



          this.corriente =
          Number(ultima.corriente);



          this.bateria =
          Number(
            ultima.porcentaje_bateria
          );



          this.velocidad =
          Number(ultima.velocidad);



          this.temperatura =
          Number(ultima.temperatura);




          this.actualizarMarcador();


        }


      },


      error:(err)=>{

        console.error(
          "Error mediciones",
          err
        );

      }


    });


  }







  actualizarMarcador(){


    const posicion:
    L.LatLngExpression =
    [
      this.latitud,
      this.longitud
    ];



    this.marker
    .setLatLng(
      posicion
    );



    this.map
    .panTo(
      posicion
    );



    this.marker
    .setPopupContent(
      this.generarPopup()
    );


  }







  generarPopup(){


    return `

    <b>☀️ ESP32 Solar</b><br>

    Voltaje:
    ${this.voltaje.toFixed(2)} V
    <br>

    Corriente:
    ${this.corriente.toFixed(2)} A
    <br>

    Temperatura:
    ${this.temperatura.toFixed(1)} °C
    <br>

    Batería:
    ${this.bateria.toFixed(0)} %
    <br>

    Velocidad:
    ${this.velocidad.toFixed(2)} km/h

    `;


  }



}