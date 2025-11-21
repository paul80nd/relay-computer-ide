import type { PanelType, SectionType } from "./hooks/usePreferences.ts";

export type CommandType =
  | 'app.new'
  | 'app.save'
  | 'app.saveAs'
  | 'app.open'
  | 'app.loadExample'
  | 'app.jumpToSource'
  | 'app.jumpToAssembled'
  | 'editor.gotoLine'
  | 'editor.doMonacoKeyboardAction'
  | 'editor.doMonacoAction'
  | 'output.gotoAddress'
  | 'panel.toggle'
  | 'panel.showSection';

export type CommandTarget = 'app' | 'editor' | 'output' | 'panel';

// Base command shape intersected with payload
type CommandBase<
  TType extends CommandType,
  TTarget extends CommandTarget,
  TPayload extends object = Record<never, never>
> = Readonly<{
  type: TType;
  target: TTarget;
} & TPayload>;

/** Global command union */
export type Command =
  | CommandBase<'app.new', 'app'>
  | CommandBase<'app.save', 'app'>
  | CommandBase<'app.saveAs', 'app'>
  | CommandBase<'app.open', 'app'>
  | CommandBase<'app.loadExample', 'app', { example: string }>
  | CommandBase<'app.jumpToSource', 'app', { fromAddress: number }>
  | CommandBase<'app.jumpToAssembled', 'app', { fromSourceLineNumber: number }>
  | CommandBase<'editor.gotoLine', 'editor', { lineNumber?: number, column?: number }>
  | CommandBase<'editor.doMonacoKeyboardAction', 'editor', { id: string; }>
  | CommandBase<'editor.doMonacoAction', 'editor', { actionId: string; }>
  | CommandBase<'output.gotoAddress', 'output', { address: number }>
  | CommandBase<'panel.toggle', 'panel', { panel: PanelType }>
  | CommandBase<'panel.showSection', 'panel', { section: SectionType }>;

// Per-target subsets
export type AppCommand = Extract<Command, { target: 'app' }>;
export type EditorCommand = Extract<Command, { target: 'editor' }>;
export type OutputCommand = Extract<Command, { target: 'output' }>;
export type PanelCommand = Extract<Command, { target: 'panel' }>;

// Generic helper for factories
function makeCommand<
  TType extends CommandType,
  TTarget extends CommandTarget,
  TPayload extends object = Record<never, never>
>(target: TTarget, type: TType, payload?: TPayload): CommandBase<TType, TTarget, TPayload> {
  return payload
    ? { target, type, ...payload }
    : ({ target, type } as CommandBase<TType, TTarget, TPayload>);
}

// Nice factories for call-sites
export const appCommands = {
  new: (): AppCommand => ({ target: 'app', type: 'app.new' }),
  save: (): AppCommand => ({ target: 'app', type: 'app.save' }),
  saveAs: (): AppCommand => ({ target: 'app', type: 'app.saveAs' }),
  open: (): AppCommand => ({ target: 'app', type: 'app.open' }),
  loadExample: (example: string): AppCommand => ({ target: 'app', type: 'app.loadExample', example }),
  jumpToAssembled: (fromSourceLineNumber: number): AppCommand => ({ target: 'app', type: 'app.jumpToAssembled', fromSourceLineNumber }),
  jumpToSource: (fromAddress: number): AppCommand => ({ target: 'app', type: 'app.jumpToSource', fromAddress }),
};

export const editorCommands = {
  doMonacoKeyboardAction: (id: string): EditorCommand => ({ target: 'editor', type: 'editor.doMonacoKeyboardAction', id }),
  doMonacoAction: (actionId: string): EditorCommand => ({ target: 'editor', type: 'editor.doMonacoAction', actionId }),
  gotoLine: (lineNumber?: number, column: number | undefined = undefined): EditorCommand => ({ target: 'editor', type: 'editor.gotoLine', lineNumber, column }),
};

export const outputCommands = {
  gotoAddress: (address: number): OutputCommand => makeCommand('output', 'output.gotoAddress', { address }),
};

export const panelCommands = {
  togglePanel: (panel: PanelType): PanelCommand => makeCommand('panel', 'panel.toggle', { panel }),
  showSection: (section: SectionType): PanelCommand => ({ target: 'panel', type: 'panel.showSection', section }),
};
