from .py.random_latent import RandomEmptyLatent
from .py.evaluation import Eval

WEB_DIRECTORY = "web"

NODE_CLASS_MAPPINGS = {
    "RandomEmptyLatent": RandomEmptyLatent,
    "Eval": Eval,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "RandomEmptyLatent": "Random Empty Latent",
    "Eval": "Eval",
}

__all__ = [
    "WEB_DIRECTORY",
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
]
