import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "smallutility",
    beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name == "Eval") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);
                this.addWidget("STRING", "result_type", "*", function (type) {
                    if (!type) {
                        return;
                    }
                    const outputs = arguments[2].outputs;
                    for (let i = 0; i < outputs.length; i++) {
                        outputs[i].name = type;
                        outputs[i].type = type;
                        outputs[i].localized_name = type;
                    }
                });
            };
            nodeType.prototype.onConnectionsChange = function (
                type,
                index,
                connected,
                link_info
            ) {
                if (!link_info) {
                    return;
                }

                if (type == 1) {
                    if (!connected && this.inputs[index].name != "cmd") {
                        this.removeInput(index);
                    }
                    let inputIdx = 0;
                    for (let i = 0; i < this.inputs.length; i++) {
                        if (this.inputs[i].name == "cmd") {
                            continue;
                        }
                        inputIdx += 1;
                        this.inputs[i].name = `input${inputIdx}`;
                    }
                    let last = this.inputs[this.inputs.length - 1];
                    if (last.name == "cmd") {
                        last = this.inputs[this.inputs.length - 2];
                    }
                    if (last.link) {
                        inputIdx += 1;
                        this.addInput(`input${inputIdx}`, "*", { shape: 7 });
                    }
                }
            };
        }
    },
});
