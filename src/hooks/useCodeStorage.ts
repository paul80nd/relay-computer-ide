import { useCallback, useEffect, useState } from "react";

export interface UseCodeStorageOptions {
  /** localStorage key for persisting source code (default: 'code') */
  storageKey?: string;
  /** Whether to auto-save on every change (default: true) */
  autoSave?: boolean;
  /** Optional default code when nothing is in storage */
  defaultCode?: string;
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
  } = options;

  const [code, setCode] = useState<string>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ?? defaultCode;
  });
  const [dirty, setDirty] = useState<boolean>(false);

  const onCodeChange = (value: string) => {
    setCode(value ?? '');
    setDirty(true);
  };

  // Auto-save behavior
  useEffect(() => {
    if (!autoSave) return;
    localStorage.setItem(storageKey, code);
    setDirty(false);
  }, [autoSave, code, storageKey]);

  const save = useCallback(() => {
    localStorage.setItem(storageKey, code);
    setDirty(false);
  }, [code, storageKey]);

  return { code, onCodeChange, save, dirty };
}
