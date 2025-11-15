import * as rcasm from '@paul80nd/rcasm';

export function assemble(code: string): AssemblerResult {
  const { prg, errors /*, warnings, labels*/, debugInfo } = rcasm.assemble(code);

  // this.lastCompile = prg;
  // this.lastPcToLocs = debugInfo?.pcToLocs
  // this.editor().setDiagnostics(errors, warnings);
  // this.output().clearLabels();
  const didAssemble = errors.length === 0;
  // const outcome = <IAssemblyOutcome>{
  //   bytes: prg.length,
  //   errors: errors.map(e => <IAssemblyError>{ message: e.msg, line: e.loc.start.line, column: e.loc.start.column }),
  //   warnings: warnings.map(w => <IAssemblyWarning>{ message: w.msg, line: w.loc.start.line, column: w.loc.start.column })
  // }
  let dasm = '';
  if (didAssemble) {
    dasm = rcasm.disassemble(prg, {
      isInstruction: debugInfo?.info().isInstruction,
      isData: debugInfo?.info().isData,
      dataLength: debugInfo?.info().dataLength
    }).join('\n');
    //   let labelDict = Object.fromEntries(labels.map(l => [l.addr.toString(16).padStart(4, '0').toUpperCase(), { name: l.name }]));
    //   this.output().setLabels(labelDict);
    //   this.emulator().load(this.lastCompile);
  } else {
    dasm = `❌ Assembly failed (${errors.length} error${errors.length === 1 ? '' : 's'})`;
  }
  // this.output().didAssemble(outcome);
  return {
    bytes: prg,
    dasm: dasm
  }
}

export type AssemblerResult = {
  bytes?: Uint8Array;
  dasm: string;
}
