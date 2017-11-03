import json
from time import sleep

def some_function(**kwargs):
    "I am just a function"
    sleep(3)

class SomeClass(dict):
    """Docstring describing class functionality"""

    CONSTANT = '''Maecenas ut ligula ante.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Cras quis risus non purus rutrum sollicitudin.
    '''
    FIXED = 3.1415

    def __init__(self, a, b, *, keyword=45, **kw):
        self.prop = keyword
        self.key = list(kw.items())
        if kw:
            self.some_fn = lambda x: a[1:b*x:2]

    async def method(self, parameter: int):
        await some_coroutine(parameter, kword=None, another='hello')

    @decorated
    def no_way(self, *args):
        # Faily commented method
        while True:
            print('string formatting {}'.format(args[0]))
            if args.pop(0):
                break
        return self

    @property
    def value(self):
        return self.b

    def yet_another(self):
        yield 'vitae tempus eros tincidunt {:02} nec'.format(self.FIXED)
        yield from xgenerator(3, 4, 5)
