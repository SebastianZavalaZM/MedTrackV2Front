import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarcomentarioforosComponent } from './listarcomentarioforos/listarcomentarioforos.component';

@Component({
  selector: 'app-comentarioforos',
  imports: [RouterOutlet, ListarcomentarioforosComponent],
  templateUrl: './comentarioforos.component.html',
  styleUrl: './comentarioforos.component.css'
})
export class ComentarioforosComponent {
    constructor(public route:ActivatedRoute) { }
}
