import { type editor } from 'monaco-editor';

export type OnChange = (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;

export type OnPositionChange = (e: editor.ICursorPositionChangedEvent) => void;

export type OnValidate = (markers: editor.IMarker[]) => void;

export type EditorProps = {
  /**
   * Signature: function(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => void
   * An event is emitted when the content of the current model is changed
   */
  onChange?: OnChange;

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
