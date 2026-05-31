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
code editor (consumed directly from npm). Relay computer
assembly (`rcasm`) and disassembly (`rcdsm`) language support
is registered against stock Monaco at runtime in
`src/workers.ts`.

Run `npm run build` to build the project. The build artifacts
will be stored in the `dist/` directory.
