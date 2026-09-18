import {
  Component,
  signal,
  ChangeDetectorRef,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-snippets',
  imports: [],
  templateUrl: './snippets.html',
  styleUrl: './snippets.css'
})

export class Snippets implements OnInit, OnDestroy {

  mensaje = signal('');
  exito = signal(false);
  mostrarFormulario = signal(false);

  tecnologiaSeleccionada = '';
  categoriaSeleccionada = '';

  technologies: any[] = [];
  snippets: any[] = [];
  snippetsFiltrados: any[] = [];
  categorias: string[] = [];

  chipDragging = false;
  chipMovido = false;
  chipPausado = false;
  chipStartX = 0;
  chipStartScroll = 0;
  chipTimer?: number;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(){
    this.cargarTecnologias();
    this.cargarSnippets();
    this.iniciarMovimientoChips();
  }

  ngOnDestroy(){
    if(this.chipTimer){
      window.clearInterval(this.chipTimer);
    }
  }

  guardar(
    title: string,
    description: string,
    category: string,
    technology: string,
    code: string,
    formulario: HTMLFormElement
  ){
    const datos = {
      title,
      description,
      category,
      technology,
      code
    };

    this.http.post(
      'http://localhost/dev-vault-api/technologies/snippets.php',
      datos
    ).subscribe({
      next: respuesta => {
        console.log('Snippet guardado:', respuesta);

        this.mensaje.set(
          'Snippet guardado correctamente'
        );

        this.exito.set(true);

        formulario.reset();
        this.cargarSnippets();
      },

      error: error => {
        console.log(
          'Error guardando snippet:',
          error
        );

        this.mensaje.set(
          'Error al guardar el snippet'
        );

        this.exito.set(false);
      }
    });
  }

  cargarTecnologias(){
    this.http.get<any[]>(
      'http://localhost/dev-vault-api/technologies/technologies.php'
    ).subscribe({
      next: respuesta => {
        this.technologies = respuesta;
        this.cdr.detectChanges();
      },

      error: error => {
        console.log(
          'Error cargando tecnologías:',
          error
        );
      }
    });
  }

  cargarSnippets(){
    this.http.get<any[]>(
      'http://localhost/dev-vault-api/technologies/snippets.php'
    ).subscribe({
      next: respuesta => {
        this.snippets = respuesta;
        this.snippetsFiltrados = respuesta;

        this.categorias = [
          ...new Set(
            respuesta
              .map(snippet => snippet.category)
              .filter(Boolean)
          )
        ];

        this.cdr.detectChanges();
      },

      error: error => {
        console.log(
          'ERROR CARGANDO SNIPPETS:',
          error
        );
      }
    });
  }

  filtrar(
    texto: string,
    tecnologia: string,
    categoria: string
  ){
    const busqueda =
      texto.toLowerCase().trim();

    this.snippetsFiltrados =
      this.snippets.filter(snippet => {

        const titulo =
          String(
            snippet.title ?? ''
          ).toLowerCase();

        const descripcion =
          String(
            snippet.description ?? ''
          ).toLowerCase();

        const codigo =
          String(
            snippet.code ?? ''
          ).toLowerCase();

        const coincideTexto =
          titulo.includes(busqueda) ||
          descripcion.includes(busqueda) ||
          codigo.includes(busqueda);

        const coincideTecnologia =
          tecnologia === '' ||
          snippet.technology === tecnologia;

        const coincideCategoria =
          categoria === '' ||
          snippet.category === categoria;

        return (
          coincideTexto &&
          coincideTecnologia &&
          coincideCategoria
        );
      });

    this.cdr.detectChanges();
  }

  seleccionarTecnologia(
    tecnologia: string,
    texto: string
  ){
    if(this.chipMovido){
      return;
    }

    this.tecnologiaSeleccionada =
      tecnologia;

    this.filtrar(
      texto,
      this.tecnologiaSeleccionada,
      this.categoriaSeleccionada
    );
  }

  seleccionarCategoria(
    categoria: string,
    texto: string
  ){
    if(this.chipMovido){
      return;
    }

    this.categoriaSeleccionada =
      categoria;

    this.filtrar(
      texto,
      this.tecnologiaSeleccionada,
      this.categoriaSeleccionada
    );
  }

  pararChips(event: PointerEvent){
    const elemento =
      event.currentTarget as HTMLElement;

    this.chipDragging = true;
    this.chipMovido = false;
    this.chipPausado = true;

    this.chipStartX = event.clientX;
    this.chipStartScroll =
      elemento.scrollLeft;
  }

  moverChips(event: PointerEvent){
    if(!this.chipDragging){
      return;
    }

    const elemento =
      event.currentTarget as HTMLElement;

    const distancia =
      event.clientX - this.chipStartX;

    if(Math.abs(distancia) > 4){
      this.chipMovido = true;

      event.preventDefault();

      elemento.scrollLeft =
        this.chipStartScroll - distancia;
    }
  }

  soltarChips(){
    this.chipDragging = false;

    window.setTimeout(() => {
      this.chipMovido = false;
      this.chipPausado = false;
    }, 150);
  }

  iniciarMovimientoChips(){
  this.chipTimer = window.setInterval(() => {

    if(this.chipPausado){
      return;
    }

    const filas =
      this.host.nativeElement
        .querySelectorAll<HTMLElement>('.chips-viewport');

    filas.forEach(fila => {

      const maxScroll =
        fila.scrollWidth - fila.clientWidth;

      if(maxScroll <= 2){
        return;
      }

      const direccion =
        Number(fila.dataset['direccion'] || '1');

      if(direccion === 1){

        fila.scrollLeft += 1;

        if(fila.scrollLeft >= maxScroll){
          fila.scrollLeft = maxScroll;
          fila.dataset['direccion'] = '-1';
        }

      }else{

        fila.scrollLeft -= 1;

        if(fila.scrollLeft <= 0){
          fila.scrollLeft = 0;
          fila.dataset['direccion'] = '1';
        }

      }

    });

  }, 25);
}
}