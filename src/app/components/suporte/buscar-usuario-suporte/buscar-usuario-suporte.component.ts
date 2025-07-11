import { Component, OnInit } from '@angular/core';
import { SuporteService } from '../../../services/suporte.service';
import { Suporte } from '../../../models/Suporte';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-buscar-usuario-suporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './buscar-usuario-suporte.component.html',
  styleUrl: './buscar-usuario-suporte.component.css'
})
export class BuscarUsuarioSuporteComponent implements OnInit {
  
  usuarioSeleccionado: number = 0;
  listaUsuarios: Usuarios[] = [];
  dataSource = new MatTableDataSource<Suporte>();
  displayedColumns: string[] = ['titulo', 'usuario', 'fecha', 'descripcion'];
  soportesOriginales: Suporte[] = [];

  constructor(
    private soporteService: SuporteService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarTodos();
    this.cargarUsuarios();
  }

  cargarTodos(): void {
    this.soporteService.list().subscribe({
      next: (data) => {
        this.soportesOriginales = data;
        this.dataSource.data = data;
        console.log('Soportes cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar soportes:', error);
      }
    });
  }

  cargarUsuarios(): void {
    this.usuariosService.list().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        console.log('Usuarios cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  buscarPorUsuario(): void {
    if (this.usuarioSeleccionado > 0) {
      this.soporteService.searchUsuario(this.usuarioSeleccionado).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          console.log('Soportes filtrados por usuario:', data);
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.buscarLocal();
        }
      });
    } else {
      this.dataSource.data = this.soportesOriginales;
    }
  }

  buscarLocal(): void {
    const resultados = this.soportesOriginales.filter(soporte => 
      soporte.users?.idUsers === this.usuarioSeleccionado
    );
    this.dataSource.data = resultados;
  }

  limpiar(): void {
    this.usuarioSeleccionado = 0;
    this.dataSource.data = this.soportesOriginales;
  }
}