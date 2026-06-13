# Desafio IMDB

Proyecto de automatizacion web con Playwright para validar distintos flujos en IMDb.

## Requisitos

- Node.js
- npm

## Instalacion

Desde la carpeta del proyecto:

```powershell
cd "G:\ProyectoPlaywright\TecNova Desafio\Desafio IMDB"
npm install
```

Si los navegadores de Playwright no estan instalados, ejecutar:

```powershell
npx playwright install
```

## Ejecutar todas las pruebas

```powershell
npm test
```

Las pruebas se ejecutan en los proyectos configurados en `playwright.config.ts`:

- Chromium
- Firefox

## Ejecutar con navegador visible

```powershell
npm run test:headed
```

## Ejecutar con interfaz de Playwright

```powershell
npm run test:ui
```

## Ver reporte HTML

Despues de ejecutar las pruebas:

```powershell
npm run report
```

## Captura de pantalla solicitada

El spec `imdb-celebridades-nacidas-hoy-40-anios-atras.spec.ts` genera las capturas dentro de la carpeta:

```text
screenshots/
```

Como las pruebas corren en Chromium y Firefox, los archivos quedan con estos nombres:

```text
screenshots/imdb-celebridades-nacidas-hoy-40-anios-atras-chromium.png
screenshots/imdb-celebridades-nacidas-hoy-40-anios-atras-firefox.png
```

Estos nombres permiten ubicar rapidamente la captura solicitada y saber con que navegador fue generada.

## Specs incluidos

- `imdb-nicolas-cage.spec.ts`
- `imdb-pelicula-taquillera.spec.ts`
- `imdb-fotos-danny-trejo.spec.ts`
- `imdb-cumpleanios-celebridades.spec.ts`
- `imdb-celebridades-nacidas-hoy-40-anios-atras.spec.ts`

## Apoyo con IA

Se utilizo una herramienta apoyada en IA como ayuda para analizar requerimientos, revisar localizadores, depurar errores y ordenar la implementacion. Las pruebas finales fueron ejecutadas localmente con Playwright.
