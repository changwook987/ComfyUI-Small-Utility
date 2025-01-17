import { ComfyExtension } from "@comfyorg/comfyui-frontend-types";

export const evalNode: ComfyExtension = {
  name: "smallutility.eval_node",
  beforeRegisterNodeDef(nodeType, nodeData, _app) {
    if (nodeData.name === "Eval") {
      const onNodeCreated = nodeType.prototype.onNodeCreated;
      nodeType.prototype.onNodeCreated = function () {
        onNodeCreated?.apply(this);
        this.addWidget(
          "STRING",
          "result_type",
          "*",
          function (type, _canvas, node) {
            if (typeof type === "string" || !node) return;
            const outputs = node.outputs;
            for (const output of outputs) {
              output.name = type;
              output.type = type;
              output.localized_name = type;
            }
          },
        );
      };
      nodeType.prototype.onConnectionsChange = function (
        type,
        index,
        isConnected,
        link_info,
        _inputOrOutput,
      ) {
        if (!link_info) return;
        if (type == 1) {
          if (!isConnected && this.inputs[index].name !== "cmd") {
            this.removeInput(index);
          }
          let inputIdx = 0;
          for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].name === "cmd") {
              continue;
            }
            inputIdx++;
            this.inputs[i].name = `input${inputIdx}`;
          }
          let last = this.inputs[this.inputs.length - 1];
          if (last.name === "cmd") {
            last = this.inputs[this.inputs.length - 2];
          }
          if (last.link) {
            inputIdx++;
            this.addInput(`input${inputIdx}`, "*", { shape: 7 });
          }
        }
      };
    }
  },
};
