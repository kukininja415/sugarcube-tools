// --- Configuration ---
const MENU_TITLE = "SC Editor";

// --- State Management ---
let explorerPath = []; // Holds the navigation path for the object explorer

function getSugarCube() {
    try {
        return SugarCube;
    } catch (e) {
        try {
            return MegaCube;
        } catch (e) {
            return null;
        }
    }
}

function getActiveState() {
    const sugarcube = getSugarCube();
    if (sugarcube && sugarcube.state) return sugarcube.state;
    if (sugarcube && sugarcube.State) return sugarcube.State;
    return null;
}

function getEngine() {
    const sugarcube = getSugarCube()
    return sugarcube ? sugarcube.Engine : null;
}

function isSugarCubeReady() {
    try {
        let sc = getSugarCube();
        console.log(sc);
        return sc && typeof getActiveState().variables !== 'undefined'
    } catch(e) {
        return false;
    }
}

function initializeEditor(styles) {
    console.log("SugarCube Advanced Editor: SugarCube detected. Initializing editor.");

    // --- Styles ---
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- Create HTML Elements ---
    const menuHTML = createMenuHTML(MENU_TITLE);
    const menu = document.createElement('div');
    menu.id = 'sc-variable-editor';
    menu.innerHTML = menuHTML;
    document.body.appendChild(menu);

    const floatingToggleButton = document.createElement('button');
    floatingToggleButton.id = 'sc-editor-floating-toggle';
    floatingToggleButton.textContent = '⚙️';
    floatingToggleButton.title = 'Toggle Editor';
    document.body.appendChild(floatingToggleButton);

    const editorBody = menu.querySelector('#sc-editor-body');
    const variablesPanel = menu.querySelector('#sc-variables-panel');
    const passagePanel = menu.querySelector('#sc-passage-panel');
    const nextVarsPanel = menu.querySelector('#sc-next-vars-panel');
    const utilsPanel = menu.querySelector('#sc-utils-panel');
    const explorerPanel = menu.querySelector('#sc-explorer-panel');
    const passageCodeEl = passagePanel.querySelector('code');

    // --- Functionality ---

    function createVariableInputRow(key, value, panel, objRef, propName) {
        const row = document.createElement('div');
        row.className = 'sc-variable-row';
        const label = document.createElement('label');
        label.className = 'sc-variable-label';
        label.textContent = key;
        label.title = key;
        const input = document.createElement('input');
        input.className = 'sc-variable-input';
        input.value = Array.isArray(value) ? JSON.stringify(value) : value;
        input.type = 'text';
        input.addEventListener('change', (e) => {
            const targetObject = objRef || getActiveState().variables;
            const targetProp = propName || key;
            const originalValue = targetObject[targetProp];
            let newValue = e.target.value;

            if (typeof originalValue === 'number' && !isNaN(Number(newValue))) {
                targetObject[targetProp] = Number(newValue);
            } else if (typeof originalValue === 'boolean') {
                targetObject[targetProp] = (newValue.toLowerCase() === 'true');
            } else if (Array.isArray(originalValue)) {
                try {
                    targetObject[targetProp] = JSON.parse(newValue);
                } catch (err) { e.target.value = JSON.stringify(originalValue); }
            } else {
                targetObject[targetProp] = newValue;
            }
        });
        row.appendChild(label);
        row.appendChild(input);
        panel.appendChild(row);
    }

    function populateVariablesPanel() {
        variablesPanel.innerHTML = '';
        const state = getActiveState();
        if (!state) return;
        const variables = state.variables;
        const varNames = Object.keys(variables).sort();
        if (varNames.length === 0) {
            variablesPanel.textContent = "No variables found.";
            return;
        }
        varNames.forEach(key => {
            const currentValue = variables[key];
            if (typeof currentValue === 'function' || (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue))) return;
            createVariableInputRow(key, currentValue, variablesPanel);
        });
    }

    function populatePassagePanel() {
        const state = getActiveState();
        if (!state || !getSugarCube().Story) return;
        const passageName = state.passage || state.title;
        const passageData = getSugarCube().Story.get(passageName);
        passageCodeEl.textContent = passageData ? passageData.text : `Could not retrieve source for passage: "${passageName}"`;
    }

    function populateNextPassageVarsPanel() {
        nextVarsPanel.innerHTML = '';
        const state = getActiveState();
        if (!state || !getSugarCube().Story) return;
        const storyElement = document.querySelector('#story [data-passage]') || document.getElementById('story');
        if (!storyElement) {
            nextVarsPanel.textContent = "Could not find story container.";
            return;
        }
        const links = storyElement.querySelectorAll('a[data-passage]');
        if (links.length === 0) {
            nextVarsPanel.textContent = "No links to next passages found in the current view.";
            return;
        }
        const nextPassageNames = [...new Set(Array.from(links).map(link => link.dataset.passage))];
        const allVariablesInNextPassages = new Set();
        const variableRegex = /\$([A-Za-z_][A-Za-z0-9_]*)/g;
        nextPassageNames.forEach(passageName => {
            const passageData = getSugarCube().Story.get(passageName);
            if (passageData && passageData.text) {
                let match;
                while ((match = variableRegex.exec(passageData.text)) !== null) {
                    allVariablesInNextPassages.add(match[1]);
                }
            }
        });
        const varNames = [...allVariablesInNextPassages].sort();
        if (varNames.length === 0) {
            nextVarsPanel.textContent = "No variables found in linked passages.";
            return;
        }
        let variablesAdded = 0;
        const allCurrentVariables = state.variables;
        varNames.forEach(key => {
            if (Object.prototype.hasOwnProperty.call(allCurrentVariables, key)) {
                const currentValue = allCurrentVariables[key];
                if (typeof currentValue === 'function' || (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue))) return;
                createVariableInputRow(key, currentValue, nextVarsPanel);
                variablesAdded++;
            }
        });
        if (variablesAdded === 0) {
            nextVarsPanel.textContent = "Variables from next passages are not yet defined in the current state.";
        }
    }

    function populateExplorerPanel() {
        explorerPanel.innerHTML = '';
        let currentObj = getSugarCube();
        try {
            for (const key of explorerPath) { currentObj = currentObj[key]; }
        } catch (e) {
            explorerPath.pop();
            populateExplorerPanel();
            return;
        }

        const pathContainer = document.createElement('div');
        pathContainer.id = 'sc-explorer-path';
        const rootCrumb = document.createElement('span');
        rootCrumb.className = 'sc-explorer-crumb';
        rootCrumb.textContent = 'SugarCube';
        rootCrumb.onclick = () => { explorerPath = []; populateExplorerPanel(); };
        pathContainer.appendChild(rootCrumb);

        explorerPath.forEach((key, i) => {
            pathContainer.append(' . ');
            const crumb = document.createElement('span');
            crumb.className = 'sc-explorer-crumb';
            crumb.textContent = key;
            crumb.onclick = () => { explorerPath = explorerPath.slice(0, i + 1); populateExplorerPanel(); };
            pathContainer.appendChild(crumb);
        });
        explorerPanel.appendChild(pathContainer);

        const propsContainer = document.createElement('div');
        if (currentObj === null || typeof currentObj !== 'object') {
            propsContainer.textContent = 'Cannot explore a primitive value.';
            explorerPanel.appendChild(propsContainer);
            return;
        }

        const keys = Object.keys(currentObj).sort();
        if (keys.length === 0) propsContainer.textContent = 'Object is empty.';

        keys.forEach(key => {
            const value = undefined;
            try {
                value = currentObj[key];
            } catch (e) {
                alert(e.message)
            }
            const type = typeof value;
            const row = document.createElement('div');
            row.className = 'sc-variable-row';
            const label = document.createElement('label');
            label.className = 'sc-variable-label';
            label.textContent = key;
            label.title = key;
            row.appendChild(label);

            if (type === 'object' && value !== null) {
                const preview = document.createElement('span');
                preview.className = 'sc-explorer-value-preview sc-variable-input';
                preview.textContent = Array.isArray(value) ? `Array(${value.length})` : 'Object';
                const exploreBtn = document.createElement('button');
                exploreBtn.className = 'sc-explorer-button';
                exploreBtn.textContent = '>';
                exploreBtn.title = 'Explore';
                exploreBtn.onclick = () => { explorerPath.push(key); populateExplorerPanel(); };
                row.appendChild(preview);
                row.appendChild(exploreBtn);
            } else if (type !== 'function') {
                createVariableInputRow(key, value, propsContainer, currentObj, key);
                return; // createVariableInputRow appends its own row
            } else {
                const preview = document.createElement('span');
                preview.className = 'sc-explorer-value-preview sc-variable-input';
                preview.textContent = 'Function';
                row.appendChild(preview);
            }
            propsContainer.appendChild(row);
        });
        explorerPanel.appendChild(propsContainer);
    }

    function populateUtilsPanel() {
        utilsPanel.innerHTML = '';
        const engine = getEngine();
        if (!engine) return;

        const historyControls = document.createElement('div');
        historyControls.className = 'sc-history-controls';
        const backButton = document.createElement('button');
        backButton.textContent = '← Back';
        backButton.className = 'sc-history-button';
        backButton.addEventListener('click', () => engine.backward());
        const forwardButton = document.createElement('button');
        forwardButton.textContent = 'Forward →';
        forwardButton.className = 'sc-history-button';
        forwardButton.addEventListener('click', () => engine.forward());
        historyControls.appendChild(backButton);
        historyControls.appendChild(forwardButton);
        utilsPanel.appendChild(historyControls);

        const utilsContainer = document.createElement('div');
        utilsContainer.className = 'sc-utils-container';

        const fullscreenButton = document.createElement('button');
        fullscreenButton.className = 'sc-utils-button';
        function updateFullscreenButtonState() {
            fullscreenButton.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Enter Fullscreen';
        }
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.error(`[SC Editor] Fullscreen Error: ${err.message}`));
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        });
        document.removeEventListener('fullscreenchange', updateFullscreenButtonState);
        document.addEventListener('fullscreenchange', updateFullscreenButtonState);
        updateFullscreenButtonState();
        utilsContainer.appendChild(fullscreenButton);

        const linkButton = document.createElement('a');
        linkButton.href = window.location.href;
        linkButton.textContent = 'Open Game Frame in New Tab';
        linkButton.target = '_blank';
        linkButton.rel = 'noopener noreferrer';
        linkButton.className = 'sc-utils-button';
        utilsContainer.appendChild(linkButton);
        utilsPanel.appendChild(utilsContainer);
    }

    function updateEditorContent() {
        populateVariablesPanel();
        populatePassagePanel();
        populateNextPassageVarsPanel();
        populateUtilsPanel();
        if (menu.querySelector('#sc-explorer-panel.active')) {
            populateExplorerPanel();
        }
    }

    // --- Event Listeners ---
    floatingToggleButton.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
    });

    menu.querySelector('#sc-editor-refresh').addEventListener('click', updateEditorContent);

    const collapseButton = menu.querySelector('#sc-editor-collapse');
    collapseButton.addEventListener('click', () => {
        const isCollapsed = editorBody.style.display === 'none';
        editorBody.style.display = isCollapsed ? 'block' : 'none';
        collapseButton.textContent = isCollapsed ? '−' : '□';
    });

    const dockButton = menu.querySelector('#sc-editor-dock');
    dockButton.addEventListener('click', () => {
        const isDocked = menu.classList.toggle('sc-editor-docked');
        dockButton.textContent = isDocked ? '⤒' : '⤓';
        dockButton.title = isDocked ? 'Undock' : 'Dock';
        if (isDocked) {
            menu.style.top = ''; menu.style.left = '';
        } else if (!menu.style.top && !menu.style.left) {
            menu.style.top = '20px'; menu.style.left = '20px';
        }
    });

    menu.querySelector('#sc-editor-tabs').addEventListener('click', (e) => {
        if (e.target.matches('.sc-tab-button')) {
            const tabName = e.target.dataset.tab;
            menu.querySelectorAll('.sc-tab-button, .sc-tab-panel').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            const activePanel = menu.querySelector(`#sc-${tabName}-panel`);
            activePanel.classList.add('active');
            if (tabName === 'explorer' && !activePanel.hasChildNodes()) {
                populateExplorerPanel();
            }
        }
    });

    const header = menu.querySelector('#sc-editor-header');
    let isDragging = false, startX, startY, startLeft, startTop;
    const dragStart = (e) => {
        if (menu.classList.contains('sc-editor-docked')) return;
        isDragging = true;
        const event = e.type.includes('touch') ? e.touches[0] : e;
        startX = event.clientX; startY = event.clientY;
        startLeft = menu.offsetLeft; startTop = menu.offsetTop;
        document.body.style.userSelect = 'none';
    };
    const dragMove = (e) => {
        if (!isDragging) return;
        const event = e.type.includes('touch') ? e.touches[0] : e;
        menu.style.left = `${startLeft + (event.clientX - startX)}px`;
        menu.style.top = `${startTop + (event.clientY - startY)}px`;
    };
    const dragEnd = () => { isDragging = false; document.body.style.userSelect = ''; };
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    header.addEventListener('touchstart', dragStart, { passive: true });
    document.addEventListener('touchmove', dragMove, { passive: true });
    document.addEventListener('touchend', dragEnd);

    const observer = new MutationObserver(() => {
        if (document.querySelector('[data-passage]')) { updateEditorContent(); }
    });
    const storyElement = document.getElementById('story') || document.getElementById('passages');
    if (storyElement) {
        observer.observe(storyElement, { childList: true, subtree: true });
    }

    updateEditorContent();
}
