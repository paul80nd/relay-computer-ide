import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

export interface UseCodeStorageOptions {
  /** localStorage key for persisting source code (default: 'code') */
  storageKey?: string;
  /** Whether to auto-save on every change (default: true) */
  autoSave?: boolean;
  /** Optional default code when nothing is in storage */
  defaultCode?: string;
  /** Debounce delay for auto-save writes, in ms (default: 500) */
  autoSaveDebounceMs?: number;
}

export interface UseCodeStorageResult {
  code: string;
  /** Call when the editor code changes */
  onCodeChange: (value: string) => void;
  /** Explicitly persist the current code when autoSave is false */
  save: () => void;
  /** True when there are unsaved changes (only meaningful if autoSave is false) */
  dirty: boolean;
}


/**
 * Manages editor source code, initial load from localStorage, and optional auto-save.
 */
export function useCodeStorage(options: UseCodeStorageOptions = {}): UseCodeStorageResult {
  const {
    storageKey = 'code',
    autoSave = true,
    defaultCode = '',
    autoSaveDebounceMs = 500,
  } = options;

  const [code, setCode] = useState<string>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ?? defaultCode;
  });
  const [dirty, setDirty] = useState<boolean>(false);

  const onCodeChange = (value: string) => {
    setCode(value);
    setDirty(true);
  };

  // Keep the latest code in a ref so save() and the beforeunload flush
  // don't need to re-bind when code changes.
  const codeRef = useRef(code);
  useEffect(() => { codeRef.current = code; });

  // Auto-save: write the debounced code to localStorage instead of on every keystroke.
  // Skip the first run so the just-loaded value isn't immediately written back.
  const debouncedCode = useDebounce(code, autoSaveDebounceMs);
  const didMountRef = useRef(false);
  useEffect(() => {
    const isFirstRun = !didMountRef.current;
    didMountRef.current = true;
    if (!autoSave) return;
    if (isFirstRun) return;
    localStorage.setItem(storageKey, debouncedCode);
    setDirty(false);
  }, [autoSave, debouncedCode, storageKey]);

  // Flush any pending auto-save before the tab unloads, so changes typed inside
  // the debounce window aren't lost.
  useEffect(() => {
    if (!autoSave) return;
    const handler = () => {
      localStorage.setItem(storageKey, codeRef.current);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [autoSave, storageKey]);

  const save = useCallback(() => {
    localStorage.setItem(storageKey, codeRef.current);
    setDirty(false);
  }, [storageKey]);

  return { code, onCodeChange, save, dirty };
}
