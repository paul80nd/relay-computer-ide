import type { PanelType } from "./hooks/usePreferences.ts";

export type CommandType =
  | 'app.save'
  | 'app.jumpToSource'
  | 'app.jumpToAssembled'
  | 'editor.gotoLine'
  | 'editor.doMonacoAction'
  | 'output.gotoAddress'
  | 'panel.show';

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
  | CommandBase<'app.save', 'app'>
  | CommandBase<'app.jumpToSource', 'app', { fromAddress: number }>
  | CommandBase<'app.jumpToAssembled', 'app', { fromSourceLineNumber: number }>
  | CommandBase<'editor.gotoLine', 'editor', { lineNumber?: number }>
  | CommandBase<'editor.doMonacoAction', 'editor', { actionId: string; }>
  | CommandBase<'output.gotoAddress', 'output', { address: number }>
  | CommandBase<'panel.show', 'panel', { panel: PanelType }>;

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
  save: (): AppCommand => ({ target: 'app', type: 'app.save' }),
  jumpToAssembled: (fromSourceLineNumber: number): AppCommand => ({ target: 'app', type: 'app.jumpToAssembled', fromSourceLineNumber }),
  jumpToSource: (fromAddress: number): AppCommand => ({ target: 'app', type: 'app.jumpToSource', fromAddress })
};

export const editorCommands = {
  doMonacoAction: (actionId: string): EditorCommand => ({ target: 'editor', type: 'editor.doMonacoAction', actionId }),
  gotoLine: (lineNumber?: number): EditorCommand => ({ target: 'editor', type: 'editor.gotoLine', lineNumber }),
};

export const outputCommands = {
  gotoAddress: (address: number): OutputCommand => makeCommand('output', 'output.gotoAddress', { address }),
};

export const panelCommands = {
  show: (panel: PanelType): PanelCommand => makeCommand('panel', 'panel.show', { panel }),
};
