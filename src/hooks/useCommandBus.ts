import type { Command, CommandTarget } from "../commands.ts";
import { createContext, useContext, useMemo, useRef } from "react";

export interface CommandBus {
  execute(command: Command): void;
  subscribe(target: CommandTarget, handler: (cmd: Command) => void): () => void;
}

const CommandBusContext = createContext<CommandBus | undefined>(undefined);

export function useCommandBus(): CommandBus {
  const ctx = useContext(CommandBusContext);
  if (!ctx) {
    throw new Error('useCommandBus must be used within a CommandBusProvider');
  }
  return ctx;
}

export function useCreateCommandBus(): CommandBus {
  // Handlers live in a ref to avoid re-renders on subscribe/unsubscribe.
  const handlersRef = useRef<Map<string, Set<(cmd: Command) => void>>>(new Map());

  const bus = useMemo<CommandBus>(() => ({
    execute(command) {
      // deliver to specific target
      const set = handlersRef.current.get(command.target);
      if (set) {
        for (const h of Array.from(set)) {
          try { h(command); } catch (e) { console.error(e); }
        }
      }
    },
    subscribe(target, handler) {
      let set = handlersRef.current.get(target);
      if (!set) {
        set = new Set();
        handlersRef.current.set(target, set);
      }
      set.add(handler);
      return () => {
        set!.delete(handler);
        if (set!.size === 0) handlersRef.current.delete(target);
      };
    },
  }), []);

  return bus;
}

export const CommandBusProvider = CommandBusContext.Provider;
