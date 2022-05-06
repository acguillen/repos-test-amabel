import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  @ViewChild('nameClient')
  nameClient!: ElementRef;

  clientes!: Cliente[];

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.getClientes();
  }

  getClientes(): void {
    this.clienteService.getClientes()
    .subscribe(clientes => this.clientes = clientes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.clienteService.addCliente({ name } as Cliente)
      .subscribe(cliente => {
        this.clientes.push(cliente);
      });
      console.log(this.nameClient);
      this.nameClient.nativeElement.value = '';

  }

  delete(cliente: Cliente): void {
    this.clientes = this.clientes.filter(c => c !== cliente);
    this.clienteService.deleteCliente(cliente).subscribe();
  }

  validaEnter(event:any): void {
    console.log("IMPRIMO EVENTO: ",event);
    if(event.charCode === 13){
      this.add(event.target.value);
    }

  }

}

