import * as monaco from 'monaco-editor';

export type OnPositionChange = (e: monaco.editor.ICursorPositionChangedEvent) => void;

export type OnValidate = (markers: monaco.editor.IMarker[]) => void;

export type EditorProps = {

  initialCode: string;

  /** Emitted when the code is changed */
  onCodeChange?: (code: string) => void

  /** Emitted when the editor is mounted and ready to use */
  onMount?: (api: IEditorApi) => void;

  /** Emitted when the current cursor position is changed */
  onPositionChange?: OnPositionChange;

  /** Emitted when the current model markers are ready */
  onValidate?: OnValidate;
}

export interface IEditorApi {
  /** Load code into the editor */
  loadCode(code: string): void;
}
