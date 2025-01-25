import { ComfyExtension } from "@comfyorg/comfyui-frontend-types";

export const sortPrompt: ComfyExtension = {
  name: "smallutility.sort_prompt",
  beforeRegisterNodeDef(nodeType, _nodeData, _app) {
    const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;

    nodeType.prototype.getExtraMenuOptions = function (canvas, options) {
      getExtraMenuOptions?.apply(this, [canvas, options]);

      options.push({
        content: "sort prompt",
        callback(_value, _options, _event, _previous_menu, node) {
          node?.widgets?.forEach((widget) => {
            if (typeof widget.value === "string"
              && widget.type !== "combo") {
              try {
                if (widget) widget.value = sort(widget.value);
              } catch (e: any) {
                console.log(e);
              }
            }
          })
        },
      });

      return options;
    };
  },
};

type CurrentItem = string | CurrentItem[];

const sort = (prompt: string): string => {
  let cur: CurrentItem[] = [];
  let buf = "";
  let escape = false;
  const stack: CurrentItem[][] = [];
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
