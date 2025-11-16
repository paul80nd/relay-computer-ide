import { assemble, type AssemblerResult } from "../assembler.ts";
import { useCallback, useEffect, useState } from "react";
import useDebounce from "./useDebounce.ts";

export interface UseAssemblerOptions {
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** localStorage key for persisting source code (default: 'code') */
  storageKey?: string;
}

export interface UseAssemblerResult {
  /** Latest successful (or attempted) assembly result */
  assembly: AssemblerResult | undefined;
  /** Handler for editor code changes. */
  onCodeChange: (code?: string) => void;
}

/**
 * Manages source code, debounced assembly, persistence, and error handling.
 */
export function useAssembler(options: UseAssemblerOptions = {}): UseAssemblerResult {
  const { debounceMs = 300, storageKey = 'code' } = options;

  const [code, setCode] = useState<string>('');
  const [assembly, setAssembly] = useState<AssemblerResult | undefined>(undefined);

  const debouncedCode = useDebounce(code, debounceMs);

  const onCodeChange = useCallback((value?: string) => {
    setCode(value ?? '');
  }, []);

  useEffect(() => {
    // We want to handle empty string explicitly as "clear"
    if (debouncedCode === undefined) {
      return;
    }

    // Persist the current code even if it's empty
    localStorage.setItem(storageKey, debouncedCode);

    // Treat empty code as "no assembly"
    if (debouncedCode.trim().length === 0) {
      setAssembly(undefined);
      return;
    }

    try {
      const result = assemble(debouncedCode);
      setAssembly(result);
    } catch (err) {
      console.error('Error assembling code', err);
      // In case of failure, clear the current assembly to avoid stale output
      setAssembly(undefined);
    }
  }, [debouncedCode, storageKey]);

  return { assembly, onCodeChange };
}
