import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarforosComponent } from './listarforos/listarforos.component';

@Component({
  selector: 'app-foros',
  imports: [RouterOutlet, ListarforosComponent],
  templateUrl: './foros.component.html',
  styleUrl: './foros.component.css'
})
export class ForosComponent {
  constructor(public route:ActivatedRoute) { }
}
