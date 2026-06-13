# Desafio PokeAPI

Proyecto de pruebas automatizadas de API con Cypress contra PokeAPI.

## Requisitos

- Node.js
- npm

## Instalacion

Desde la carpeta del proyecto:

```powershell
cd "G:\ProyectoPlaywright\TecNova Desafio\Desafio pokeapi"
npm install
```

## Ejecutar todas las pruebas

```powershell
npm test
```

## Ejecutar solo pruebas de API

```powershell
npm run test:api
```

## Abrir Cypress en modo visual

```powershell
npm run test:open
```

Luego seleccionar:

1. `E2E Testing`
2. El navegador disponible
3. El spec `pokeapi.cy.js`

## Nota para Windows

Los scripts usan una cache local `.cypress-cache` y limpian la variable `ELECTRON_RUN_AS_NODE` antes de abrir Cypress. Esto evita problemas comunes al ejecutar Cypress en Windows.

## Casos cubiertos

- `GET /berry/1` con ID valido.
- `GET /berry/999999` con ID no valido.
- `GET /berry/cheri` con nombre valido.
- `GET /berry/berry-inexistente` con nombre no valido.
- `GET /berry-flavor/spicy` con nombre valido.
- Busqueda de la baya picante con mayor potencia y consulta posterior a `GET /berry/{nombre}`.

## Apoyo con IA

Se utilizo una herramienta apoyada en IA como ayuda para analizar los requerimientos, proponer validaciones, depurar errores de configuracion y ordenar los pasos de ejecucion. Las pruebas finales fueron ejecutadas localmente con Cypress.
