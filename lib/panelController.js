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
            
            if (e.target.text != "") {
                if (selection.focusedArtboard !== null) {
                    let searchRegExp = new RegExp(searchText,'g');
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
                                console.log(child);
                            }
                        break;
                        case "replaceInput":
                            if (replaceText) {
                                if (child.text.match(searchText)) {
                                    child.text = child.text.replace(searchText,replaceText);
                                }
                            }
                        break;
                    }
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
                let sectionName = "<span style='font-size:0.9em;margin-left:0.5em;color:#00628E;'>" + childData[i].name + "</span>";
				className = childData[i].selected ? "layerList childeList selectedList" : "layerList childeList";
				layerHTML += "<li class='" + className + "'><img src='./assets/icon_" + childData[i].constructor.name.toLowerCase() + ".png'><span>" + childData[i].name + sectionName + "</span></li>";
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