import json
from time import sleep
import re

def some_function(**kwargs):
    "I am just a function"
    sleep(3)

class SomeClass(dict):
    """
    Docstring describing class functionality

    >>> SomeClass().method()
    4

    """

    CONSTANT = '''Maecenas ut ligula ante.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Cras quis risus non purus rutrum sollicitudin.
    '''
    FIXED = 3.1415

    def __init__(self, a, b, *, keyword=45, **kw):
        self.prop = keyword
        self.key = list(kw.items())
        if kw and a or not b:
            self.some_fn = lambda x: a[1:b*x:2]

    async def method(self, parameter: int):
        await some_coroutine(parameter, kword=None, another='hello')

    @decorated
    def no_way(self, *args):
        # Fairly commented method
        while True:
            breakpoint()  # TODO: apply debugger style as in javascript
            print('string formatting {}'.format(args[0]))
            print(f'modern formatting {args[0]} here')
            print(u'unicode literal')
            if args.pop(0):
                break
        return self

    @property
    def value(self):
        # TODO:
        # NOTE: note test
        # FIXME: this requires fixing
        return self.b

    XRE = re.compile(r'^(?:\+|-|)[a-z0-9][a-z0-9-_]*$', re.I)

    def yet_another(self):
        yield 'vitae tempus eros tincidunt {:02} nec'.format(self.FIXED)
        yield from xgenerator(3, 4, 5)
