# Trabajo práctico 04

## Descripción

Esta aplicación web permite consultar mascotas en adopción y agregar nuevas mascotas de forma temporal mediante un formulario. La información se carga desde un archivo JSON y se mantiene en memoria mientras el servidor se encuentra activo.

## Instalación

1. Clonar el repositorio.
2. Ejecutar:

```bash
npm install
```

## Ejecución

```bash
npm start
```

Luego abrir la aplicación en:

```text
http://localhost:3000
```

## Páginas y rutas

- GET /: página de inicio.
- GET /mascotas: listado general de mascotas.
- GET /mascotas/nueva: formulario para crear una nueva mascota.
- GET /mascotas/:id: detalle de una mascota.
- POST /mascotas: procesamiento del formulario.

## Estructura de vistas

La aplicación utiliza EJS para renderizar HTML en el servidor. La estructura se organiza en:

- layout general: views/layouts/main.ejs
- vistas específicas: views/inicio.ejs, views/no-encontrado.ejs, views/mascotas/*
- parciales reutilizables: views/partials/encabezado.ejs y views/partials/pie.ejs

Un layout es la estructura común de todas las páginas. Una vista es el contenido particular de cada página. Un parcial es un fragmento reutilizable, por ejemplo el encabezado y el pie.

## Recursos estáticos

Los archivos CSS, imágenes y JavaScript se sirven con `express.static`, que expone la carpeta public como raíz pública. Por eso las rutas se usan como `/css/estilos.css`, `/img/mascota.svg` y `/js/app.js`, sin incluir `/public` en la URL.

## Formulario

El formulario se envía con `method="post"` hacia `/mascotas`. El servidor lee los datos con `express.urlencoded({ extended: false })` y valida que los campos estén completos. Si hay errores, responde con 400 y vuelve a renderizar el formulario conservando los valores ingresados.

## Persistencia de los datos

Los datos iniciales se leen desde `datos/mascotas.json`. Cuando se envía un formulario válido, la nueva mascota se agrega únicamente en memoria al arreglo de la aplicación. Esto significa que el registro existe mientras el servidor siga activo y desaparece al reiniciarlo. Por eso no se escribe el nuevo registro en el archivo JSON.

## Diferencia entre layout, vista y parcial

- `layout`: estructura HTML global compartida con encabezado, contenido principal y pie.
- `vista`: contenido de cada ruta renderizada por EJS.
- `parcial`: fragmento reutilizable de una vista, como la navegación o el pie de página.

## Datos enviados mediante res.render

`res.render` recibe una plantilla y un objeto con variables. Esa información se usa dentro de la vista para mostrar textos, condiciones y recorridos de datos; por ejemplo, la lista de mascotas o el título de cada página.

## POST, redirección y GET

Cuando un formulario es válido, el servidor agrega la mascota al arreglo y responde con una redirección (`res.redirect("/mascotas")`). El navegador realiza una nueva solicitud GET a la ruta correspondiente y muestra la información actualizada. Si la información es inválida, se responde con 400 para volver al formulario con un mensaje de error.

## Importante

La aplicación usa `node:path` para construir rutas del proyecto y `__dirname` para resolver ubicaciones de archivos de forma segura.
