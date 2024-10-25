import { app } from "../../scripts/app.js";

/**
 * parse and sort prompt!
 *
 * If the prompt is wrong, it can throw an error.
 *
 * @param prompt prompt string
 * @returns sorted prompt string
 */
function sort(prompt) {
    let cur = [];
    let buf = "";
    let escape = false;
    const stack = [];
    for (const c of prompt) {
        switch (c) {
            case "(":
                if (escape) {
                    buf += c;
                    escape = false;
                } else {
                    const parent = cur;
                    cur = [];
                    stack.push(parent);
                    parent.push(cur);
                }
                break;

            case ")":
                if (escape) {
                    buf += c;
                    escape = false;
                } else {
                    buf = buf.trim();
                    let weight = /:\d+(\.\d+)?/.exec(buf);
                    if (weight) {
                        buf = buf.substring(0, weight.index);
                        weight = weight[0];
                    }
                    if (buf) cur.push(buf);
                    buf = cur.sort().join(", ");
                    if (weight) {
                        buf += weight;
                    }
                    while (cur.length > 0) cur.pop();
                    cur = stack.pop();
                    cur.pop();
                    cur.push(`(${buf})`);
                    buf = "";
                }
                break;

            case ",":
                escape = false;
                buf = buf.trim();
                if (buf) cur.push(buf);
                buf = "";
                break;

            case "\\":
                escape = !escape;
                buf += c;
                break;

            default:
                buf += c;
                escape = false;
                break;
        }
    }
    buf = cur.sort().join(", ");
    if (buf) buf += ", ";
    return buf;
}

function sortPrompt(value, options, e, menu, node) {
    const widget = node.widgets[0];
    try {
        widget.value = sort(widget.value);
    } catch (e) {
        window.alert("sorting failed");
    }
}

app.registerExtension({
    name: "sortprompt",
    beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType?.comfyClass == "CLIPTextEncode") {
            const original_getExtraMenuOptions =
                nodeType.prototype.getExtraMenuOptions;

            nodeType.prototype.getExtraMenuOptions = function (_, options) {
                original_getExtraMenuOptions?.apply(this, arguments);
                options.push({
                    content: `sort prompt`,
                    callback: sortPrompt,
                });
            };
        }
    },
});
