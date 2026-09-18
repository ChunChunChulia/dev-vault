import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resources',
  imports: [],
  templateUrl: './resources.html',
  styleUrl: './resources.css'
})

export class ResourcesComponent implements OnInit, OnDestroy {

  resources: any[] = [];
  resourcesFiltrados: any[] = [];

  formulario = false;
  recursoEditando: any = null;

  busqueda = '';
  categoriaSeleccionada = '';
  tecnologiaSeleccionada = '';

  categorias: string[] = [];
  tecnologias: string[] = [];

  chipDragging = false;
  chipMovido = false;
  chipPausado = false;
  chipStartX = 0;
  chipStartScroll = 0;
  chipTimer?: number;

  apiUrl = 'http://localhost/dev-vault-api/technologies/resources.php';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(){
    this.consultarResources();
    this.iniciarMovimientoChips();
  }

  ngOnDestroy(){
    if(this.chipTimer){
      window.clearInterval(this.chipTimer);
    }
  }

  mostrarFormulario(){
    this.formulario = !this.formulario;
    this.cdr.detectChanges();
  }

  consultarResources(){
    this.http.get<any[]>(this.apiUrl).subscribe(datos => {
      this.resources = datos;

      this.categorias = [
        ...new Set(
          this.resources
            .map(resource => resource.category)
            .filter(Boolean)
        )
      ];

      this.tecnologias = [
        ...new Set(
          this.resources
            .map(resource => resource.technology)
            .filter(Boolean)
        )
      ];

      this.aplicarFiltros();
      this.cdr.detectChanges();
    });
  }

  insertarResource(
    title: string,
    description: string,
    category: string,
    technology: string,
    url: string,
    imageUrl: string
  ){
    const nuevoRecurso = {
      title,
      description,
      category,
      technology,
      url,
      image_url: imageUrl
    };

    this.http.post<any>(
      this.apiUrl,
      nuevoRecurso
    ).subscribe(respuesta => {
      console.log('INSERTADO:', respuesta);

      this.formulario = false;
      this.consultarResources();
      this.cdr.detectChanges();
    });
  }

  abrirEdicion(resource: any){
    this.recursoEditando = resource;
    this.cdr.detectChanges();
  }

  cerrarEdicion(){
    this.recursoEditando = null;
    this.cdr.detectChanges();
  }

  editarResource(
    id: number,
    title: string,
    description: string,
    category: string,
    technology: string,
    url: string,
    imageUrl: string
  ){
    const recursoActualizado = {
      id,
      title,
      description,
      category,
      technology,
      url,
      image_url: imageUrl
    };

    this.http.put<any>(
      this.apiUrl,
      recursoActualizado
    ).subscribe(respuesta => {
      console.log('EDITADO:', respuesta);

      this.recursoEditando = null;
      this.consultarResources();
      this.cdr.detectChanges();
    });
  }

  borrarResource(id: number){
    const confirmar = confirm(
      '¿Seguro que quieres borrar este recurso?'
    );

    if(!confirmar){
      return;
    }

    this.http.delete<any>(
      this.apiUrl,
      {
        body: { id }
      }
    ).subscribe(respuesta => {
      console.log('BORRADO:', respuesta);

      this.consultarResources();
      this.cdr.detectChanges();
    });
  }

  buscar(valor: string){
    this.busqueda = valor.toLowerCase();
    this.aplicarFiltros();
  }

  filtrarCategoria(categoria: string){
    if(this.chipMovido){
      return;
    }

    if(this.categoriaSeleccionada === categoria){
      this.categoriaSeleccionada = '';
    }else{
      this.categoriaSeleccionada = categoria;
    }

    this.aplicarFiltros();
  }

  filtrarTecnologia(tecnologia: string){
    if(this.chipMovido){
      return;
    }

    if(this.tecnologiaSeleccionada === tecnologia){
      this.tecnologiaSeleccionada = '';
    }else{
      this.tecnologiaSeleccionada = tecnologia;
    }

    this.aplicarFiltros();
  }

  aplicarFiltros(){
    this.resourcesFiltrados = this.resources.filter(resource => {

      const coincideBusqueda =
        !this.busqueda ||
        resource.title?.toLowerCase().includes(this.busqueda) ||
        resource.description?.toLowerCase().includes(this.busqueda) ||
        resource.category?.toLowerCase().includes(this.busqueda) ||
        resource.technology?.toLowerCase().includes(this.busqueda);

      const coincideCategoria =
        !this.categoriaSeleccionada ||
        resource.category === this.categoriaSeleccionada;

      const coincideTecnologia =
        !this.tecnologiaSeleccionada ||
        resource.technology === this.tecnologiaSeleccionada;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideTecnologia
      );
    });

    this.cdr.detectChanges();
  }

  pararChips(event: PointerEvent){
    const elemento = event.currentTarget as HTMLElement;

    this.chipDragging = true;
    this.chipMovido = false;
    this.chipPausado = true;

    this.chipStartX = event.clientX;
    this.chipStartScroll = elemento.scrollLeft;
  }

  moverChips(event: PointerEvent){
    if(!this.chipDragging){
      return;
    }

    const elemento = event.currentTarget as HTMLElement;
    const distancia = event.clientX - this.chipStartX;

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