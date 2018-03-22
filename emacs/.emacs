(require 'package)

(add-to-list 'package-archives (cons "melpa" "https://melpa.org/packages/") t)

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("e0c66085db350558f90f676e5a51c825cb1e0622020eeda6c573b07cb8d44be5" default)))
 '(package-selected-packages
   (quote
    (neotree pdf-tools racket-mode omnisharp csharp-mode company))))

(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )

(package-initialize)

(set-frame-font "InputMono Medium" nil t)
(setq indent-tabs-mode nil)  ; set tabs to 4 spaces globally
(setq tab-width 4)
(setq company-idle-delay 0.01)  ; gotta go fast

(add-to-list 'load-path "~/.emacs.d/evil")
(require 'evil)

(evil-mode 1)  ; vim emulation
(electric-pair-mode 1)  ; insert two parens at a time
(show-paren-mode 1)  ; highlight matching parens
(global-linum-mode 1)  ; display line numbers
(global-company-mode 1)  ; auto-completion

(global-set-key [f12] 'eshell)  ; who needs help anyway
(global-set-key [f1] 'neotree-toggle)
(defalias 'yes-or-no-p 'y-or-n-p)  ; omgomg saves two keystrokes each time


;;; C#

(eval-after-load
  'company
  '(add-to-list 'company-backends #'company-omnisharp))

(defun csharp-mode-setup ()
  (omnisharp-mode)
  (company-mode-on)
  (flycheck-mode 1)

  (setq indent-tabs-mode nil)
  (setq c-syntactic-indentation t)
  (c-set-style "ellemtel")
  (setq c-basic-offset 4)
  (setq truncate-lines t)
  (setq tab-width 4)
  (setq evil-shift-width 4)

  (local-set-key (kbd "C-c r r") 'omnisharp-run-code-action-refactoring)
  (local-set-key (kbd "C-c C-c") 'recompile))

(add-hook 'csharp-mode-hook 'csharp-mode-setup t)


;;; Racket

(defun racket-mode-setup ()
  (setq tab-always-indent 'complete)
  (local-set-key [f5] racket-run))

(add-hook 'racket-mode-hook 'racket-mode-setup t)
