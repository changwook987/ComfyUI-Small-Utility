import { ComfyExtension } from "@comfyorg/comfyui-frontend-types";

export const sortPrompt: ComfyExtension = {
  name: "smallutility.sort_prompt",
  beforeRegisterNodeDef(nodeType, nodeData, _app) {
    if (nodeData.name === "CLIPTextEncode") {
      const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;

      nodeType.prototype.getExtraMenuOptions = function (canvas, options) {
        getExtraMenuOptions?.apply(this, [canvas, options]);

        options.push({
          content: "sort prompt",
          callback(_value, _options, _event, _previous_menu, node) {
            const widget = node?.widgets?.[0];

            try {
              if (widget) widget.value = sort(widget.value as string);
            } catch (e) {
              window.alert("sorting failed");
            }
          },
        });

        return options;
      };
    }
  },
};

type CurrentItem = string | CurrentItem[];

const sort = (prompt: string): string => {
  let cur: CurrentItem[] = [];
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
          let weight_arr = /:\d+(\.\d+)?/.exec(buf);
          let weight: string | null = null;
          if (weight_arr) {
            buf = buf.substring(0, weight_arr.index);
            weight = weight_arr[0];
          }
          if (buf) cur.push(buf);
          buf = cur.sort().join(", ");
          if (weight) {
            buf += weight;
          }
          while (cur.length > 0) cur.pop();
          cur = stack.pop()!;
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
  buf = buf.trim();
  if (buf) cur.push(buf);
  buf = cur.sort().join(", ");
  if (buf) buf += ", ";
  return buf;
};
