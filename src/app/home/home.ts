import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { HttpClient } from '@angular/common/http';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})


export class Home implements OnInit {

  ultimosSnippets: any[] = [];
  ultimosResources: any[] = [];
  ultimasReferences: any[] = [];


  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}


  ngOnInit(){
    this.cargarUltimosSnippets();
    this.cargarUltimosResources();
    this.cargarUltimasReferences();
  }


  cargarUltimosSnippets(){

    this.http.get<any[]>(
      'http://localhost/dev-vault-api/technologies/snippets.php'
    ).subscribe(datos => {

      this.ultimosSnippets = datos
        .sort((a,b) =>
          (b.updated_at || b.created_at)
            .localeCompare(a.updated_at || a.created_at)
        )
        .slice(0,2);

      console.log(
        'ÚLTIMOS SNIPPETS:',
        this.ultimosSnippets
      );

      this.cdr.detectChanges();

    });

  }


  cargarUltimosResources(){

    this.http.get<any[]>(
      'http://localhost/dev-vault-api/technologies/resources.php'
    ).subscribe(datos => {

      this.ultimosResources = datos
        .sort((a,b) =>
          (b.updated_at || b.created_at)
            .localeCompare(a.updated_at || a.created_at)
        )
        .slice(0,2);

      console.log(
        'ÚLTIMOS RESOURCES:',
        this.ultimosResources
      );

      this.cdr.detectChanges();

    });

  }


  cargarUltimasReferences(){

    this.http.get<any[]>(
      'http://localhost/dev-vault-api/technologies/references.php'
    ).subscribe(datos => {

      this.ultimasReferences = datos
        .sort((a,b) =>
          (b.updated_at || b.created_at)
            .localeCompare(a.updated_at || a.created_at)
        )
        .slice(0,2)
        .map(reference => ({
          ...reference,
          preview: this.crearPreview(reference)
        }));

      console.log(
        'ÚLTIMA REFERENCE:',
        this.ultimasReferences
      );

      this.cdr.detectChanges();

    });

  }


  crearPreview(reference: any): SafeHtml {

    const documento = `
      <!DOCTYPE html>

      <html>

        <head>

          <style>

            html,
            body{
              width:100%;
              height:100%;
              margin:0;
            }

            body{
              display:flex;
              align-items:center;
              justify-content:center;
              overflow:hidden;
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