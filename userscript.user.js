// ==UserScript==
// @name         SugarCube Advanced Editor
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Adds a tabbed menu to edit variables, view passage source, and inspect variables in upcoming passages in SugarCube. Robust and mobile-friendly.
// @author       Gemini
// @match        https://mopoga.com/*
// @match        https://*.fgn.cdn.serverable.com/*
// @grant        GM_getResourceText
// @resource     STYLE_CSS styles.css
// @require      html.js
// @require      main.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const MAX_ATTEMPTS = 15;
    const CHECK_INTERVAL = 500;

    // --- Startup ---
    let attempts = 0;
    function checkForSugarCube() {
        if (isSugarCubeReady()) {
            const styles = GM_getResourceText("STYLE_CSS");
            initializeEditor(styles);
        } else {
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(checkForSugarCube, CHECK_INTERVAL);
            } else {
                console.log(`SugarCube Advanced Editor: SugarCube not detected after ${MAX_ATTEMPTS} attempts. Aborting.`);
            }
        }
    }

    checkForSugarCube();
})();
