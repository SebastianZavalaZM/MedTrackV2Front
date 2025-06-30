import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListaraiComponent } from './listarai/listarai.component';

@Component({
  selector: 'app-articuloinformativo',
  imports: [RouterOutlet, ListaraiComponent],
  templateUrl: './articuloinformativo.component.html',
  styleUrl: './articuloinformativo.component.css'
})
export class ArticuloinformativoComponent {
  constructor(public route:ActivatedRoute) {
  }
}
