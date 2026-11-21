# Gmoon frontend

Frontend React/Vite de la tienda Gmoon.

## Desarrollo local

```powershell
npm install
npm run dev
```

El gateway Spring Boot debe estar activo en `http://localhost:5050`. Esa URL se puede cambiar en `VITE_GATEWAY_URL` (ver `.env.example`). `VITE_API_URL` sigue reservado para el servicio de correo local.

El login y registro usan `MS-seguridad` y `MS-usuarios`; el catálogo se carga desde `MS-productos`; el checkout registra la boleta en `MS-pedidos`. El token JWT se envía en las peticiones protegidas. Si falla el backend, la pantalla muestra el error y no simula que la compra se registró.

El backend vuelve a validar el precio, descuento y stock disponible al registrar la boleta. Como el pago es solo una simulación, el stock se valida pero no se descuenta ni reserva. En el panel, la gestión de usuarios usa el backend; los productos, categorías e historial administrativo todavía se mantienen localmente.

## Verificación

```powershell
npm run test:run
npm run lint
npm run build
```

El checkout registra la boleta, pero no procesa pagos reales ni reserva inventario.
