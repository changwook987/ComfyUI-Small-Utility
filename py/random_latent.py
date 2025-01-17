import torch
import math
import random
import comfy.model_management


class RandomEmptyLatent:
    def __init__(self):
        self.device = comfy.model_management.intermediate_device()

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "seed": (
                    "INT",
                    {
                        "default": 0,
                        "min": 0,
                        "max": 0xFFFFFFFFFFFFFFFF,
                    },
                ),
                "pixel_count": (
                    "INT",
                    {
                        "default": 1024**2,
                        "min": 512**2,
                        "max": 2048**2,
                    },
                ),
                "min_ratio": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 10}),
                "max_ratio": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 10}),
                "batch_size": (
                    "INT",
                    {
                        "default": 1,
                        "min": 1,
                        "max": 4096,
                    },
                ),
            }
        }

    @classmethod
    def VALIDATE_INPUTS(cls, **kwargs):
        if kwargs["min_ratio"] > kwargs["max_ratio"]:
            return "max ratio must be greater than min ratio."
        return True

    RETURN_TYPES = ("LATENT", "INT", "INT")
    RETURN_NAMES = ("latent", "width", "height")

    CATEGORY = "latent"

    FUNCTION = "generate"

    def generate(
        self,
        seed=0,
        pixel_count=1024**2,
        min_ratio=1,
        max_ratio=1,
        batch_size=1,
    ):
        generator = random.Random(seed)

        ratio = generator.uniform(min_ratio, max_ratio)

        width = int(math.sqrt(pixel_count * ratio / 64) + 0.5)
        height = int(width / ratio + 0.5)

        latent = torch.zeros(
            (batch_size, 4, height, width),
            device=self.device,
        )

        return ({"samples": latent}, width * 8, height * 8)
