import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-knowledge',
  imports: [],
  templateUrl: './knowledge.html',
  styleUrl: './knowledge.css'
})
export class Knowledge implements OnInit {

  technologies: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.http
      .get<any[]>('http://localhost/dev-vault-api/technologies/get-all.php')
      .subscribe(data => {

        this.technologies = data;

      });

  }

}