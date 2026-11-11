# LEVANTE PERÚ · Tienda virtual de repuestos

Frontend de la plataforma e-commerce de LEVANTE PERÚ, construido a partir de la propuesta de diseño
(lienzo: https://claude.ai/artifact/Qd4sXxghAQP5cwHHHCvpg4).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS 4 con tokens de marca en `src/app/globals.css`
- Iconos: lucide-react · Tipografías: Sora (títulos) e Inter (texto) vía `next/font`

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
npm run typecheck  # verificación de tipos
```

## Estructura

```
src/
  app/
    (tienda)/            Tienda pública: inicio, catálogo, producto, carrito, checkout, pedido, corporativas
    admin/               Panel administrativo (dashboard, productos, pedidos y módulos planificados)
  components/
    layout/              Header, footer, menú móvil
    product/             Tarjeta, galería, pestañas, ilustraciones de repuestos, cantidad
    cart/                Proveedor del carrito (localStorage), notificación, botón agregar
    catalog/             Filtros con envío automático, ordenamiento
    checkout/            Indicador de pasos
    admin/               Shell, navegación y pastillas de estado
  data/                  Catálogo de muestra: categorías, marcas, productos, pedidos, vehículos
  lib/                   Tipos, búsqueda y filtros, formato de precios, configuración del sitio
```

## Datos de muestra y qué reemplazar

- `src/lib/site.ts`: datos de la empresa (dirección, teléfono, WhatsApp, RUC, redes).
- `src/data/*.ts`: productos, categorías, marcas y pedidos de demostración. Al conectar la API,
  sustituir las funciones de `src/lib/catalog.ts` por llamadas al backend manteniendo las mismas firmas.
- Las imágenes de producto usan ilustraciones (`PartIllustration`) como marcador; añadir un campo
  `images` al producto y reemplazar en `product-card.tsx`, `gallery.tsx` y el carrito.
- Reseñas del inicio y textos legales marcados con corchetes: completar con contenido real.
- El pago con tarjeta muestra el espacio para el formulario de la pasarela (Culqi, Niubiz o Mercado Pago).
  Nunca se capturan datos de tarjeta en este frontend.

## Cupones de prueba

`FRENOS20` (20 % en frenos) y `BIENVENIDO10` (10 % general), definidos en `cart-provider.tsx`.

## Siguientes fases

1. API (NestJS + PostgreSQL) con los módulos de catálogo, pedidos, inventario, clientes y pagos.
2. Autenticación de clientes y del panel, con roles.
3. Integraciones: pasarela de pago, couriers, facturación electrónica SUNAT, correo transaccional.
