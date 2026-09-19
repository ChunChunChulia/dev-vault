import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const resources = [
  ['CodePen','https://codepen.io/'],
  ['Ambient Canvas Backgrounds','https://tympanus.net/Development/AmbientCanvasBackgrounds/index2.html'],
  ['Animated Background Headers','https://tympanus.net/Development/AnimatedHeaderBackgrounds/index.html'],
  ['Animated Backgrounds','https://animatedbackgrounds.me/'],
  ['Animated CSS Background Generator','https://wweb.dev/resources/animated-css-background-generator'],
  ['Cool Backgrounds','https://coolbackgrounds.io/'],
  ['CSS Background Patterns','https://www.magicpattern.design/tools/css-backgrounds/'],
  ['Superdesigner CSS Backgrounds','https://superdesigner.co/tools/css-backgrounds'],
  ['CSS Gradient Animator','https://www.gradient-animator.com/'],
  ['CSS Gradient Editor','https://www.cssgradienteditor.com/'],
  ['CSS Pattern','https://css-pattern.com/'],
  ['CSS Plasma Background Generator','https://fracergu.github.io/css-plasma-background-generator/'],
  ['CSS3 Patterns Gallery','https://projects.verou.me/css3patterns/'],
  ['Decorative WebGL Backgrounds','https://tympanus.net/Development/DecorativeBackgrounds/index.html'],
  ['Flat Surface Shader','http://matthew.wagerfield.com/flat-surface-shader/'],
  ['GeoPattern','https://btmills.github.io/geopattern/'],
  ['Gradient Backgrounds','https://cssgradient.io/gradient-backgrounds/'],
  ['Gradient Magic','https://www.gradientmagic.com/'],
  ['Gradienty','https://gradienty.codes/'],
  ['Haikei','https://haikei.app/generators/'],
  ['Hero Patterns','https://www.heropatterns.com/'],
  ['Midori','https://aeroheim.github.io/midori/'],
  ['Naker Back','http://back.naker.io/'],
  ['particles.js','https://vincentgarreau.com/particles.js/'],
  ['Pattern Generator','https://doodad.dev/pattern-generator/'],
  ['Pattern Library','http://thepatternlibrary.com/'],
  ['Pattern Monster','https://pattern.monster/'],
  ['pattern.css','https://bansal.io/pattern-css'],
  ['Pocoloco','https://pocoloco.io/'],
  ['Subtle Patterns','https://www.toptal.com/designers/subtlepatterns/'],
  ['SVG Backgrounds','https://www.svgbackgrounds.com/'],
  ['SVG Gradient Wave Generator','https://www.outpan.com/app/9aaaf27303/svg-gradient-wave-generator'],
  ['THPACE!','https://www.braedin.com/Thpace/'],
  ['Transparent Textures','https://www.transparenttextures.com/'],
  ['Triangle Pattern Maker','https://msurguy.github.io/triangles/'],
  ['Trianglify.io','https://trianglify.io/'],
  ['Vanta.js','https://www.vantajs.com/'],
  ['Wave','https://loading.io/background/m-wave/'],
  ['Wicked Backgrounds','https://wickedbackgrounds.com/'],
  ['Your Lucky CSS Pattern','https://random.css-pattern.com/']
];

function slug(texto){
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-|-$/g,'');
}

function escaparSql(texto){
  return texto.replaceAll("'", "''");
}

const carpeta = path.resolve('public/images/resources');
fs.mkdirSync(carpeta,{recursive:true});

const browser = await chromium.launch({
  headless:true
});

const context = await browser.newContext({
  viewport:{
    width:800,
    height:800
  },
  deviceScaleFactor:1
});

let sql = '';
const fallos = [];

for(const [titulo,url] of resources){
  const nombre = `${slug(titulo)}.png`;
  const destino = path.join(carpeta,nombre);

  console.log(`Capturando: ${titulo}`);

  const page = await context.newPage();

  try{
    await page.goto(url,{
      waitUntil:'domcontentloaded',
      timeout:30000
    });

    await page.waitForTimeout(2500);

    await page.screenshot({
      path:destino,
      fullPage:false
    });

    const ruta = `/images/resources/${nombre}`;

    sql +=
`UPDATE resources
SET image_url = '${escaparSql(ruta)}'
WHERE title = '${escaparSql(titulo)}';

`;

    console.log(`✓ ${nombre}`);

  }catch(error){
    console.log(`✗ No se pudo abrir: ${url}`);
    fallos.push(`${titulo} - ${url}`);
  }

  await page.close();
}

await browser.close();

fs.writeFileSync(
  'resources-images.sql',
  sql,
  'utf8'
);

if(fallos.length){
  fs.writeFileSync(
    'resources-fallos.txt',
    fallos.join('\n'),
    'utf8'
  );
}

console.log('');
console.log('TERMINADO');
console.log(`Imágenes: ${carpeta}`);
console.log('SQL: resources-images.sql');

if(fallos.length){
  console.log(`Fallaron ${fallos.length} webs.`);
  console.log('Mira resources-fallos.txt');
}