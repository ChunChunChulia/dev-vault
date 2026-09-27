import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-reference',
  imports: [
    FormsModule
  ],
  templateUrl: './reference.html',
  styleUrl: './reference.css'
})

export class Reference implements OnInit {

  private apiUrl =
    'https://devvault.alwaysdata.net/dev-vault-api/technologies/references.php';

  references: any[] = [];
  referencesPaginadas: any[] = [];

  paginaActual = 1;
  referencesPorPagina = 6;
  totalPaginas = 0;

  mostrarFormulario = false;

  referenceEditando: any = null;

  mensaje = '';

  formulario = {
    title: '',
    description: '',
    category: '',
    technology: '',
    html_code: '',
    css_code: '',
    js_code: '',
    preview_mode: 'live',
    image_url: ''
  };


  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}


  ngOnInit(){
    this.cargarReferences();
  }


  cargarReferences(){

    this.http.get<any[]>(this.apiUrl)
      .subscribe(datos => {

        this.references = datos.map(reference => ({
          ...reference,

          preview:
            this.crearPreview(reference)
        }));

        this.paginaActual = 1;
        this.actualizarPaginacion();

        this.cdr.detectChanges();

      });

  }


  actualizarPaginacion(){

    this.totalPaginas = Math.ceil(this.references.length / this.referencesPorPagina); // Math.ceil() redondea hacia arriba para calcular el número total de páginas.

    const inicio =
      (this.paginaActual - 1) *
      this.referencesPorPagina;

    this.referencesPaginadas =
      this.references.slice(
        inicio,
        inicio + this.referencesPorPagina
      );
  }

  cambiarPagina(pagina: number){

    if(
      pagina < 1 ||
      pagina > this.totalPaginas
    ){
      return;
    }

    this.paginaActual = pagina;
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  abrirFormulario(){

    this.referenceEditando = null;

    this.formulario = {
      title: '',
      description: '',
      category: '',
      technology: '',
      html_code: '',
      css_code: '',
      js_code: '',
      preview_mode: 'live',
      image_url: ''
    };

    this.mostrarFormulario = true;
  }


  abrirEdicion(reference: any){

    this.referenceEditando = reference;

    this.formulario = {
      title: reference.title ?? '',
      description: reference.description ?? '',
      category: reference.category ?? '',
      technology: reference.technology ?? '',
      html_code: reference.html_code ?? '',
      css_code: reference.css_code ?? '',
      js_code: reference.js_code ?? '',
      preview_mode: reference.preview_mode ?? 'live',
      image_url: reference.image_url ?? ''
    };

    this.mostrarFormulario = true;
  }


  guardarReference(){

    if(this.referenceEditando){

      const datos = {
        id: this.referenceEditando.id,
        ...this.formulario
      };

      this.http.put(
        this.apiUrl,
        datos
      ).subscribe({

        next: (respuesta: any) => {

          this.mensaje = respuesta.mensaje;

          this.cerrarFormulario();
          this.cargarReferences();

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('ERROR AL EDITAR:', error);
        }

      });

    }else{

      this.http.post(
        this.apiUrl,
        this.formulario
      ).subscribe({

        next: (respuesta: any) => {

          this.mensaje = respuesta.mensaje;

          this.cerrarFormulario();
          this.cargarReferences();

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('ERROR AL GUARDAR:', error);
        }

      });

    }
  }


  borrarReference(reference: any){

    const confirmar = window.confirm(
      `¿Eliminar "${reference.title}"?`
    );

    if(!confirmar){
      return;
    }

    this.http.request(
      'DELETE',
      this.apiUrl,
      {
        body: {
          id: reference.id
        }
      }
    ).subscribe(() => {

      this.cargarReferences();

    });

  }


  cerrarFormulario(){

    this.mostrarFormulario = false;
    this.referenceEditando = null;

    this.formulario = {
      title: '',
      description: '',
      category: '',
      technology: '',
      html_code: '',
      css_code: '',
      js_code: '',
      preview_mode: 'live',
      image_url: ''
    };

    this.cdr.detectChanges();
  }


  crearPreview(reference: any): SafeHtml {

    const documento = `
      <!DOCTYPE html>

      <html>

        <head>

          <style>

            body{
              margin:0;
              min-height:100vh;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#080808;
            }

            ${reference.css_code || ''}

          </style>

        </head>

        <body>

          ${reference.html_code || ''}

          <script>
            ${reference.js_code || ''}
          </script>

        </body>

      </html>
    `;

    return this.sanitizer
      .bypassSecurityTrustHtml(documento);

  }

}