# Cobertura de testing

## Ejecución

Desde la carpeta `frontend`:

```bash
npm run test:run
npm run test:coverage
```

Vitest usa el proveedor V8 y mide los archivos JavaScript y JSX de `src/` y los
archivos JavaScript de `shared/`. El comando de cobertura genera un reporte de
consola, `coverage/lcov.info` y el reporte HTML en `coverage/lcov-report/`.

## Pruebas automatizadas incluidas

| Archivo | Casos cubiertos |
|---|---|
| `src/components/RutaAdmin.test.jsx` | Redirección de usuario no autenticado; redirección de usuario no administrador; acceso de administrador. |
| `src/utils/validaciones.test.js` | Nombre válido, vacío y demasiado corto; correo válido, vacío e inválido; contraseña válida, vacía y demasiado corta; confirmación coincidente, diferente y vacía. |
| `shared/calcularTotalesCompra.test.js` | Cálculo del IVA con total explícito; subtotal y total calculados desde los productos; carrito vacío. |

## Resultado medido

Última ejecución: **18 pruebas aprobadas en 3 archivos**.

| Métrica global | Resultado |
|---|---:|
| Sentencias | 4,50 % (37/821) |
| Ramas | 4,82 % (26/539) |
| Funciones | 2,77 % (7/252) |
| Líneas | 3,78 % (28/739) |

El porcentaje global es bajo porque el reporte incluye toda la aplicación y la
mayoría de páginas, contextos, hooks y componentes todavía no tienen pruebas
automatizadas. Las pruebas actuales verifican principalmente control de acceso,
validaciones de formulario y cálculo del total de compra; el porcentaje no debe
interpretarse como cobertura completa de los flujos de la tienda.

## Alcance de Bootstrap

Las columnas responsivas del catálogo, ofertas, categorías y computadores usan
la grilla de Bootstrap (`row`, `g-*`, `col-*` y breakpoints `sm`/`lg`). Las reglas
CSS propias que antes definían esas mismas columnas se retiraron. Las media
queries restantes ajustan aspectos visuales específicos, como tipografía y
espaciado.
