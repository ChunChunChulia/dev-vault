import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';



import { createNoise3D } from 'simplex-noise';

@Component({
  selector: 'app-background',
  imports: [],
  templateUrl: './background.html',
  styleUrl: './background.css'
})

export class Background implements AfterViewInit, OnDestroy {

  @ViewChild('canvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private animationId = 0;

  private noise3D = createNoise3D();

  private z = Math.random() * 10;

  private spacing = 11;
  private scale = 0.0028;
  private speed = 0.005;


  ngAfterViewInit(): void {

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    this.context = context;

    this.resizeCanvas();

    window.addEventListener('resize', this.resizeCanvas);

    this.animate();
  }


  private resizeCanvas = (): void => {

    const canvas = this.canvasRef.nativeElement;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };


  private animate = (): void => {

    const canvas = this.canvasRef.nativeElement;

    this.context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    for (let x = 0; x < canvas.width; x += this.spacing) {

      for (let y = 0; y < canvas.height; y += this.spacing) {

        const value = this.noise3D(
          x * this.scale,
          y * this.scale,
          this.z
        );

        const strength = Math.abs(value);

        const radius = 0.5 + strength * 6;

        const opacity = 0.08 + strength * 0.7;


        this.context.beginPath();

        this.context.arc(
          x,
          y,
          radius,
          0,
          Math.PI * 2
        );

       const normalized = Math.min(strength / 0.75, 1);

/*
  Poca intensidad  → morado
  Mucha intensidad → blanco
*/

const red = 175 + normalized * 80;
const green = 90 + normalized * 165;
const blue = 255;

this.context.fillStyle =
  `rgba(${red}, ${green}, ${blue}, ${opacity})`;

this.context.fill();
      }
    }


    this.z += this.speed;

    this.animationId =
      requestAnimationFrame(this.animate);
  };


  ngOnDestroy(): void {

    cancelAnimationFrame(this.animationId);

    window.removeEventListener(
      'resize',
      this.resizeCanvas
    );
  }
}