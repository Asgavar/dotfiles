(require 'package)
(let* ((no-ssl (and (memq system-type '(windows-nt ms-dos))
                    (not (gnutls-available-p))))
       (proto (if no-ssl "http" "https")))
  ;; Comment/uncomment these two lines to enable/disable MELPA and MELPA Stable as desired
  (add-to-list 'package-archives (cons "melpa" (concat proto "://melpa.org/packages/")) t)
  ;;(add-to-list 'package-archives (cons "melpa-stable" (concat proto "://stable.melpa.org/packages/")) t)
  (when (< emacs-major-version 24)
    ;; For important compatibility libraries like cl-lib
    (add-to-list 'package-archives '("gnu" . (concat proto "://elpa.gnu.org/packages/")))))

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("e0c66085db350558f90f676e5a51c825cb1e0622020eeda6c573b07cb8d44be5" default)))
 '(package-selected-packages (quote (omnisharp csharp-mode company))))

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

(add-to-list 'load-path "~/.emacs.d/evil")
(require 'evil)

(evil-mode 1)  ; vim emulation
(electric-pair-mode 1)  ; insert two parens at a time
(global-linum-mode 1)  ; display line numbers
(global-company-mode 1)  ; auto-completion

(global-set-key [f12] 'eshell)  ; who needs help anyway
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
