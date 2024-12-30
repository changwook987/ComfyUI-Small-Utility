class AnyType(str):
    def __ne__(self, __value: object) -> bool:
        return False


any = AnyType("*")


class Eval:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "cmd": ("STRING", {"multiline": True, "dynamicPrompts": True}),
            },
            "optional": {
                "input1": ("*",),
            },
        }

    @classmethod
    def VALIDATE_INPUTS(cls, input_types):
        return True

    RETURN_TYPES = (any,)
    FUNCTION = "execution"

    def execution(self, cmd, **kwargs):
        kwargs["result"] = None
        exec(cmd, {}, kwargs)
        return (kwargs["result"],)
