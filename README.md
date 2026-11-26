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

npm run precios          # carga src/data/precios.csv en el catálogo
npm run datos:vehiculos  # regenera marcas, modelos y nomenclatura desde data-source/
npm run datos:productos  # regenera el catálogo amplio
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

## Ciudad sede

La tienda opera desde **Arequipa**. La ciudad vive en `src/lib/site.ts` (`city`, `metroArea`,
`address`) y de ahí la toman los textos de envío, el almacén, las preguntas frecuentes y el checkout,
así que para mudar la sede basta con cambiar esos campos. El reparto propio con entrega en 24 h es
`localShippingCost`; el resto del país va por courier con `provinceShippingCost`. La lista de
distritos del checkout es la de Arequipa y el departamento por defecto también.

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
- `src/data/precios.csv`: la lista de precios del negocio, hoy vacía. Ver [Precios](#precios).
- Las imágenes de producto usan ilustraciones (`PartIllustration`) como marcador; añadir un campo
  `images` al producto y reemplazar en `product-card.tsx`, `gallery.tsx` y el carrito.
- Reseñas del inicio, cifras del hero y textos legales marcados con corchetes: completar con contenido real.
- El pago con tarjeta muestra el espacio para el formulario de la pasarela (Culqi, Niubiz o Mercado Pago).
  Nunca se capturan datos de tarjeta en este frontend.

## Búsqueda por voz

El buscador de la cabecera (`src/components/search/search-bar.tsx`) usa la Web Speech API con
`lang = "es-PE"`. El botón del micrófono solo aparece si el navegador la soporta, que hoy son los
basados en Chromium y Safari; en Firefox el buscador funciona igual pero sin micrófono. Mientras
escucha muestra el texto provisional y, al cerrar la frase, navega a `/catalogo?q=…`. Los errores de
permiso, de micrófono ausente y de red se traducen a un mensaje en español. El dictado necesita
conexión segura: funciona en `localhost` y en HTTPS, no en HTTP de red.

## Base automotriz (car-api)

El catálogo se apoya en la base del paquete **auto-parts-db** ([lifeofcapo/car-api](https://github.com/lifeofcapo/car-api),
licencia MIT), con los nombres de pieza ya traducidos al español. Pese al nombre, no es una API: es
un paquete de datos estáticos en JSON, sin servidor, endpoints ni base de datos.

Los JSON originales viven en `data-source/` y **no los importa la aplicación**. De ahí sale, con
`node scripts/generar-datos-vehiculos.mjs`, lo que sí se versiona y se usa:

| Generado | Contenido |
|---|---|
| `src/data/vehicles.ts` | 142 marcas y 2 387 modelos con su rango de años |
| `src/data/part-types.ts` | 1 521 tipos de pieza (nombre en español, slug en inglés) |

Tres decisiones que conviene conocer:

- **La base es europea y le faltan modelos que sí vendemos.** El script añade ocho del mercado
  peruano (Versa, Frontier, Sail, Onix, D-Max, Gol, Mazda 2 y Mazda 3); sin ellos, los repuestos que
  los declaran compatibles quedarían huérfanos y el buscador por placa no hallaría el vehículo.
- **La nomenclatura no es stock.** Tener el nombre de una pieza no significa tenerla en almacén.
  Solo los productos de `src/data/products.ts` tienen precio y stock; se enlazan a la nomenclatura
  con el campo `partType`. De 21 productos, 19 tienen equivalente exacto: la batería de 12 V y el kit
  de accesorios de pastillas no lo tienen (la base solo trae batería de alto voltaje).
- **`part-types.ts` pesa 110 KB y solo se usa desde el servidor** (`src/lib/parts-index.ts`), así que
  no viaja al navegador. `vehicles.ts` sí llega al cliente porque el selector lo necesita al instante.

### El catálogo de productos

`src/data/products.ts` combina dos orígenes, y la diferencia importa:

| Archivo | Qué es | OEM |
|---|---|---|
| `products-core.ts` | 21 fichas escritas a mano, con descripción propia | Verificado |
| `products-generated.ts` | 176 productos generados con `scripts/generar-productos.mjs` | Sin asignar |

En los generados, **el nombre de la pieza y la compatibilidad son reales**: el nombre sale de la
nomenclatura y la compatibilidad de las generaciones declaradas en la base, con su rango de años.
Las marcas de repuesto son fabricantes que existen y cada plantilla solo admite los que fabrican esa
familia, así que ninguna asigna filtros a Brembo.

**Lo que no es real y hay que reemplazar antes de publicar**: el stock es de muestra y los precios
son marcadores dentro de bandas de mercado (ver [Precios](#precios)).

**No se generan números OEM a propósito.** Inventar un número de parte es el error más caro de una
tienda de repuestos, porque hace que el cliente compre una pieza que no calza; se cargan desde el
catálogo del proveedor. Por eso `oem` queda sin definir en los 176 generados.

La generación es determinista: la misma entrada produce siempre el mismo archivo, así que el diff
solo cambia cuando cambian los datos o las reglas.

## Precios

El precio que trae un producto en `products-core.ts` o `products-generated.ts` **no es el precio del
negocio**: es un marcador sorteado dentro de la banda de su familia de pieza. El precio real se carga
aparte, por SKU, y pisa al marcador.

### Cómo se cargan

1. Abre `src/data/precios.csv` y agrega una fila por SKU:
   `sku,precio,precio_lista,costo`. Solo `sku` y `precio` son obligatorios; `precio_lista` es el
   tachado de la oferta y `costo` solo se ve en el panel.
2. Corre `npm run precios`. El script valida y escribe `src/data/price-list.ts`.
3. `src/data/products.ts` une la lista con el catálogo por SKU.

El script **falla sin escribir nada** y dice la línea exacta si un SKU no existe, está repetido, el
precio no es un número o el precio de lista es menor que el de venta. Avisa, sin bloquear, cuando el
precio queda por debajo del costo. Un precio mal cargado se cobra mal, así que no se tolera a medias.

Mientras un SKU no esté en el CSV, su producto queda con `priceEstimated: true`. La tienda no muestra
esa marca; el panel de productos sí, con un aviso de cuántos faltan, para que nadie publique creyendo
que los precios ya están.

Esta separación existe porque el catálogo grande se regenera: si los precios reales vivieran en los
archivos generados, cada regeneración los borraría.

### De dónde salen las bandas

Dieciséis de las treinta y nueve familias (85 de los 176 productos generados) tienen su banda tomada
de precios de venta al público publicados por tiendas peruanas y Mercado Libre Perú, consultados en
noviembre de 2026. La tabla con los rangos y los ejemplos concretos está en la cabecera de
`scripts/generar-productos.mjs`, junto a las plantillas marcadas con `banda: "mercado"`.

Las demás conservan una banda estimada. No hay precios peruanos publicados para alternadores,
arrancadores, bombas de agua, espejos ni sensores de autos livianos: las tiendas que los listan piden
cotización por placa o por código OEM.

Son precios de anuncio, no de compra verificada, y cambian por motor, año y marca. Sirven para que la
tienda se vea coherente mientras llega la lista del proveedor; **el margen y el precio final son una
decisión del negocio, no de este repositorio**.

### La nomenclatura

La página `/piezas` recorre la nomenclatura con buscador, índice alfabético y paginación, marcando lo
que hay en stock. Cada tipo con stock enlaza a `/catalogo?pieza=<slug>`; el parámetro se llama `pieza`
y no `tipo` porque ese último ya lo ocupa el filtro de original contra alternativo.

## Buscador por placa y desguace

En `/placa` se escribe la placa, se obtiene el VIN, se despieza el vehículo por sistemas y se listan
las piezas del catálogo que le corresponden, marcando cuáles tienen stock.

- `src/lib/plate.ts` valida los formatos peruanos (ABC-123 y A1B-234) y arma el VIN. El dígito
  verificador se calcula con el algoritmo ISO 3779, así que los VIN generados pasan la validación del
  estándar en lugar de ser cadenas al azar.
- `src/data/plates.ts` es el padrón **sintético**: ocho vehículos elegidos para cubrir los modelos con
  piezas en el catálogo, más un Chevrolet Sail sin repuestos específicos para ver el comportamiento
  cuando solo hay piezas universales. `lookupPlate` es el único punto a reemplazar cuando exista el
  servicio real; ya simula la latencia de una API para que la interfaz muestre su estado de carga.
- `src/lib/teardown.ts` define las siete zonas del despiece y las cruza con el catálogo. Una pieza sin
  compatibilidades declaradas (líquido de frenos, por ejemplo) se marca como universal en vez de
  descartarse.
- `src/components/plate/car-diagram.tsx` dibuja el vehículo de perfil. Los puntos son botones HTML
  sobre el SVG, no elementos del dibujo, para que funcionen con teclado y lector de pantalla.

**Ninguna placa ni VIN corresponde a un vehículo real.** En producción la consulta debe resolverse
contra el servicio oficial (en Perú, SUNARP o el MTC): son datos personales de terceros y su
tratamiento exige convenio y base legal, además de registrar el consentimiento de quien consulta.

## Cuentas y billetera con cashback

`src/lib/wallet.ts` define los tres niveles del programa, con su porcentaje y su tope por pedido:

| Nivel | Cashback | Tope | Cuándo aplica |
|---|---|---|---|
| Compra regular | 2.5% | S/ 20 | Compras regulares y repuestos originales |
| Compra mayor | 5% | S/ 40 | Pedido sobre S/ 500, o mayoría de repuestos alternativos |
| Taller o mecánico | 7% | S/ 80 | Cuentas registradas como taller |

Dos reglas de negocio quedaron fijadas en el código y conviene revisarlas: el saldo se aplica
primero a los repuestos y después al envío, y el cashback se calcula sobre el dinero realmente
pagado, descontando el saldo usado, para que la billetera no se retroalimente.

**Esto es una capa de demostración.** Las cuentas viven en `localStorage` del navegador. Las
contraseñas se derivan con PBKDF2 (150 mil iteraciones, SHA-256, sal por usuario) y nunca se guardan
en claro, pero cualquiera con las herramientas de desarrollo puede leer o editar el saldo. No es
seguridad real. Al conectar la API, `src/components/auth/auth-provider.tsx` debe pasar a llamar al
backend y el saldo debe calcularse y validarse en el servidor.

## Cupones de prueba

`FRENOS20` (20 % en frenos) y `BIENVENIDO10` (10 % general), definidos en `cart-provider.tsx`.

## Siguientes fases

1. API (NestJS + PostgreSQL) con los módulos de catálogo, pedidos, inventario, clientes y pagos.
2. Autenticación de clientes y del panel, con roles.
3. Integraciones: pasarela de pago, couriers, facturación electrónica SUNAT, correo transaccional.
