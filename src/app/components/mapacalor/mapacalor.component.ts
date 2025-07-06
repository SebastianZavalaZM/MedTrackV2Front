import { Component } from '@angular/core';
import {ListarmapacalorComponent} from './listarmapacalor/listarmapacalor.component';
import {ActivatedRoute, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-mapacalor',
  imports: [RouterOutlet, ListarmapacalorComponent],
  templateUrl: './mapacalor.component.html',
  styleUrl: './mapacalor.component.css'
})
export class MapacalorComponent {

  constructor(public route:ActivatedRoute) { }
}
