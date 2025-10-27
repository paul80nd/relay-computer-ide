import { Directive, TemplateRef, ViewContainerRef, OnDestroy, OnInit, inject } from '@angular/core';
import { MonacoEditorLoaderService } from '../services/monaco-editor-loader.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({ selector: '[ngxLoadMonacoEditor]' })
export class MonacoEditorLoaderDirective implements OnInit, OnDestroy {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private monacoEditorLoaderService = inject(MonacoEditorLoaderService);

  isMonacoLoaded$ = this.monacoEditorLoaderService.isMonacoLoaded$.asObservable();
  destroyed$ = new Subject<void>();

  ngOnInit() {
    this.isMonacoLoaded$.pipe(takeUntil(this.destroyed$)).subscribe((loaded: boolean) => {
      if (!loaded) {
        return this.viewContainer.clear();
      }
      this.viewContainer.createEmbeddedView(this.templateRef);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
