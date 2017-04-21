from subprocess import Popen

from libqtile import bar, hook, layout, widget
from libqtile.command import lazy
from libqtile.config import Click, Drag, Group, Key, Screen

wmname = 'qtile'
mod = 'mod4'

# Key bindings
keys = [
    # Window manager controls
    Key([mod, 'shift'], 'r', lazy.restart()),
    Key([mod, 'shift'], 'e', lazy.shutdown()),
    Key([mod], 'd', lazy.spawncmd()),
    Key([mod], 'Return', lazy.spawn('termite')),
    Key([mod, 'shift'], 'q',      lazy.window.kill()),

    Key([mod], 'Tab', lazy.layout.next()),
    Key([mod], 'Left', lazy.screen.prevgroup()),
    Key([mod], 'Right', lazy.screen.nextgroup()),

    # Layout modification
    Key([mod, 'control'], 'space', lazy.window.toggle_floating()),

    # Switch between windows in current stack pane
    Key([mod], 'k', lazy.layout.down()),
    Key([mod], 'j', lazy.layout.up()),

    # Move windows up or down in current stack
    Key([mod, 'shift'], 'Down', lazy.layout.shuffle_down()),
    Key([mod, 'shift'], 'Up', lazy.layout.shuffle_up()),

    # Switch window focus to other pane(s) of stack
    Key([mod], 'space', lazy.layout.next()),

    # Toggle between different layouts as defined below
    Key([mod], 'Tab',    lazy.nextlayout()),
]

# Mouse bindings and options
mouse = (
    Drag([mod], 'Button1', lazy.window.set_position_floating(),
        start=lazy.window.get_position()),
    Drag([mod], 'Button3', lazy.window.set_size_floating(),
        start=lazy.window.get_size()),
)

bring_front_click = True
cursor_warp = False
follow_mouse_focus = True

# Groups
groups = [
    Group('1: www'),
    Group('2: kod'),
    Group('3: konsola'),
    Group('4: random I'),
    Group('5: random II'),
    # Group('i'),
    # Group('o'),
    # Group('p'),
]
for i in groups:
    # mod + letter of group = switch to group
    # a tak dokladniej to 1. znak
    keys.append(Key([mod], i.name[0], lazy.group[i.name].toscreen()))

    # mod + shift + letter of group = switch to & move focused window to group
    keys.append(Key([mod, 'shift'], i.name[0], lazy.window.togroup(i.name)))

dgroups_key_binder = None
dgroups_app_rules = []

# Layouts
layouts = [
    #layout.Max(),
    #layout.Stack(num_stacks=2),
    #layout.Tile(),
    layout.RatioTile(),
    #layout.Matrix(),
]

floating_layout = layout.Floating()

# Screens and widget options
screens = [
    Screen(
        bottom=bar.Bar(
            widgets=[
                widget.GroupBox(
                    highlight_method='block',
                    inactive='999999'
                ),
                widget.Prompt(),
                widget.WindowName(),
                widget.Systray(),
                widget.Clock(format='%a %d %b %H:%M %p'),
            ],
            size=30,
            background=['34495e', '34495e'],
        ),
    ),
]

widget_defaults = dict(
    font='Lemon',
    fontsize=15,
)

auto_fullscreen = True


def main(qtile):
    ''' This function is called when Qtile starts. '''
    #Popen(["termite"])
    Popen(["feh", "--bg-fill", "/home/asgavar/tapeta.png"])
