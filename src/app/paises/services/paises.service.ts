import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private _http : HttpClient) { }

  public getPaisesPorRegion(region : string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${ region }?fields=alpha3Code;name`;
    return this._http.get<PaisSmall[]>(url);
  }

  public getPaisPorCodigo(codigoPais : string): Observable<Pais | null> {

    if(!codigoPais){
      return of(null)
    }

    const url: string = `${this._baseUrl}/alpha/${ codigoPais }`;
    return this._http.get<Pais>(url);
  }

  public getPaisPorCodigoSmall(codigoPais : string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${ codigoPais }?fields=alpha3Code;name`;
    return this._http.get<PaisSmall>(url);
  }

  public getPaisesPorCodigos(borders: string[]) : Observable<PaisSmall[]> {//nota 1
    if(!borders){
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach( codigoPais => {
      const peticion = this.getPaisPorCodigoSmall(codigoPais)
      peticiones.push(peticion);
    })

    return combineLatest(peticiones); 
  }
}

//nota 1
/*
el metodo recibe los bordes, si es undefined devuelve un arreglo vacio de caso
contrario se crea un arreglo de peticiones las cuales se almacenan en un arreglo y
se regresa el 'combineLatest(peticiones);', la cual es una funcion de rxjs que regrea
un observable que contiene un arreglo con todo el producto de cada una de sus peticiones
internas,
*/