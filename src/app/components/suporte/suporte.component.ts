import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarSuporteComponent } from './listar-suporte/listar-suporte.component';

@Component({
  selector: 'app-suporte',
  standalone: true,
  imports: [RouterOutlet, ListarSuporteComponent],
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.css']
})
export class SuporteComponent {
  constructor(public route: ActivatedRoute) {}
}