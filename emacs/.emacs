(set-frame-font "InputMono Medium" nil t)

(add-to-list 'load-path "~/.emacs.d/evil")
(require 'evil)

(evil-mode 1)  ; vim emulation
(electric-pair-mode 1)  ; insert two parens at a time
(global-linum-mode 1)  ; display line numbers

(global-set-key [f1] 'eshell)  ; who needs help anyway
(defalias 'yes-or-no-p 'y-or-n-p)  ; omgomg saves two keystrokes each time
