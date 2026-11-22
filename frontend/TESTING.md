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

| Archivos | Casos cubiertos |
|---|---|
| `src/api/*.test.js` | Integración HTTP del catálogo, usuarios, boletas, registro de cuentas, CRUD administrativo, renovación del token, reintento de solicitudes y errores de API. |
| `src/components/Ruta*.test.jsx` | Acceso y redirección según sesión y roles ADMIN, VENDEDOR y CLIENTE. |
| `src/pages/Checkout.test.jsx` | Creación de boleta y limpieza del carrito solo tras éxito; conservación del carrito y notificación ante error. |
| `src/utils/*.test.js` | Validaciones de formularios y limpieza de tokens antiguos del almacenamiento local. |
| `shared/calcularTotalesCompra.test.js` | Cálculo del IVA con total explícito; subtotal y total calculados desde los productos; carrito vacío. |

## Resultado medido

Última ejecución: **45 pruebas aprobadas en 13 archivos**.

| Métrica global | Resultado |
|---|---:|
| Sentencias | 23,24 % (265/1140) |
| Ramas | 22,93 % (172/750) |
| Funciones | 18,20 % (63/346) |
| Líneas | 23,72 % (246/1037) |

El porcentaje global es bajo porque el reporte incluye toda la aplicación y la
mayoría de páginas, contextos, hooks y componentes todavía no tienen pruebas
automatizadas. Las pruebas cubren rutas críticas de autenticación, roles,
integración de API y checkout, pero **la cobertura global aún no alcanza el 70 %**.
El porcentaje no debe interpretarse como cobertura completa de los flujos de la tienda.

## Alcance de Bootstrap

Las columnas responsivas del catálogo, ofertas, categorías y computadores usan
la grilla de Bootstrap (`row`, `g-*`, `col-*` y breakpoints `sm`/`lg`). Las reglas
CSS propias que antes definían esas mismas columnas se retiraron. Las media
queries restantes ajustan aspectos visuales específicos, como tipografía y
espaciado.
