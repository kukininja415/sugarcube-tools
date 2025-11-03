const createMenuHTML = (MENU_TITLE) => `
<div id="sc-editor-header">
    <span>${MENU_TITLE}</span>
    <div id="sc-editor-controls">
        <button id="sc-editor-refresh" title="Refresh">↻</button>
        <button id="sc-editor-dock" title="Dock">⤓</button>
        <button id="sc-editor-collapse" title="Collapse">−</button>
    </div>
</div>
<div id="sc-editor-tabs">
    <button class="sc-tab-button active" data-tab="variables">Variables</button>
    <button class="sc-tab-button" data-tab="passage">Passage</button>
    <button class="sc-tab-button" data-tab="next-vars">Next Vars</button>
    <button class="sc-tab-button" data-tab="explorer">Explorer</button>
    <button class="sc-tab-button" data-tab="utils">Utils</button>
</div>
<div id="sc-editor-body">
    <div id="sc-variables-panel" class="sc-tab-panel active"></div>
    <div id="sc-passage-panel" class="sc-tab-panel">
        <pre><code></code></pre>
    </div>
    <div id="sc-next-vars-panel" class="sc-tab-panel"></div>
    <div id="sc-explorer-panel" class="sc-tab-panel"></div>
    <div id="sc-utils-panel" class="sc-tab-panel"></div>
</div>
`;
