import { ComfyExtension } from "@comfyorg/comfyui-frontend-types";
import { ContextMenu } from "@comfyorg/litegraph";

export const chooseLatentSize: ComfyExtension = {
  name: "smallutility.choose_latent_size",
  beforeRegisterNodeDef(nodeType, nodeData, _app) {
    if (nodeData.name === "EmptyLatentImage") {
      const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
      nodeType.prototype.getExtraMenuOptions = function (canvas, options) {
        getExtraMenuOptions?.apply(this, [canvas, options]);
        options.push({
          content: "SDXL Sizes",
          has_submenu: true,
          callback(_value, _options, event, previous_menu, node) {
            new ContextMenu(["768x1344", "1024x1024", "1344x768"], {
              event: event,
              callback(value: string, _options, _event, _previous_menu, node) {
                const [w, h] = value.split("x").map((s) => parseInt(s));
                const width = node?.widgets?.find((x) => x.name === "width");
                const height = node?.widgets?.find((x) => x.name === "height");
                if (width) width.value = w;
                if (height) height.value = h;
              },
              parentMenu: previous_menu,
              node: node,
            });
          },
        });
        return options;
      };
    }
  },
};
