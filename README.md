# relay-computer-ide

This is a code editor and assembler for my relay computer
using React + Monaco.

More information on my relay computer can be found at my [blog](https://relaycomputer.co.uk)

## Development server

Run `npm run dev` for a dev server. Navigate to `http://
localhost:5173/`. The application will automatically reload
if you change any of the source files.

## Build

This IDE is built around the Microsoft Monaco in-browser
code editor. As such I have a fork at <https://github.com/
paul80nd/monaco-editor> with a branch that
adds my relay computer assembly language support. The build
Monaco editor is then expected to be found locally as per
the package.json reference.

Run `npm run build` to build the project. The build artifacts
will be stored in the `dist/` directory.

If the build project will not be hosted at the root url
then it can be built as follows, for example, `ng build
--base-href https://editor.relaycomputer.co.uk`
