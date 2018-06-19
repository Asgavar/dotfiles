cat /home/asgavar/.cache/wal/sequences

export LANG=en_US.utf8
export _JAVA_AWT_WM_NONREPARENTING=1
export XKB_DEFAULT_LAYOUT=pl
export XKB_DEFAULT_OPTIONS=caps:swapescape
export XDG_RUNTIME_DIR=/home/asgavar/.xdg
export EDITOR="emacsclient -t"
export VISUAL="emacsclient -c"

set -gx PATH /usr/local/bin ~/.gem/ruby/*/bin ~/.local/bin /opt/bin $PATH

setxkbmap -option "caps:swapescape"
setxkbmap pl

alias usbtether "/home/asgavar/dotfiles/things_void/usb_tether.sh"
alias dropbox "python2 /home/asgavar/dropbox.py"
alias off "sudo poweroff"
alias swm "sudo wifi-menu"
alias r "ranger"

alias gs "git status"
alias gl "git log --graph --oneline"
alias ga "git add ."
alias gc "git commit"
alias gp "git push"
alias gdw "git diff -w"

alias emax "emacsclient -c"
alias temacs "emacsclient -t"

# emacs ansi-term support
if test -n "$EMACS"
  set -x TERM eterm-color
end

function fish_title
  true
end

clear
