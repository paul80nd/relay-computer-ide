# relay-computer-ide

This is a code editor and assembler for my relay computer using Angular + Monaco.

More information on my relay computer can be found at my [blog](https://relaycomputer.co.uk)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

This IDE is built around the Microsoft Monaco in-browser code editor. As such I have a fork at <https://github.com/paul80nd/monaco-editor> with a branch that
adds my relay computer assembly language support. The build Monaco editor is then excpected to be found locally as per the package.json reference.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

If the built project will not be hosted at the root url then it can be built as follows, for example, `ng build  --base-href https://editor.relaycomputer.co.uk`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
