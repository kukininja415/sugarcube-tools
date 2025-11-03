# SugarCube Advanced Editor

A powerful userscript that adds a tabbed menu to your SugarCube games, allowing you to edit variables, view passage source, inspect variables in upcoming passages, and more. It's designed to be robust, mobile-friendly, and a valuable tool for both players and developers.

## Features

- **Variable Editor:** View and modify current story variables on the fly.
- **Passage Source Viewer:** See the raw source code of the current passage.
- **Next Passage Variable Inspector:** Get a glimpse of the variables used in the passages you can navigate to next.
- **Object Explorer:** A powerful tool to explore the entire `SugarCube` object, including its state, story data, and engine methods.
- **Utility Tab:**
    - Navigate back and forth in your story history.
    - Toggle fullscreen mode.
    - Open the game frame in a new tab for easier debugging.
- **User-Friendly Interface:**
    - Draggable and collapsible menu.
    - Docking mode for seamless integration with the game interface.
    - Clean, modern design that works well on both desktop and mobile.

## Installation

To use this script, you first need a userscript manager. The most popular ones are:

- [Tampermonkey](https://www.tampermonkey.net/) (for Chrome, Firefox, Edge, Safari)
- [Greasemonkey](https://www.greasespot.net/) (for Firefox)

Once you have a userscript manager installed, you can install the SugarCube Advanced Editor from one of the links below.

**Recommended:** Install from [Greasy Fork](https://greasyfork.org/en/scripts/XXXXX-sugarcube-advanced-editor) for automatic updates. *(Note: A Greasy Fork page will need to be created for this link to work.)*

Alternatively, you can install the script directly from this repository. **Note:** You will not receive automatic updates if you install it this way.

[**Install Directly**](https://raw.githubusercontent.com/your-username/your-repo/main/userscript.js)

*(Please replace the URL above with the raw link to the `userscript.js` file in your repository).*

## How to Use

1.  Once installed, a gear icon (⚙️) will appear in the bottom-right corner of the screen when a SugarCube game is active.
2.  Click the gear icon to open the editor menu.
3.  Navigate through the tabs to access different functionalities.
4.  The menu can be dragged around the screen, collapsed, or docked to the bottom of the page for your convenience.

## Development

The script is split into multiple files for easier development:

-   `userscript.js`: The main userscript file with the metadata block. It loads the other modules.
-   `src/styles.css`: Contains all the CSS for the editor.
-   `src/html.js`: Contains the function to generate the editor's HTML structure.
-   `src/main.js`: The core JavaScript logic for the editor's functionality.
