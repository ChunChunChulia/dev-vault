import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Una sola instancia comparte el estado entre el login, el menú y la aplicación.
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  admin = signal(false);
  cargando = signal(false);
  mensaje = signal('');

  constructor(private http: HttpClient) {}

  comprobarSesion(){

    if(this.cargando()){
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');

    this.http.get<any>(
      'https://devvault.alwaysdata.net/dev-vault-api/technologies/check_session.php',
      { withCredentials: true }
    ).subscribe({
      next: respuesta => {
        this.admin.set(respuesta.admin === true);
        this.cargando.set(false);
      },
      error: error => {
        this.admin.set(false);
        this.mensaje.set('No se ha podido comprobar la sesión. Recarga la página para intentarlo de nuevo.');
        this.cargando.set(false);
      }
    });
  }

  iniciarSesion(usuario: string, password: string){

    if(this.cargando()){
      return;
    }

    if(usuario === '' || password === ''){
      this.mensaje.set('Introduce el usuario y la contraseña.');
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');

    this.http.post<any>(
      'https://devvault.alwaysdata.net/dev-vault-api/technologies/login.php',
      { usuario, password },
      { withCredentials: true }
    ).subscribe({
      next: respuesta => {
        this.admin.set(respuesta.ok === true);
        if(!this.admin()){
          this.mensaje.set(respuesta.mensaje || 'No se ha podido iniciar sesión.');
        }
        this.cargando.set(false);
      },
      error: error => {
        this.admin.set(false);
        if(error.status === 401){
          this.mensaje.set('Usuario o contraseña incorrectos.');
        }else{
          this.mensaje.set('No se ha podido iniciar sesión. Comprueba la conexión e inténtalo de nuevo.');
        }
        this.cargando.set(false);
      }
    });
  }

  cerrarSesion(){

    if(this.cargando()){
      return;
    }

    this.admin.set(false);
    this.cargando.set(true);
    this.mensaje.set('');

    this.http.post<any>(
      'https://devvault.alwaysdata.net/dev-vault-api/technologies/logout.php',
      {},
      { withCredentials: true }
    ).subscribe({
      next: respuesta => {
        if(respuesta.ok === true){
          this.mensaje.set('Sesión cerrada.');
        }else{
          this.mensaje.set('No se ha podido confirmar el cierre de sesión en el servidor.');
        }
        this.cargando.set(false);
      },
      error: error => {
        this.mensaje.set('No se ha podido confirmar el cierre de sesión en el servidor. La sesión PHP podría seguir activa.');
        this.cargando.set(false);
      }
    });
  }
}
