cat /home/asgavar/.cache/wal/sequences

export LANG=en_US.utf8
export _JAVA_AWT_WM_NONREPARENTING=1
export XKB_DEFAULT_LAYOUT=pl
export XKB_DEFAULT_OPTIONS=caps:swapescape
export XDG_RUNTIME_DIR=/home/asgavar/.xdg
export EDITOR=emacsclient
export VISUAL=emacsclient
export TERM=xterm
export BROWSER=/usr/bin/opera
export REQUESTS_CA_BUNDLE=/etc/ssl/certs
export BAT_THEME=1337
export PAGER=slit

export VAULT_ADDR=https://vault.service.osa

set -gx PATH /usr/local/bin ~/.gem/ruby/*/bin ~/.local/bin /opt/bin ~/go/bin ~/.stack/programs/x86_64-linux/*/bin $PATH

setxkbmap -option "caps:swapescape"
setxkbmap pl

alias usbtether "/home/asgavar/dotfiles/things_void/usb_tether.sh"
alias dropbox "python2 /home/asgavar/dropbox.py"
alias off "sudo poweroff"
alias swm "sudo wifi-menu"
alias r "ranger"
alias s sway
alias pp "polybar papiesz"
alias vpnopera "sudo openconnect --juniper vpn.opera.software --authgroup=OperaEmployeesOTP --user=ajuraszek"

alias magit='emacsclient -c -t -e \(magit-status\)'
alias gs "git status"
alias gl "git log --graph --oneline"
alias ga "git add ."
alias gc "git commit"
alias gp "git push"
alias gdw "git diff -w"

# emacs ansi-term support
if test -n "$EMACS"
  set -x TERM eterm-color
end

function fish_title
  true
end

clear

# opam configuration
#source /home/asgavar/.opam/opam-init/init.fish > /dev/null 2> /dev/null; or true

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/home/asgavar/google-cloud-sdk/path.fish.inc' ]; . '/home/asgavar/google-cloud-sdk/path.fish.inc'; end
