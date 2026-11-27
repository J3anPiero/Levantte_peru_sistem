"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { round2 } from "@/lib/format";
import { buildDemoWalletTxs, demoAccount, demoWalletBalance } from "@/data/demo-account";
import { publicAccount, type Account, type CustomerType, type StoredAccount, type WalletTx, type WalletTxType } from "@/lib/wallet";

/*
 * Autenticación y billetera de demostración.
 *
 * Todo vive en el navegador (localStorage) porque el proyecto todavía no tiene
 * API. Las contraseñas se derivan con PBKDF2 y nunca se guardan en claro, pero
 * esto NO es seguridad real: cualquiera con las herramientas de desarrollo puede
 * leer o editar el saldo de la billetera. Al conectar el backend, estas mismas
 * funciones deben pasar a llamar a la API y el saldo debe calcularse en el
 * servidor. Mientras tanto, no uses contraseñas reales.
 */

const ACCOUNTS_KEY = "gaudi-accounts-v1";
const SESSION_KEY = "gaudi-session-v1";
const PBKDF2_ITERATIONS = 150_000;

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
}

async function derive(password: string, salt: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Este navegador no permite cifrar la contraseña en esta conexión.");
  }
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(bits);
}

/** Comparación en tiempo constante, para no filtrar información por el tiempo de respuesta. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readAccounts(): Record<string, StoredAccount> {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) ?? "{}") as Record<string, StoredAccount>;
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* almacenamiento no disponible */
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/*
 * Deja lista la cuenta de demostración en este navegador. Se ejecuta una sola
 * vez: si ya está, no se toca, para que el saldo y los movimientos que se
 * generen comprando con ella no se pisen en cada recarga.
 *
 * Sale junto con src/data/demo-account.ts cuando el backend autentique de
 * verdad. Ver la nota de ese archivo.
 */
async function seedDemoAccount() {
  try {
    const accounts = readAccounts();
    if (accounts[demoAccount.email]) return;

    const salt = randomSalt();
    accounts[demoAccount.email] = {
      id: "u_demo",
      email: demoAccount.email,
      nombres: demoAccount.nombres,
      apellidos: demoAccount.apellidos,
      telefono: demoAccount.telefono,
      documento: demoAccount.documento,
      customerType: demoAccount.customerType,
      createdAt: new Date().toISOString(),
      salt,
      hash: await derive(demoAccount.password, salt),
      wallet: { balance: demoWalletBalance, txs: buildDemoWalletTxs() },
    };
    writeAccounts(accounts);
  } catch {
    // Sin almacenamiento o sin crypto.subtle simplemente no hay cuenta de
    // prueba; el registro normal sigue funcionando.
  }
}

export interface RegisterInput {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string;
  password: string;
  customerType: CustomerType;
}

interface AuthContextValue {
  user: Account | null;
  hydrated: boolean;
  busy: boolean;
  register: (input: RegisterInput) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  /** Abona o descuenta saldo y deja el movimiento registrado. */
  addTransaction: (tx: { type: WalletTxType; amount: number; note: string; orderNumber?: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      await seedDemoAccount();
      if (!alive) return;
      try {
        const id = window.localStorage.getItem(SESSION_KEY);
        if (id) {
          const account = Object.values(readAccounts()).find((a) => a.id === id);
          if (account) setUser(publicAccount(account));
        }
      } catch {
        /* almacenamiento no disponible */
      }
      setHydrated(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const email = normalizeEmail(input.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Ingresa un correo válido." };
    if (input.password.length < 8) return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
    if (!input.nombres.trim() || !input.apellidos.trim()) return { ok: false, error: "Ingresa tus nombres y apellidos." };

    setBusy(true);
    try {
      const accounts = readAccounts();
      if (accounts[email]) return { ok: false, error: "Ya existe una cuenta con ese correo." };

      const salt = randomSalt();
      const account: StoredAccount = {
        id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
        email,
        nombres: input.nombres.trim(),
        apellidos: input.apellidos.trim(),
        telefono: input.telefono.trim(),
        documento: input.documento.trim(),
        customerType: input.customerType,
        createdAt: new Date().toISOString(),
        salt,
        hash: await derive(input.password, salt),
        wallet: { balance: 0, txs: [] },
      };
      accounts[email] = account;
      writeAccounts(accounts);
      window.localStorage.setItem(SESSION_KEY, account.id);
      setUser(publicAccount(account));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "No se pudo crear la cuenta." };
    } finally {
      setBusy(false);
    }
  }, []);

  const login = useCallback(async (emailRaw: string, password: string) => {
    const email = normalizeEmail(emailRaw);
    setBusy(true);
    try {
      const account = readAccounts()[email];
      // El mismo mensaje para correo inexistente y contraseña incorrecta,
      // para no revelar qué correos están registrados.
      const genericError = { ok: false as const, error: "Correo o contraseña incorrectos." };
      if (!account) return genericError;
      const hash = await derive(password, account.salt);
      if (!safeEqual(hash, account.hash)) return genericError;
      window.localStorage.setItem(SESSION_KEY, account.id);
      setUser(publicAccount(account));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "No se pudo iniciar sesión." };
    } finally {
      setBusy(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
    setUser(null);
  }, []);

  /*
   * Los movimientos escriben en localStorage, así que el efecto ocurre fuera del
   * actualizador de estado: React puede invocar un actualizador dos veces en modo
   * estricto y eso duplicaría el saldo. El saldo se relee del almacenamiento en
   * cada llamada, de modo que varios movimientos seguidos se encadenan bien.
   */
  const addTransaction = useCallback<AuthContextValue["addTransaction"]>(
    ({ type, amount, note, orderNumber }) => {
      if (!user) return;
      const accounts = readAccounts();
      const stored = accounts[user.email];
      if (!stored) return;

      const tx: WalletTx = {
        id: `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        date: new Date().toISOString(),
        type,
        amount: round2(amount),
        note,
        orderNumber,
      };
      const balance = round2(stored.wallet.balance + tx.amount);
      if (balance < 0) return; // nunca dejar la billetera en negativo

      const updated: StoredAccount = { ...stored, wallet: { balance, txs: [tx, ...stored.wallet.txs].slice(0, 100) } };
      accounts[user.email] = updated;
      writeAccounts(accounts);
      setUser(publicAccount(updated));
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, hydrated, busy, register, login, logout, addTransaction }),
    [user, hydrated, busy, register, login, logout, addTransaction],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
