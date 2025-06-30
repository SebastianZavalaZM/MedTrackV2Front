import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListartipoenfermedadComponent } from './listartipoenfermedad/listartipoenfermedad.component';


@Component({
  selector: 'app-tipoenfermedad',
  imports: [RouterOutlet,ListartipoenfermedadComponent],
  templateUrl: './tipoenfermedad.component.html',
  styleUrl: './tipoenfermedad.component.css'
})
export class TipoEnfermedadComponent {
  constructor(public route:ActivatedRoute) { }
}
