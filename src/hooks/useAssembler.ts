import { assemble, type AssemblerResult } from "../assembler.ts";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce.ts";

export interface UseAssemblerOptions {
  /** Source code to assemble */
  code: string;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
}

export interface UseAssemblerResult {
  /** Latest successful (or attempted) assembly result */
  assembly?: AssemblerResult;
}

/**
 * Manages debounced assembly and error handling for a given source code string.
 */
export function useAssembler(options: UseAssemblerOptions): UseAssemblerResult {
  const { code, debounceMs = 300 } = options;

  const [assembly, setAssembly] = useState<AssemblerResult | undefined>(undefined);
  const debouncedCode = useDebounce(code, debounceMs);

  useEffect(() => {
    // We want to handle empty string explicitly as "clear"
    if (debouncedCode === undefined) {
      return;
    }

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
  }, [debouncedCode]);

  return { assembly };
}
