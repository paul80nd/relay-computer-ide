import { Component, ElementRef, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy, forwardRef, SimpleChanges, inject, input, output, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

import { MonacoEditorLoaderService } from '../../services/monaco-editor-loader.service';
import { MonacoEditorConstructionOptions, MonacoEditorUri, MonacoStandaloneCodeEditor } from '../../interfaces';

@Component({
    selector: 'ngx-monaco-editor',
    template: `<div #container class="editor-container" fxFlex>
		<div
			#editor
			class="monaco-editor"
		></div>
</div>`,
    styles: [
        `
.monaco-editor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

}
.editor-container {
	overflow: hidden;
	position: relative;
	display: table;
	width: 100%;
  height: 100%;
  min-width: 0;
}`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MonacoEditorComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MonacoEditorComponent),
            multi: true,
        }
    ]
})
export class MonacoEditorComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {
    private monacoLoader = inject(MonacoEditorLoaderService);

    readonly options = input.required<MonacoEditorConstructionOptions>();
    readonly uri = input<MonacoEditorUri>();
    readonly init = output<MonacoStandaloneCodeEditor>();
    readonly editorContent = viewChild.required<ElementRef>('editor');

    editor!: MonacoStandaloneCodeEditor;
    modelUriInstance!: monaco.editor.ITextModel;
    value!: string;
    parsedError!: string;

    private onTouched: () => void = () => {};
    private onErrorStatusChange: () => void = () => {};
    private propagateChange: (_: any) => any = () => {};

    get model() {
      return this.editor && this.editor.getModel();
    }

    get modelMarkers() {
      return this.model && monaco.editor.getModelMarkers({
        resource: this.model.uri
      });
    }

    ngOnInit() {
        this.monacoLoader.isMonacoLoaded$.pipe(
            filter(isLoaded => isLoaded),
            take(1)
        ).subscribe(() => {
            this.initEditor();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.editor && changes['options'] && !changes['options'].firstChange) {
          const { language: toLanguage, theme: toTheme, ...options } = changes['options'].currentValue;
          const { language: fromLanguage, theme: fromTheme } = changes['options'].previousValue;

          if (fromLanguage !== toLanguage) {
              const optionsValue = this.options();
              monaco.editor.setModelLanguage(
                  this.editor.getModel()!,
                  optionsValue && optionsValue.language ? optionsValue.language : 'text'
              );
          }

          if (fromTheme !== toTheme) {
              monaco.editor.setTheme(toTheme);
          }

          this.editor.updateOptions(options);
        }

        if (this.editor && changes['uri']) {
          const toUri = changes['uri'].currentValue;
          const fromUri = changes['uri'].previousValue;

          if (fromUri && !toUri || !fromUri && toUri || toUri && fromUri && toUri.path !== fromUri.path) {
            const value = this.editor.getValue();

            if (this.modelUriInstance) {
              this.modelUriInstance.dispose();
            }

            let existingModel;

            if (toUri) {
              existingModel = monaco.editor.getModels().find((model) => model.uri.path === toUri.path);
            }

            this.modelUriInstance = existingModel ? existingModel : monaco.editor.createModel(value, this.options().language || 'text', this.uri());
            this.editor.setModel(this.modelUriInstance);
          }
        }
    }

    writeValue(value: string): void {
        this.value = value;
        if (this.editor && value) {
            this.editor.setValue(value);
        } else if (this.editor) {
            this.editor.setValue('');
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(): ValidationErrors | null {
        return !this.parsedError ? null : {
            monaco: {
                value: this.parsedError.split('|'),
            }
        };
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onErrorStatusChange = fn;
    }

    private initEditor() {
        const options: MonacoEditorConstructionOptions = {
            value: [this.value].join('\n'),
            language: 'text',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            theme: 'vc'
        };

        const optionsValue = this.options();
        this.editor = monaco.editor.create(
          this.editorContent().nativeElement,
          optionsValue ? { ...options, ...optionsValue } : options
        );

        this.registerEditorListeners();
        this.init.emit(this.editor);
    }

    registerEditorListeners() {
      this.editor.onDidChangeModelContent(() => {
        this.propagateChange(this.editor.getValue());
      });

      this.editor.onDidChangeModelDecorations(() => {
          const currentParsedError = this.modelMarkers?.map(({ message }) => message).join('|');
          const hasValidationStatusChanged = this.parsedError !== currentParsedError;

          if (hasValidationStatusChanged && currentParsedError) {
              this.parsedError = currentParsedError;
              this.onErrorStatusChange();
          }
      });

      this.editor.onDidBlurEditorText(() => {
          this.onTouched();
      });
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}
