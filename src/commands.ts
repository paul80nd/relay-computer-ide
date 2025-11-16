export const Commands = {
  APP_SAVE: 'app.save',
  EDITOR_GOTO_LINE: 'editor.action.gotoLine',
  PANEL_OUTPUT_SHOW: 'panel.output.show'
} as const;

export type AppCommand = typeof Commands[keyof typeof Commands];

export type EditorCommand = Extract<AppCommand, `editor.${string}`>;
export type PanelCommand = Extract<AppCommand, `panel.${string}`>;

export const CommandTarget = {
  EDITOR: 'editor',
  PANEL: 'panel',
  APP: 'app'
} as const;

export const isEditorCommand =
  (command: AppCommand): command is EditorCommand =>
    command.startsWith(CommandTarget.EDITOR);

export const isPanelCommand =
  (command: AppCommand): command is PanelCommand =>
    command.startsWith(CommandTarget.PANEL);

