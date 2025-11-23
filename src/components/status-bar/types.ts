import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type { AssemblerResult } from "../../assembler";

export type StatusBarProps = {

  validation: StatusBarValidation;

  position?: monaco.IPosition;

  assembly?: AssemblerResult;

  /** True when auto-save is enabled */
  autoSave: boolean;

  /** True when there are unsaved changes (only meaningful if autoSave is false) */
  dirty: boolean;
}

export type StatusBarValidation = {
  warnings: number;
  errors: number;
}
