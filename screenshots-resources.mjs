import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const resources = [
  {
    "title": "Genbeta · Desarrollo web",
    "url": "https://www.genbeta.com/tag/desarrollo-web",
    "file": "genbeta-desarrollo-web.png"
  },
  {
    "title": "Manz.dev",
    "url": "https://manz.dev/",
    "file": "manz-dev.png"
  },
  {
    "title": "CSS Color Functions",
    "url": "https://css-tricks.com/css-color-functions/",
    "file": "css-color-functions.png"
  },
  {
    "title": "Stéphanie Walter · UX y accesibilidad",
    "url": "https://stephaniewalter.design/",
    "file": "stephanie-walter-ux-y-accesibilidad.png"
  },
  {
    "title": "Frontend Practice · Project Library",
    "url": "https://www.frontendpractice.com/projects",
    "file": "frontend-practice-project-library.png"
  },
  {
    "title": "roadmap.sh · Frontend Projects",
    "url": "https://roadmap.sh/frontend/projects",
    "file": "roadmap-sh-frontend-projects.png"
  },
  {
    "title": "Anime.js",
    "url": "https://animejs.com/",
    "file": "anime-js.png"
  },
  {
    "title": "CSS Zen Garden",
    "url": "https://csszengarden.com/pages/alldesigns/",
    "file": "css-zen-garden.png"
  },
  {
    "title": "CSS-Tricks",
    "url": "https://css-tricks.com/",
    "file": "css-tricks.png"
  },
  {
    "title": "JSE Certification",
    "url": "https://js.institute/jse-certification",
    "file": "jse-certification.png"
  },
  {
    "title": "JS Institute",
    "url": "https://js.institute/",
    "file": "js-institute.png"
  },
  {
    "title": "Cypress",
    "url": "https://www.cypress.io/",
    "file": "cypress.png"
  },
  {
    "title": "JavaScript · MDN",
    "url": "https://developer.mozilla.org/es/docs/Web/JavaScript",
    "file": "javascript-mdn.png"
  },
  {
    "title": "W3Schools JavaScript",
    "url": "https://www.w3schools.com/js/",
    "file": "w3schools-javascript.png"
  },
  {
    "title": "JavaScript.info",
    "url": "https://es.javascript.info/",
    "file": "javascript-info.png"
  },
  {
    "title": "Google JavaScript Style Guide",
    "url": "https://google.github.io/styleguide/jsguide.html",
    "file": "google-javascript-style-guide.png"
  },
  {
    "title": "ECMAScript Specification",
    "url": "https://tc39.es/ecma262/#sec-conformance",
    "file": "ecmascript-specification.png"
  },
  {
    "title": "ECMAScript Compatibility Table",
    "url": "https://compat-table.github.io/compat-table/es6/",
    "file": "ecmascript-compatibility-table.png"
  },
  {
    "title": "Google Search Console",
    "url": "https://search.google.com/search-console/welcome",
    "file": "google-search-console.png"
  },
  {
    "title": "Google Search Central",
    "url": "https://developers.google.com/search?hl=es-419",
    "file": "google-search-central.png"
  },
  {
    "title": "Keyword Tool",
    "url": "https://keywordtool.io/",
    "file": "keyword-tool.png"
  },
  {
    "title": "Schema.org",
    "url": "https://schema.org/",
    "file": "schema-org.png"
  },
  {
    "title": "Semrush",
    "url": "https://es.semrush.com/",
    "file": "semrush.png"
  },
  {
    "title": "Ahrefs",
    "url": "https://ahrefs.com/es",
    "file": "ahrefs.png"
  },
  {
    "title": "Screaming Frog SEO Spider",
    "url": "https://www.screamingfrog.co.uk/seo-spider/",
    "file": "screaming-frog-seo-spider.png"
  },
  {
    "title": "Moz",
    "url": "https://moz.com/products/pro/seo-toolbar",
    "file": "moz.png"
  },
  {
    "title": "Hotjar",
    "url": "https://www.hotjar.com/",
    "file": "hotjar.png"
  },
  {
    "title": "CSS Masks · aulaDIV",
    "url": "https://www.auladiv.com/tutorcss3/mask.htm",
    "file": "css-masks-auladiv.png"
  },
  {
    "title": "Formularios HTML · aulaDIV",
    "url": "https://www.auladiv.com/tutorhtml5/12a-formularios2.htm",
    "file": "formularios-html-auladiv.png"
  },
  {
    "title": "Frontend Practice",
    "url": "https://www.frontendpractice.com/",
    "file": "frontend-practice.png"
  },
  {
    "title": "BEM",
    "url": "https://en.bem.info/tutorials/",
    "file": "bem.png"
  },
  {
    "title": "➡️ Nester y 🛣️ Pathfinder - Aprendé HTML jugando - YouTube",
    "url": "https://www.youtube.com/watch?v=DvcFibhF7wo&t=6s",
    "file": "nester-y-pathfinder-aprende-html-jugando-youtube.png"
  },
  {
    "title": "Coding Fantasy",
    "url": "https://codingfantasy.com/games",
    "file": "coding-fantasy.png"
  },
  {
    "title": "CSS Diner",
    "url": "https://flukeout.github.io/",
    "file": "css-diner.png"
  },
  {
    "title": "Flexbox Froggy",
    "url": "https://flexboxfroggy.com/#es",
    "file": "flexbox-froggy.png"
  },
  {
    "title": "Grid Garden",
    "url": "https://cssgridgarden.com/#es",
    "file": "grid-garden.png"
  },
  {
    "title": "Zeplin",
    "url": "https://zeplin.io/",
    "file": "zeplin.png"
  },
  {
    "title": "Google Design · Accessibility",
    "url": "https://design.google/library/designing-global-accessibility-part-1",
    "file": "google-design-accessibility.png"
  },
  {
    "title": "Sketch",
    "url": "https://www.sketch.com/",
    "file": "sketch.png"
  },
  {
    "title": "Material Design Icons",
    "url": "https://m1.material.io/style/icons.html",
    "file": "material-design-icons.png"
  },
  {
    "title": "Card Sorting · No Solo Usabilidad",
    "url": "https://www.nosolousabilidad.com/articulos/cardsorting.htm",
    "file": "card-sorting-no-solo-usabilidad.png"
  },
  {
    "title": "WAVE Accessibility",
    "url": "https://wave.webaim.org/",
    "file": "wave-accessibility.png"
  },
  {
    "title": "Liquid Glass",
    "url": "https://codepen.io/Mikhail-Bespalov/pen/MYwrMNy",
    "file": "liquid-glass.png"
  },
  {
    "title": "Liquid Distortion Effect · WebGL",
    "url": "https://codepen.io/ksenia-k/pen/jENEMjN",
    "file": "liquid-distortion-effect-webgl.png"
  },
  {
    "title": "CSS Loaders",
    "url": "https://css-loaders.com/bars/",
    "file": "css-loaders.png"
  },
  {
    "title": "Box-shadow Generator · MDN",
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_backgrounds_and_borders/Box-shadow_generator",
    "file": "box-shadow-generator-mdn.png"
  },
  {
    "title": "Formity",
    "url": "https://www.formity.app/builder/flow",
    "file": "formity.png"
  },
  {
    "title": "Purr-O-Meter CAPTCHA",
    "url": "https://codepen.io/Giedr-Ju/pen/dPYOQVq",
    "file": "purr-o-meter-captcha.png"
  },
  {
    "title": "Rubber Banding",
    "url": "https://codepen.io/shubniggurath/pen/Qwjaeda",
    "file": "rubber-banding.png"
  },
  {
    "title": "Rippled Text Highlight",
    "url": "https://codepen.io/ghaste/pen/eYoRWyL",
    "file": "rippled-text-highlight.png"
  },
  {
    "title": "Aesthetics Wiki",
    "url": "https://aesthetics.fandom.com/wiki/List_of_Aesthetics",
    "file": "aesthetics-wiki.png"
  },
  {
    "title": "CARI Institute",
    "url": "https://cari.institute/",
    "file": "cari-institute.png"
  },
  {
    "title": "AutoDraw",
    "url": "https://www.autodraw.com/",
    "file": "autodraw.png"
  },
  {
    "title": "Craiyon",
    "url": "https://www.craiyon.com/",
    "file": "craiyon.png"
  },
  {
    "title": "Animated Drawings",
    "url": "https://sketch.metademolab.com/canvas",
    "file": "animated-drawings.png"
  },
  {
    "title": "Quick, Draw!",
    "url": "https://quickdraw.withgoogle.com/",
    "file": "quick-draw.png"
  },
  {
    "title": "Gemini",
    "url": "https://gemini.google.com/app",
    "file": "gemini.png"
  },
  {
    "title": "OpenArt",
    "url": "https://openart.ai/models/community-models",
    "file": "openart.png"
  },
  {
    "title": "Midjourney",
    "url": "https://www.midjourney.com/explore?tab=video_top",
    "file": "midjourney.png"
  },
  {
    "title": "Leonardo AI",
    "url": "https://leonardo.ai/",
    "file": "leonardo-ai.png"
  },
  {
    "title": "NotebookLM",
    "url": "https://notebooklm.google.com/?original_referer=https%3A%2F%2Fwww.google.com%23&pli=1",
    "file": "notebooklm.png"
  },
  {
    "title": "Uiverse",
    "url": "https://uiverse.io/",
    "file": "uiverse.png"
  },
  {
    "title": "Lucidchart",
    "url": "https://www.lucidchart.com/pages/es/landing",
    "file": "lucidchart.png"
  },
  {
    "title": "Fullres Image Optimizer",
    "url": "https://fullres.com/image-optimizer",
    "file": "fullres-image-optimizer.png"
  },
  {
    "title": "CSS Menus · Webdeasy",
    "url": "https://webdeasy.de/en/css-menus/",
    "file": "css-menus-webdeasy.png"
  },
  {
    "title": "CSS Buttons · Webdeasy",
    "url": "https://webdeasy.de/en/css-buttons-en/",
    "file": "css-buttons-webdeasy.png"
  },
  {
    "title": "Meta Sharing Debugger",
    "url": "https://developers.facebook.com/tools/debug/",
    "file": "meta-sharing-debugger.png"
  },
  {
    "title": "W3C HTML Validator",
    "url": "https://validator.w3.org/nu/#textarea",
    "file": "w3c-html-validator.png"
  },
  {
    "title": "Dribbble",
    "url": "https://dribbble.com/",
    "file": "dribbble.png"
  },
  {
    "title": "HTML Arrows",
    "url": "https://www.toptal.com/designers/htmlarrows/",
    "file": "html-arrows.png"
  },
  {
    "title": "Font Awesome",
    "url": "https://fontawesome.com/",
    "file": "font-awesome.png"
  },
  {
    "title": "Image Map Generator",
    "url": "https://www.image-map.net/",
    "file": "image-map-generator.png"
  },
  {
    "title": "Excalidraw",
    "url": "https://excalidraw.com/",
    "file": "excalidraw.png"
  },
  {
    "title": "Freepik",
    "url": "https://www.freepik.es/fotos-populares",
    "file": "freepik.png"
  },
  {
    "title": "JS Bin",
    "url": "https://jsbin.com/vudehipaje/edit?html%2Coutput=",
    "file": "js-bin.png"
  },
  {
    "title": "JSFiddle",
    "url": "https://jsfiddle.net/",
    "file": "jsfiddle.png"
  },
  {
    "title": "code playground /  CodePen - codePlayground",
    "url": "https://codepen.io/trending",
    "file": "code-playground-codepen-codeplayground.png"
  },
  {
    "title": "Reset CSS · Lenguaje CSS",
    "url": "https://lenguajecss.com/cascada-css/herencia/reset-css/",
    "file": "reset-css-lenguaje-css.png"
  },
  {
    "title": "regex101",
    "url": "https://regex101.com/library?search=&orderBy=HIGHEST_SCORE&filterFlavors=javascript",
    "file": "regex101.png"
  },
  {
    "title": "iHateRegex",
    "url": "https://ihateregex.io/",
    "file": "ihateregex.png"
  },
  {
    "title": "Diseño fluido, adaptativo y responsive",
    "url": "https://blog.ida.cl/diseno/diferencias-diseno-web-fluido-adaptativo-responsivo/",
    "file": "diseno-fluido-adaptativo-y-responsive.png"
  },
  {
    "title": "Miro",
    "url": "https://miro.com/es/",
    "file": "miro.png"
  },
  {
    "title": "Coolors",
    "url": "https://coolors.co/",
    "file": "coolors.png"
  },
  {
    "title": "Adobe Color",
    "url": "https://color.adobe.com/es/explore",
    "file": "adobe-color.png"
  },
  {
    "title": "Google Fonts",
    "url": "https://fonts.google.com/",
    "file": "google-fonts.png"
  },
  {
    "title": "fonts/  Font Squirrel",
    "url": "https://www.fontsquirrel.com/",
    "file": "fonts-font-squirrel.png"
  },
  {
    "title": "Optimal Workshop",
    "url": "https://www.optimalworkshop.com/",
    "file": "optimal-workshop.png"
  },
  {
    "title": "PageSpeed Insights",
    "url": "https://pagespeed.web.dev/",
    "file": "pagespeed-insights.png"
  },
  {
    "title": "Web Vitals",
    "url": "https://web.dev/articles/vitals?hl=es-419#lifecycle",
    "file": "web-vitals.png"
  },
  {
    "title": "JSONPlaceholder",
    "url": "https://jsonplaceholder.typicode.com/",
    "file": "jsonplaceholder.png"
  },
  {
    "title": "Epoch Converter",
    "url": "https://www.epochconverter.com/",
    "file": "epoch-converter.png"
  },
  {
    "title": "neat-annotations",
    "url": "https://neat-annotations.syabro.com/",
    "file": "neat-annotations.png"
  },
  {
    "title": "EaseMotion CSS",
    "url": "https://saptarshi-coder.github.io/EaseMotion-css/",
    "file": "easemotion-css.png"
  },
  {
    "title": "Figma para UX · LinkedIn Learning",
    "url": "https://www.linkedin.com/learning/figma-for-ux-design-23411224",
    "file": "figma-para-ux-linkedin-learning.png"
  },
  {
    "title": "Cómo estudiar programación · MoureDev",
    "url": "https://campus.mouredev.pro/courses/take/como-estudiar-programacion/lessons/60287216-entorno-de-desarrollo-integrado-ide",
    "file": "como-estudiar-programacion-mouredev.png"
  },
  {
    "title": "Desarrollo de Aplicaciones Web · Aula10",
    "url": "https://aula10formacion.com/curso/certificado-en-desarrollo-de-aplicaciones-con-tecnologias-web-ifcd0210/",
    "file": "desarrollo-de-aplicaciones-web-aula10.png"
  },
  {
    "title": "Python for Everybody",
    "url": "https://www.py4e.com/lessons",
    "file": "python-for-everybody.png"
  },
  {
    "title": "Python para todos · Coursera",
    "url": "https://www.coursera.org/specializations/python#courses",
    "file": "python-para-todos-coursera.png"
  },
  {
    "title": "Django",
    "url": "https://www.djangoproject.com/",
    "file": "django.png"
  },
  {
    "title": "Cómo pensar como un informático · Python",
    "url": "http://www.openbookproject.net/thinkcs/archive/python/spanish2e/",
    "file": "como-pensar-como-un-informatico-python.png"
  },
  {
    "title": "Python España",
    "url": "https://es.python.org/",
    "file": "python-espana.png"
  },
  {
    "title": "PCEP · Python Institute",
    "url": "https://pythoninstitute.org/pcep",
    "file": "pcep-python-institute.png"
  },
  {
    "title": "Acquia Academy · Drupal Back End",
    "url": "https://customers.acquiaacademy.com/learn/courses/1819/especialista-certificado-en-back-end-de-acquia-drupal-11-spanish",
    "file": "acquia-academy-drupal-back-end.png"
  },
  {
    "title": "Drush",
    "url": "https://www.drush.org/13.x/",
    "file": "drush.png"
  },
  {
    "title": "Full Stack Open",
    "url": "https://fullstackopen.com/es/",
    "file": "full-stack-open.png"
  },
  {
    "title": "freeCodeCamp",
    "url": "https://www.freecodecamp.org/espanol/learn",
    "file": "freecodecamp.png"
  },
  {
    "title": "Dev.java · Oracle University",
    "url": "https://dev.java/learn/ou/",
    "file": "dev-java-oracle-university.png"
  },
  {
    "title": "Grow with Google · Coding",
    "url": "https://grow.google/intl/es/courses-and-tools/?category=career&topic=coding-development",
    "file": "grow-with-google-coding.png"
  },
  {
    "title": "Platzi",
    "url": "https://platzi.com/",
    "file": "platzi.png"
  },
  {
    "title": "CSSBattle",
    "url": "https://cssbattle.dev/player/marcyborg",
    "file": "cssbattle.png"
  },
  {
    "title": "Code First Girls",
    "url": "https://codefirstgirls.com/",
    "file": "code-first-girls.png"
  },
  {
    "title": "GitHub para programadores · YouTube",
    "url": "https://www.youtube.com/watch?v=9grmdNy9X6I",
    "file": "github-para-programadores-youtube.png"
  },
  {
    "title": "MoureDev",
    "url": "https://moure.dev/",
    "file": "mouredev.png"
  },
  {
    "title": "One Day One Language · MoureDev",
    "url": "https://github.com/mouredev/one-day-one-language",
    "file": "one-day-one-language-mouredev.png"
  },
  {
    "title": "Microsoft Learn",
    "url": "https://learn.microsoft.com/en-us/training/organizations",
    "file": "microsoft-learn.png"
  },
  {
    "title": "JavaScript on Azure · Microsoft Learn",
    "url": "https://learn.microsoft.com/es-es/azure/developer/javascript/learn-azure-javascript",
    "file": "javascript-on-azure-microsoft-learn.png"
  },
  {
    "title": "W3Cx",
    "url": "https://w3cx.org/",
    "file": "w3cx.png"
  },
  {
    "title": "JavaScript30",
    "url": "https://javascript30.com/",
    "file": "javascript30.png"
  },
  {
    "title": "Halo Universe Chronicle",
    "url": "https://halo-universe.davichostar.dev/",
    "file": "halo-universe-chronicle.png"
  },
  {
    "title": "Alberto Licea · Portfolio",
    "url": "https://albertolicea00.vercel.app/",
    "file": "alberto-licea-portfolio.png"
  },
  {
    "title": "Plantilla Portfolio UX · Wix",
    "url": "https://es.wix.com/website-template/view/html/1885?originUrl=https%3A%2F%2Fes.wix.com%2Fwebsite%2Ftemplates%2Fhtml%2Fportfolio-cv%2Fresumes-cvs&tpClick=view_button&esi=437cf9ec-0f00-4b69-9546-569722324eaa",
    "file": "plantilla-portfolio-ux-wix.png"
  }
];

const outputDir = path.resolve('public', 'images', 'resources');
const failuresPath = path.resolve('screenshots-fallidos.json');

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  locale: 'es-ES',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36'
});

const failures = [];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function tryAcceptCookies(page) {
  const selectors = [
    'button:has-text("Aceptar")',
    'button:has-text("Aceptar todo")',
    'button:has-text("Aceptar todas")',
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("Allow all")'
  ];

  for (const selector of selectors) {
    try {
      const button = page.locator(selector).first();
      if (await button.isVisible({ timeout: 400 })) {
        await button.click({ timeout: 1000 });
        await page.waitForTimeout(300);
        return;
      }
    } catch {}
  }
}

for (let i = 0; i < resources.length; i++) {
  const resource = resources[i];
  const filePath = path.join(outputDir, resource.file);

  console.log(`[${i + 1}/${resources.length}] ${resource.title}`);

  if (await exists(filePath)) {
    console.log(`  ↳ ya existe: ${resource.file}`);
    continue;
  }

  const page = await context.newPage();

  try {
    await page.goto(resource.url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(2500);
    await tryAcceptCookies(page);
    await page.waitForTimeout(800);

    await page.screenshot({
      path: filePath,
      type: 'png',
      fullPage: false
    });

    console.log(`  ✓ guardada: ${resource.file}`);
  } catch (error) {
    console.log(`  ✗ fallo: ${error.message}`);

    failures.push({
      title: resource.title,
      url: resource.url,
      file: resource.file,
      error: error.message
    });
  } finally {
    await page.close();
  }
}

await browser.close();

await fs.writeFile(
  failuresPath,
  JSON.stringify(failures, null, 2),
  'utf8'
);

console.log('');
console.log(`Capturas terminadas: ${resources.length - failures.length}`);
console.log(`Fallos: ${failures.length}`);
console.log(`Carpeta: ${outputDir}`);
console.log(`Informe: ${failuresPath}`);
