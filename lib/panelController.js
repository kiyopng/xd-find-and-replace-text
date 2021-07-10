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
        <input type="search" id="searchInput" uxp-quiet="true" placeholder="${uiString_language.panelUI.searchheading}">
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
    searchInput.addEventListener("change",searchText);

    function searchText(e) {
        application.editDocument(selection => {
            //アートボードを選択している時のみ
            if (selection.focusedArtboard) {
                console.log("Artboard!!");
                //アートボード内のオブジェクトを取得しconstructorを取得
                selection.items[0].children.forEach(childData => {
                    console.log(childData);
                });
            } else {
                console.log("node Artboard");
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