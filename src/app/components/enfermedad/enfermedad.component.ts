import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarenfermedadComponent } from './listarenfermedad/listarenfermedad.component';


@Component({
  selector: 'app-enfermedad',
  imports: [RouterOutlet,ListarenfermedadComponent],
  templateUrl: './enfermedad.component.html',
  styleUrl: './enfermedad.component.css'
})
export class EnfermedadComponent {
  constructor(public route:ActivatedRoute) { }
}
