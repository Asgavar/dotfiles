setsid wal -r
export XKB_DEFAULT_LAYOUT=pl
export XKB_DEFAULT_OPTIONS=caps:swapescape
if grep pustka /etc/hostname
    export TERM=xterm  # tbw, nic nie zmienia
    export XDG_RUNTIME_DIR=/home/asgavar/.xdg
    alias usbtether "/home/asgavar/dotfiles/things_void/usb_tether.sh"
end
alias dropbox "python2 /home/asgavar/dropbox.py"
clear
