export type AppCommand = typeof Commands[keyof typeof Commands];

export type EditorCommand = Extract<AppCommand, `editor.${string}`>;
export type PanelCommand = Extract<AppCommand, `panel.${string}`>;

export const CommandTarget = {
  EDITOR: 'editor',
  PANEL: 'panel',
} as const;

export function isEditorCommand(command: AppCommand): command is EditorCommand {
  return command.startsWith(CommandTarget.EDITOR);
}

export function isPanelCommand(command: AppCommand): command is PanelCommand {
  return command.startsWith(CommandTarget.PANEL);
}

export const Commands = {
  EDITOR_GOTO_LINE: 'editor.action.gotoLine',
  PANEL_OUTPUT_SHOW: 'panel.output.show'
}
