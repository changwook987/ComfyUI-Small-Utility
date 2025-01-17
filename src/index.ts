import "@comfyorg/comfyui-frontend-types";

import { chooseLatentSize } from "./extensions/choose_latent_size";
import { evalNode } from "./extensions/eval_node";
import { sortPrompt } from "./extensions/sort_prompt";

const app = window.comfyAPI.app.app;

app.registerExtension(chooseLatentSize);
app.registerExtension(sortPrompt);
app.registerExtension(evalNode);
