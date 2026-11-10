# Sticky Notes

A simple desktop sticky notes application built with React and TypeScript.

The application is structured around small, focused components. `Board` acts as the main workspace and coordinates note interactions, while `StickyNote` is responsible for rendering and handling drag, resize, and text editing behavior. `TrashZone` provides the visual target used to remove notes. Note data is represented with TypeScript interfaces to keep the application state predictable and strongly typed.

Note state and operations are centralized in the `useNotes` custom hook, including creation, movement, resizing, editing, deletion, and z-index management. Reusable logic such as note utilities, geometry calculations, and local storage persistence is kept outside the components. Pointer Events and pointer capture are used for drag and resize interactions, avoiding external drag-and-drop dependencies and keeping the interaction logic lightweight.

Notes are persisted in `localStorage`, including their position, size, text, color, and stacking order. New notes receive one of four predefined colors, and interacting with a note brings it to the front. The application is designed for desktop environments with a minimum supported resolution of 1024x768.

## Requirements

- Node.js
- npm

## Running the application

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Browser Support

The application is intended for the latest versions of:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

## Interaction and persistence

Unchanged notes skip rendering through `React.memo` and stable callback props.
Updates preserve the object references of the other notes. The board still renders
when the notes array changes; memoization isolates each note's render.

Storage writes use a 300 ms debounce for movement, resizing, text, and other changes.
Closing the tab before that delay completes may discard the most recent changes.

Notes start in a staggered pattern (repeating every ten notes). Dragging and resizing
stay within the board. A ResizeObserver also fits restored notes and existing notes
to the board when its dimensions change. Dragging and resizing require the primary
pointer and the main mouse button. Clicking any part of a note brings it forward.
