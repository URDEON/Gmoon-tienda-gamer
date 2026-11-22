# Gmoon frontend

Frontend React/Vite de la tienda Gmoon.

## Desarrollo local

```powershell
npm install
npm run dev
```

El gateway Spring Boot debe estar activo en `http://localhost:5050`. Esa URL se puede cambiar en `VITE_GATEWAY_URL` (ver `.env.example`). `VITE_API_URL` sigue reservado para el servicio de correo local.

El login y registro usan `MS-seguridad` y `MS-usuarios`; el catálogo se carga desde `MS-productos`; el checkout registra la boleta en `MS-pedidos`. El JWT de acceso se mantiene en memoria. Una cookie `HttpOnly` permite renovar la sesión al recargar o expirar el token; al cerrar sesión se revoca. En producción, el gateway debe usar HTTPS y `REFRESH_COOKIE_SECURE=true`.

Las rutas `/admin`, `/vendedor` y `/mis-compras` muestran vistas distintas según rol. El gateway vuelve a comprobar cada permiso: ADMIN administra el catálogo y usuarios, VENDEDOR consulta catálogo y boletas, y CLIENTE consulta sus propias boletas. Si falla el backend, la pantalla muestra el error y no simula que la compra se registró.

El backend vuelve a validar el precio, descuento y stock disponible al registrar la boleta. Como el pago es solo una simulación, el stock se valida pero no se descuenta ni reserva. El panel ADMIN administra productos y categorías y consulta boletas desde los microservicios; el panel VENDEDOR consulta catálogo y boletas y CLIENTE consulta su historial de boletas.

## Verificación

```powershell
npm run test:run
npm run lint
npm run build
```

El checkout registra la boleta, pero no procesa pagos reales ni reserva inventario.
