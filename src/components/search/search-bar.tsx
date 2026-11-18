"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Mic, Search, X } from "lucide-react";

/*
 * Tipos mínimos de la Web Speech API. No están en las definiciones estándar de
 * TypeScript porque la especificación sigue siendo un borrador.
 */
interface SpeechAlternative {
  transcript: string;
}
interface SpeechResult {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechAlternative;
}
interface SpeechResultList {
  readonly length: number;
  [index: number]: SpeechResult;
}
interface SpeechResultEvent extends Event {
  resultIndex: number;
  results: SpeechResultList;
}
interface SpeechErrorEvent extends Event {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const errorMessages: Record<string, string> = {
  "not-allowed": "No diste permiso al micrófono. Actívalo en el candado de la barra de direcciones.",
  "service-not-allowed": "El navegador bloqueó el dictado. Revisa los permisos del sitio.",
  "no-speech": "No te escuché. Toca el micrófono e intenta de nuevo.",
  "audio-capture": "No encontramos un micrófono conectado.",
  "network": "Se perdió la conexión mientras escuchábamos.",
  "aborted": "",
};

export function SearchBar({ initialQuery = "", className }: { initialQuery?: string; className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [status, setStatus] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // La detección se hace tras montar para que el servidor y el cliente rindan lo mismo.
  useEffect(() => {
    setSupported(Boolean(getRecognitionCtor()));
    return () => recognitionRef.current?.abort();
  }, []);

  const submit = useCallback(
    (value: string) => {
      const q = value.trim();
      if (!q) return;
      router.push(`/catalogo?q=${encodeURIComponent(q)}`);
    },
    [router],
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const listen = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    if (listening) {
      stop();
      return;
    }

    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = "es-PE";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let text = "";
      let final = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        text += result[0]?.transcript ?? "";
        if (result.isFinal) final = true;
      }
      if (final) {
        const clean = text.trim();
        setQuery(clean);
        setInterim("");
        setListening(false);
        setStatus(clean ? `Buscando “${clean}”` : "");
        recognition.stop();
        submit(clean);
      } else {
        setInterim(text);
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      setInterim("");
      setStatus(errorMessages[event.error] ?? "No se pudo usar el micrófono.");
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

    try {
      setStatus("");
      setInterim("");
      setListening(true);
      recognition.start();
    } catch {
      setListening(false);
      setStatus("El dictado ya estaba activo.");
    }
  }, [listening, stop, submit]);

  return (
    <div className={clsx("relative flex flex-col", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className={clsx(
          "flex h-12 overflow-hidden rounded-xl bg-white transition-all duration-300",
          listening ? "ring-2 ring-brand" : "focus-within:ring-2 focus-within:ring-brand",
        )}
      >
        <label htmlFor="header-q" className="sr-only">
          Buscar repuesto
        </label>
        <input
          id="header-q"
          ref={inputRef}
          name="q"
          type="search"
          value={listening && interim ? interim : query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={listening ? "Escuchando…" : "Busca por nombre, código o número de pieza"}
          className="min-w-0 flex-1 border-0 px-4 text-sm text-ink placeholder:text-muted focus:outline-none"
        />

        {query && !listening && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setQuery("");
              setStatus("");
              inputRef.current?.focus();
            }}
            className="flex w-9 cursor-pointer items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}

        {supported && (
          <button
            type="button"
            onClick={listen}
            aria-pressed={listening}
            aria-label={listening ? "Detener el dictado" : "Buscar por voz"}
            title={listening ? "Detener el dictado" : "Buscar por voz"}
            className={clsx(
              "relative flex w-11 cursor-pointer items-center justify-center border-l border-line transition-colors",
              listening ? "text-brand" : "text-muted hover:text-brand",
            )}
          >
            {listening && <span aria-hidden="true" className="absolute size-7 animate-ping rounded-full bg-brand/30" />}
            <Mic className="relative size-[18px]" strokeWidth={2} />
          </button>
        )}

        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 bg-brand px-4 text-sm font-bold text-white transition-colors duration-300 hover:bg-brand-deep md:px-5"
        >
          <Search className="size-[18px]" strokeWidth={2.2} />
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </form>

      {(status || listening) && (
        <p
          role="status"
          aria-live="polite"
          className="absolute top-full left-0 z-20 mt-1.5 rounded-lg bg-black/90 px-3 py-1.5 text-xs text-white shadow-card"
        >
          {listening ? "Escuchando… di el repuesto que buscas" : status}
        </p>
      )}
    </div>
  );
}
