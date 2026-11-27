import type { CustomerType, WalletTx } from "@/lib/wallet";

/*
 * Cuenta de cliente de demostración.
 *
 * Las cuentas de GAUDI viven en el navegador de cada visitante (localStorage),
 * así que no hay nada que "entregar": una cuenta creada en un equipo no existe
 * en otro. Esta se siembra sola la primera vez que se abre el sitio, en cualquier
 * navegador, para que se pueda entrar al área de cliente —billetera, niveles de
 * cashback y movimientos— sin registrarse antes.
 *
 * Viene con saldo y con movimientos porque un área de cliente vacía no enseña
 * nada: lo que hay que poder ver es cómo se acredita el cashback y cómo se
 * descuenta al pagar.
 *
 * ESTO SE BORRA CUANDO ENTRE EL BACKEND. Una contraseña publicada en el
 * repositorio solo es admisible mientras no haya servidor, ni datos de nadie,
 * ni dinero real detrás. En cuanto la API autentique de verdad hay que eliminar
 * este archivo, la siembra de auth-provider.tsx y el botón de acceso rápido del
 * formulario de ingreso.
 */

export const demoAccount = {
  email: "cliente@demo.gaudi.pe",
  /** Solo de demostración. No es la contraseña de nadie ni protege nada. */
  password: "clientedemo",
  nombres: "Diego",
  apellidos: "Salas Quispe",
  telefono: "958 412 770",
  documento: "70412885",
  customerType: "persona" as CustomerType,
} as const;

/**
 * Movimientos de ejemplo, en días hacia atrás desde el momento de la siembra,
 * para que las fechas se lean recientes sin importar cuándo se abra el sitio.
 * La suma de los importes es el saldo: 22.40 + 37.90 − 13.00 = 47.30.
 */
const demoTxs: Array<Omit<WalletTx, "id" | "date"> & { hace: number }> = [
  {
    hace: 3,
    type: "pago",
    amount: -13,
    note: "Saldo aplicado a tu pedido",
    orderNumber: "LP-2026-005218",
  },
  {
    hace: 3,
    type: "cashback",
    amount: 37.9,
    note: "Cashback por compra mayor",
    orderNumber: "LP-2026-005218",
  },
  {
    hace: 26,
    type: "cashback",
    amount: 22.4,
    note: "Cashback por tu pedido",
    orderNumber: "LP-2026-005047",
  },
];

export const demoWalletBalance = 47.3;

/** Los movimientos con fecha e identificador ya resueltos, más recientes primero. */
export function buildDemoWalletTxs(): WalletTx[] {
  const day = 24 * 60 * 60 * 1000;
  return demoTxs.map(({ hace, ...tx }, i) => ({
    ...tx,
    id: `t_demo${i}`,
    date: new Date(Date.now() - hace * day).toISOString(),
  }));
}
