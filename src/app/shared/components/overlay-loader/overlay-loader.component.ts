import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overlay-loader',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './overlay-loader.component.html',
  styleUrl: './overlay-loader.component.scss'
})
export class OverlayLoaderComponent {

  @Input() loading = false;
}
