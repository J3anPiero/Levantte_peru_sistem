# GAUDI · Tienda virtual de repuestos

Frontend de la plataforma e-commerce de GAUDI, construido a partir de la propuesta de diseño
(lienzo original: https://claude.ai/artifact/Qd4sXxghAQP5cwHHHCvpg4).

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

## Identidad

- **Negro**: `#000000` en cabecera, pie y panel; `#09090b` y `#121215` para superficies oscuras.
- **Rojo de marca**: `#e10600`, con `#b60400` para estados activos y `#ff2a1f` para destellos.
- **Logo**: `public/marca/gaudi-logo.jpg` (logotipo completo) y `public/marca/gaudi-isotipo.jpg` (la G).
  Los archivos tienen fondo negro, por eso se componen con `mix-blend-mode: screen` sobre superficies
  negras. El modo de mezcla solo actúa dentro de su contexto de apilamiento: si un contenedor animado
  (por ejemplo con `transform`) envuelve la imagen, el resplandor que deba verse a través tiene que
  pintarse dentro de ese mismo contenedor.
- En tamaños pequeños el logotipo completo no se lee (las letras "AUDI" son negras sobre negro), por eso
  el componente `Logo` combina el isotipo con un logotipo tipográfico. `LogoArtwork` sirve el archivo
  original para usos grandes sobre negro.

## Animaciones

Definidas como tokens `--animate-*` en `globals.css`, con sus `@keyframes` en el mismo archivo:

| Token | Uso |
|---|---|
| `animate-fade-up`, `animate-fade-in` | entradas escalonadas del hero y las secciones |
| `animate-scale-in`, `animate-slide-right` | logo del hero, menús laterales |
| `animate-float`, `animate-glow` | isotipo flotante y resplandores rojos |
| `animate-marquee` | carrusel infinito de marcas compatibles |
| `animate-toast-in` | notificación al agregar al carrito |

El componente `Reveal` (`src/components/ui/reveal.tsx`) revela bloques al entrar en pantalla con
`IntersectionObserver` y acepta un `delay` para escalonar listas. Todo el sistema respeta
`prefers-reduced-motion`, que desactiva animaciones y transiciones.

## Estructura

```
src/
  app/
    (tienda)/            Tienda pública: inicio, catálogo, producto, carrito, checkout, pedido, corporativas
    admin/               Panel administrativo (dashboard, productos, pedidos y módulos planificados)
    icon.jpg             Favicon generado desde el isotipo
  components/
    layout/              Header, footer, menú móvil
    product/             Tarjeta, galería, pestañas, ilustraciones de repuestos, cantidad
    cart/                Proveedor del carrito (localStorage), notificación, botón agregar
    catalog/             Filtros con envío automático, ordenamiento
    checkout/            Indicador de pasos
    admin/               Shell, navegación y pastillas de estado
    ui/                  Logo, revelado al scroll, migas de pan, plantilla de contenido
  data/                  Catálogo de muestra: categorías, marcas, productos, pedidos, vehículos
  lib/                   Tipos, búsqueda y filtros, formato de precios, configuración del sitio
public/marca/            Archivos del logotipo
```

## Datos de muestra y qué reemplazar

- `src/lib/site.ts`: datos de la empresa (dirección, teléfono, WhatsApp, RUC, redes).
- `src/data/*.ts`: productos, categorías, marcas y pedidos de demostración. Al conectar la API,
  sustituir las funciones de `src/lib/catalog.ts` por llamadas al backend manteniendo las mismas firmas.
- Las imágenes de producto usan ilustraciones (`PartIllustration`) como marcador; añadir un campo
  `images` al producto y reemplazar en `product-card.tsx`, `gallery.tsx` y el carrito.
- Reseñas del inicio, cifras del hero y textos legales marcados con corchetes: completar con contenido real.
- El pago con tarjeta muestra el espacio para el formulario de la pasarela (Culqi, Niubiz o Mercado Pago).
  Nunca se capturan datos de tarjeta en este frontend.

## Cupones de prueba

`FRENOS20` (20 % en frenos) y `BIENVENIDO10` (10 % general), definidos en `cart-provider.tsx`.

## Siguientes fases

1. API (NestJS + PostgreSQL) con los módulos de catálogo, pedidos, inventario, clientes y pagos.
2. Autenticación de clientes y del panel, con roles.
3. Integraciones: pasarela de pago, couriers, facturación electrónica SUNAT, correo transaccional.
