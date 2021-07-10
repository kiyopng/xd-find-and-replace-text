/*
    Name:Xd-Find-And-Replace-Text
    author:@xd_kiyo
*/

const panelController = require("./lib/panelController.js");

function show(event) {
    panelController.show(event);
}

function update(selection) {
    panelController.update(selection);
}

module.exports = {
    panels: {
        findAndReplace: {
            show,
            update
        }
    }
};
