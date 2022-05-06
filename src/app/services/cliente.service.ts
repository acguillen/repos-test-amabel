import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Cliente } from '../models/cliente';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientesUrl = 'api/clientes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET clientes from the server */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.clientesUrl)
      .pipe(
        tap(_ => this.log('fetched clientes')),
        catchError(this.handleError<Cliente[]>('getClientes', []))
      );
  }

  /** GET cliente by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Cliente> {
    const url = `${this.clientesUrl}/?id=${id}`;
    return this.http.get<Cliente[]>(url)
      .pipe(
        map(clientes => clientes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} cliente id=${id}`);
        }),
        catchError(this.handleError<Cliente>(`getCliente id=${id}`))
      );
  }

  /** GET cliente by id. Will 404 if id not found */
  getCliente(id: number): Observable<Cliente> {
    const url = `${this.clientesUrl}/${id}`;
    return this.http.get<Cliente>(url).pipe(
      tap(_ => this.log(`fetched Cliente id=${id}`)),
      catchError(this.handleError<Cliente>(`getHero id=${id}`))
    );
  }

  /* GET clientes whose name contains search term */
  searchClientes(term: string): Observable<Cliente[]> {
    if (!term.trim()) {
      // if not search term, return empty cliente array.
      return of([]);
    }
    return this.http.get<Cliente[]>(`${this.clientesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found clientes matching "${term}"`) :
         this.log(`no clientes matching "${term}"`)),
      catchError(this.handleError<Cliente[]>('searchClientes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.clientesUrl, cliente, this.httpOptions).pipe(
      tap((newCliente: Cliente) => this.log(`added cliente w/ id=${newCliente.id}`)),
      catchError(this.handleError<Cliente>('addCliente'))
    );
  }

  /** DELETE: delete the cliente from the server */
  deleteCliente(cliente: Cliente | number): Observable<Cliente> {
    const id = typeof cliente === 'number' ? cliente : cliente.id;
    const url = `${this.clientesUrl}/${id}`;

    return this.http.delete<Cliente>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted cliente id=${id}`)),
      catchError(this.handleError<Cliente>('deleteCliente'))
    );
  }

  /** PUT: update the hero on the server */
  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put(this.clientesUrl, cliente, this.httpOptions).pipe(
      tap(_ => this.log(`updated cliente id=${cliente.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ClienteService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ClienteService: ${message}`);
  }
}
