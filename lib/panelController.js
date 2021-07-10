/*
    PanelController.js
    Working with the Plugin Panel
*/

const application = require("application");
const commands = require("commands");
const language = application.appLanguage;

const uiStrings = {
    en: {
        panelUI: {
            searchheading: "Search...",
            layerheading: "Layer Information",
            
        }
    },
    ja: {
        panelUI: {
            searchheading: "検索文字",
            layerheading: "レイヤー情報",
            
        }
    }
}

const uiString_language = uiStrings[language];
let panel;

function createPanel() {
    const HTML =
`
<link rel="stylesheet" href="./css/common.css">
<div id="container">
    <div id="searchArea">
        <input type="search" uxp-quiet="true" placeholder="${uiString_language.panelUI.searchheading}">
    </div>
    <p>${uiString_language.panelUI.layerheading}</p>
    <div id="layerPanel">
        <ul>
            <li></li>
        </ul>
    </div>
</div>
`;
    
    panel = document.createElement("div");
    panel.innerHTML = HTML;
    
    return panel;
}

function show(event) {
    if (!panel) event.node.appendChild(createPanel());
}

function update(selection) {
    try {
        
    } catch (e) {
        console.log(e);
    }
}

module.exports.show = show;
module.exports.update = update;