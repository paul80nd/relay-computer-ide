import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type OnChange = (value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => void;

export type OnMount = (editor: monaco.editor.IStandaloneCodeEditor) => void;

export type OnPositionChange = (e: monaco.editor.ICursorPositionChangedEvent) => void;

export type OnValidate = (markers: monaco.editor.IMarker[]) => void;

export type EditorProps = {
  /**
   * Signature: function(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => void
   * An event is emitted when the content of the current model is changed
   */
  onChange?: OnChange;

  /**
   * Signature: function(editor: monaco.editor.IStandaloneCodeEditor) => void
   * An event is emitted when the editor is mounted
 */
  onMount?: OnMount;

  /**
   * Signature:
   * An event is emitted when the current cursor position is changed
   */
  onPositionChange?: OnPositionChange;

  /**
   * Signature: function(markers: monaco.editor.IMarker[]) => void
   * An event is emitted when the content of the current model is changed
   * and the current model markers are ready
   * Defaults to "noop"
   */
  onValidate?: OnValidate;
}
