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
            replaceheading:"Replace...",
            layerheading: "Layer Information",
            focusedArtboard:"Please select an artboard",
        }
    },
    ja: {
        panelUI: {
            searchheading: "検索文字",
            replaceheading:"置換文字",
            layerheading: "レイヤー情報",
            focusedArtboard:"アートボードを選択してください",
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
        <input type="search" id="searchInput" uxp-quiet="true" placeholder="${uiString_language.panelUI.searchheading}">
    </div>
    <div id="replaceArea">
        <input type="text" id="replaceInput" uxp-quiet="true" placeholder="${uiString_language.panelUI.replaceheading}">
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
    
    const searchInput = panel.querySelector("#searchInput");
    const replaceInput = panel.querySelector("#replaceInput");
    searchInput.addEventListener("change", inputChanged);
    replaceInput.addEventListener("change",inputChanged);

    function inputChanged(e) {
        application.editDocument(selection => {

            let inputType = e.target.getAttribute("id");
            let searchText = panel.querySelector("#searchInput").value;
            let replaceText = panel.querySelector("#replaceInput").value;
            
            /*
            switch (inputType) {
                case "searchInput":
                    console.log(e.keyCode);
                    if (e.keyCode == 13) {
                        console.log("Enter");
                        panel.querySelector("#searchInput").focus();
                    }
                    break;
            }
            */
            if (e.target.text != "") {
                if (selection.focusedArtboard !== null) {
                    let artboardNode = selection.items[0].constructor.name != "Artboard" ? selection.items[0].parent : selection.items[0];
                    artboardNode.children.forEach(childData => {
                        if (childData.children.length) {
                            whileChild(childData);
                        } else {
                            searchAndReplace(childData);
                        }
                    });
                } else {
                    console.log("node Artboard");
                }
            }

            function whileChild(childData) {
                childData.children.forEach(child => {
                    if (child.children.length) {
                        whileChild(child);
                    } else {
                        searchAndReplace(child);
                    }
                });
            }

            function searchAndReplace(child) {
                if (child.constructor.name == "Text") {
                    switch (inputType) {
                        case "searchInput":
                            if (child.text.match(searchText)) {
                                addPluginData(child);
                            }
                        break;
                        case "replaceInput":
                            if (replaceText) {
                                if (child.text.match(searchText)) {
                                    let searchRegExp = new RegExp(searchText,'g');
                                    child.text = child.text.replace(searchRegExp,replaceText);
                                }
                            }
                        break;
                    }
                }
            }

            function addPluginData(child) {
                if (child.parent.constructor.name == "Artboard") {
                    console.log(child, "parentArtboard!");
                    child.plugindata = { searchTarget: true };
                } else {
                    addPluginData(child.parent);
                }
            }

        });
    }

    return panel;
}

function show(event) {
    if (!panel) event.node.appendChild(createPanel());
}

function update(selection) {
    try {
        panel.querySelector("#layerPanel > ul").innerHTML = "<li></li>";
		if(selection.items.length > 0){
            let parentNode = selection.items[0].parent;
            let childData = [];
			let className = "";
			let layerHTML = "";

			panel.querySelector("#layerPanel > ul").innerHTML += "<li><img src='./assets/icon_" + parentNode.constructor.name.toLowerCase() + ".png'><span>" + parentNode.name + "</span></li>";
			selection.items[0].parent.children.forEach(function (contents){
				childData.push(contents);
			});
			childData.reverse();

            for(let i=0;i<childData.length;i++){
                className = childData[i].selected ? "layerList childeList selectedList" : "layerList childeList";
                className += childData[i].plugindata ? " searchTarget" : "";
				layerHTML += "<li class='" + className + "'><img src='./assets/icon_" + childData[i].constructor.name.toLowerCase() + ".png'><span>" + childData[i].name + "</span></li>";
            }
            panel.querySelector("#layerPanel > ul").innerHTML = layerHTML;
			const layerList = panel.querySelectorAll("#layerPanel .layerList");
			for(let i = 0; i < layerList.length; i++){
				layerList[i].addEventListener("click", event => {
					application.editDocument(selection => {
						selection.items = [childData[i]];
					});
				});
			}
		}

    } catch (e) {
        console.log(e);
    }
}

module.exports.show = show;
module.exports.update = update;