cat /home/asgavar/.cache/wal/sequences

export _JAVA_AWT_WM_NONREPARENTING=1
export XKB_DEFAULT_LAYOUT=pl
export XKB_DEFAULT_OPTIONS=caps:swapescape
export XDG_RUNTIME_DIR=/home/asgavar/.xdg

set -gx PATH /usr/local/bin $PATH

setxkbmap -option "caps:swapescape"
setxkbmap pl

alias usbtether "/home/asgavar/dotfiles/things_void/usb_tether.sh"
alias dropbox "python2 /home/asgavar/dropbox.py"
alias off "sudo poweroff"
alias swm "sudo wifi-menu"

alias gs "git status"
alias gl "git log --graph --oneline"
alias ga "git add ."
alias gc "git commit"
alias gp "git push"
alias gdw "git diff -w"

function fish_title;end
clear
