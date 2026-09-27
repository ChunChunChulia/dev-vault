import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import { Background } from './background/background';
import { AuthService } from './auth.service';

@Component({
  imports: [RouterOutlet, Menu, Background],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(){
    this.auth.comprobarSesion();
  }

  protected readonly title = signal('dev-vault');
}
