# Agent Guide: SugarCube Advanced Editor

This document provides essential information for AI agents (like Gemini, GPT, etc.) to understand, maintain, and extend the SugarCube Advanced Editor codebase.

## Project Overview

**SugarCube Advanced Editor** is a userscript designed to provide a suite of debugging and editing tools for games built with the [SugarCube](https://www.muckling.com/sugarcube/) story engine.

- **Target Environment:** Web browsers via userscript managers (Tampermonkey, Greasemonkey).
- **Primary Technologies:** Vanilla JavaScript (ES6+), CSS3, HTML5.
- **Key Features:** Variable editing, passage source viewing, object exploration, and history navigation.

## Repository Structure

- `userscript.user.js`: The entry point. Contains userscript metadata and the bootstrap logic that waits for SugarCube to initialize.
- `main.js`: The core logic. Handles UI creation, event listeners, state synchronization, and interaction with the SugarCube API.
- `html.js`: A utility module that returns the template for the editor's HTML structure.
- `styles.css`: The styling for the editor, including themes for both desktop and mobile.

## Technical Architecture

### 1. SugarCube Integration
The editor interacts with the game by accessing the global `SugarCube` object.
- `getSugarCube()`: Safely retrieves the `SugarCube` (or `MegaCube`) object.
- `getActiveState()`: Accesses `SugarCube.State` to get current variables and navigation history.
- `getEngine()`: Accesses `SugarCube.Engine` for navigation commands (back/forward).

### 2. UI Lifecycle
- **Detection:** `checkForSugarCube()` in `userscript.user.js` polls for the engine's presence.
- **Initialization:** `initializeEditor()` in `main.js` injects styles, creates the DOM elements, and sets up observers.
- **Reactive Updates:** A `MutationObserver` watches the `#story` or `#passages` element to trigger `updateEditorContent()` whenever the player navigates to a new passage.

### 3. Key Functions for Extension
- `createVariableInputRow()`: The standard way to create an editable field for a variable. Handles basic type conversion (Number, Boolean, JSON).
- `populateExplorerPanel()`: Recursively explores the `SugarCube` object. Uses `explorerPath` (an array of strings) to track the current depth.

## Guidelines for AI Agents

### Coding Style
- **No Dependencies:** Do not add external libraries. The script must remain self-contained.
- **Mobile First:** Ensure any UI changes are touch-friendly and fit within narrow viewports.
- **Safe Access:** Always use try-catch or null checks when accessing `SugarCube` properties, as different versions or custom builds might have varying structures.

### Extending the UI
1.  **Add a Tab:** Update `createMenuHTML` in `html.js` to include a new button and panel.
2.  **Add Logic:** Create a `populate[TabName]Panel()` function in `main.js`.
3.  **Hook into Refresh:** Call your new populate function inside `updateEditorContent()`.
4.  **Event Listeners:** Add any specific listeners in the `initializeEditor()` scope.

## Known Constraints
- The editor relies on `GM_getResourceText` for CSS injection.
- It assumes the game uses the default SugarCube ID structure (`#story`, `#passages`).
