import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const clientes = [
      { id: 11, name: 'Salvador' },
      { id: 12, name: 'Amanda' },
      { id: 13, name: 'Gregorio' },
      { id: 14, name: 'Dionisio' },
      { id: 15, name: 'Carmen' },
      { id: 16, name: 'Roberto' },
      { id: 17, name: 'Gabriela' },
      { id: 18, name: 'David' },
      { id: 19, name: 'Esperanza' },
      { id: 20, name: 'Fernando' }
    ];
    return {clientes};
  }
  genId(clientes: Cliente[]): number {
    return clientes.length > 0 ? Math.max(...clientes.map(cliente => cliente.id)) + 1 : 11;
  }
}
