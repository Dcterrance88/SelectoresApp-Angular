import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators'

import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public miFormulario: FormGroup = this._fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],
  })
  // Llenar selectores
  public regiones : string[]    = [];
  public paises   : PaisSmall[] = [];
  // public fronteras: string[]    = [];
  public fronteras: PaisSmall[]    = [];

  //UI
  public cargando: boolean = false;

  constructor(private _fb : FormBuilder,
              private _ps : PaisesService) { }

  ngOnInit(): void {
    this.regiones = this._ps.regiones;
    // Cuando cambia la region
    this.miFormulario.get('region')?.valueChanges
        .pipe (
          tap( ( _ ) =>{
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }),
          switchMap( region => this._ps.getPaisesPorRegion(region)),
        )
        .subscribe( paises => {
          this.paises = paises;
          this.cargando = false;
        })    
    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( ( _ ) =>{
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( codigo => this._ps.getPaisPorCodigo(codigo)),
          switchMap( pais => this._ps.getPaisesPorCodigos(pais?.borders!))
        )
        .subscribe(paises =>{
          // this.fronteras = pais?.borders || [];
          this.fronteras = paises;
          this.cargando = false;
        })

  }


  public guardar(){
    console.log(this.miFormulario.value);
  }

}


 // Cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region =>{
    //     console.log(region)
    //     this._ps.getPaisesPorRegion(region)
    //       .subscribe(paises =>{
    //         console.log(paises);
    //         this.paises = paises;
    //       })
    //   })