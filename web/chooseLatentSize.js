import { app } from "../../scripts/app.js";

function subMenu(value, options, e, menu, node) {
    const subMenu = new LiteGraph.ContextMenu(
        ["768x1344", "1024x1024", "1344x768"],
        {
            event: e,
            callback: function (value, options, e, menu, node) {
                const [w, h] = value.split("x");
                const width = node.widgets.find((x) => x.name == "width");
                const height = node.widgets.find((x) => x.name == "height");
                width.value = parseInt(w);
                height.value = parseInt(h);
            },
            parentMenu: menu,
            node: node,
        }
    );
}

app.registerExtension({
    name: "chooseLatentSize",
    beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType?.comfyClass == "EmptyLatentImage") {
            const original_getExtraMenuOptions =
                nodeType.prototype.getExtraMenuOptions;

            nodeType.prototype.getExtraMenuOptions = function (_, options) {
                original_getExtraMenuOptions?.apply(this, arguments);
                options.push({
                    content: "SDXL Sizes",
                    has_submenu: true,
                    callback: subMenu,
                });
            };
        }
    },
});
