import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'ride-editor',
    templateUrl: './editor.component.html'
})
export class EditorComponent {

    editor: monaco.editor.ICodeEditor;

    editorOptions = { language: 'rcasm', lineNumbers: 'off', fontSize: 14, renderLineHighlight: 'none', minimap: { enabled: false } };

    onInit(editor: monaco.editor.ICodeEditor) {
        this.editor = editor;

        const code = localStorage.getItem("code") || this.getDefaultCode();
        editor.getModel().setValue(code);


        editor.onDidChangeModelContent(() => {
            const code = editor.getModel().getValue()
            localStorage.setItem("code", code)
        });
    }

    getDefaultCode(): string {
        return [
            '',
            ';*****************************************************',
            '; Demo program to calculate Fibonacci series',
            '; Result is placed in A register on each loop',
            '; until calculation overflows. Result is:',
            '; 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233',
            ';*****************************************************',
            '',
            'start:  ldi a,1     ; inital setup A = 1',
            '        ldi b,0     ;              B = 0',
            '',
            'loop:   mov c,b     ; slide B -> C',
            '        mov b,a     ;       A -> B',
            '        add         ; and add together',
            '',
            'done:   bcs done    ; infinite loop if overflowed',
            '',
            '        jmp loop    ; otherwise have another go'].join('\n');
    }

    getCode(): string {
        return this.editor.getModel().getValue();
    }

    loadExample() {
        this.editor.getModel().setValue(this.getDefaultCode());
    }

    setErrors(errors: ILineError[]) {

        var markers = errors.map(le => ({
            startLineNumber: le.line,
            startColumn: 1,
            endLineNumber: le.line,
            endColumn: 1000,
            message: le.error,
            severity: monaco.MarkerSeverity.Error
        }));

        monaco.editor.setModelMarkers(this.editor.getModel(), 'test', markers)
    }

    clearErrors() {
        monaco.editor.setModelMarkers(this.editor.getModel(), 'test', [])
    }

}

export interface ILineError {
    line: number;
    error: string;
}
