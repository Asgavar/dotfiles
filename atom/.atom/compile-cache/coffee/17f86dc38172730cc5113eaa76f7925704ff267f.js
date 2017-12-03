(function() {
  var $, CompositeDisposable, PlatformIOTerminalView, StatusBar, StatusIcon, View, _, os, path, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  PlatformIOTerminalView = require('./view');

  StatusIcon = require('./status-icon');

  os = require('os');

  path = require('path');

  _ = require('underscore');

  module.exports = StatusBar = (function(superClass) {
    extend(StatusBar, superClass);

    function StatusBar() {
      this.moveTerminalView = bind(this.moveTerminalView, this);
      this.onDropTabBar = bind(this.onDropTabBar, this);
      this.onDrop = bind(this.onDrop, this);
      this.onDragOver = bind(this.onDragOver, this);
      this.onDragEnd = bind(this.onDragEnd, this);
      this.onDragLeave = bind(this.onDragLeave, this);
      this.onDragStart = bind(this.onDragStart, this);
      this.closeAll = bind(this.closeAll, this);
      return StatusBar.__super__.constructor.apply(this, arguments);
    }

    StatusBar.prototype.terminalViews = [];

    StatusBar.prototype.activeTerminal = null;

    StatusBar.prototype.returnFocus = null;

    StatusBar.content = function() {
      return this.div({
        "class": 'platformio-ide-terminal status-bar',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.i({
            "class": "icon icon-plus",
            click: 'newTerminalView',
            outlet: 'plusBtn'
          });
          _this.ul({
            "class": "list-inline status-container",
            tabindex: '-1',
            outlet: 'statusContainer',
            is: 'space-pen-ul'
          });
          return _this.i({
            "class": "icon icon-x",
            click: 'closeAll',
            outlet: 'closeBtn'
          });
        };
      })(this));
    };

    StatusBar.prototype.initialize = function(statusBarProvider) {
      var handleBlur, handleFocus;
      this.statusBarProvider = statusBarProvider;
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'platformio-ide-terminal:focus': (function(_this) {
          return function() {
            return _this.focusTerminal();
          };
        })(this),
        'platformio-ide-terminal:new': (function(_this) {
          return function() {
            return _this.newTerminalView();
          };
        })(this),
        'platformio-ide-terminal:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'platformio-ide-terminal:next': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activeNextTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'platformio-ide-terminal:prev': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activePrevTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'platformio-ide-terminal:close': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this),
        'platformio-ide-terminal:close-all': (function(_this) {
          return function() {
            return _this.closeAll();
          };
        })(this),
        'platformio-ide-terminal:rename': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.rename();
            });
          };
        })(this),
        'platformio-ide-terminal:insert-selected-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection('$S');
            });
          };
        })(this),
        'platformio-ide-terminal:insert-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.inputDialog();
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-1': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText1'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-2': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText2'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-3': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText3'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-4': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText4'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-5': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText5'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-6': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText6'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-7': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText7'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-8': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection(atom.config.get('platformio-ide-terminal.customTexts.customText8'));
            });
          };
        })(this),
        'platformio-ide-terminal:fullscreen': (function(_this) {
          return function() {
            return _this.activeTerminal.maximize();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.xterm', {
        'platformio-ide-terminal:paste': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.paste();
            });
          };
        })(this),
        'platformio-ide-terminal:copy': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.copy();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          var mapping, nextTerminal, prevTerminal;
          if (item == null) {
            return;
          }
          if (item.constructor.name === "PlatformIOTerminalView") {
            return setTimeout(item.focus, 100);
          } else if (item.constructor.name === "TextEditor") {
            mapping = atom.config.get('platformio-ide-terminal.core.mapTerminalsTo');
            if (mapping === 'None') {
              return;
            }
            if (!item.getPath()) {
              return;
            }
            switch (mapping) {
              case 'File':
                nextTerminal = _this.getTerminalById(item.getPath(), function(view) {
                  return view.getId().filePath;
                });
                break;
              case 'Folder':
                nextTerminal = _this.getTerminalById(path.dirname(item.getPath()), function(view) {
                  return view.getId().folderPath;
                });
            }
            prevTerminal = _this.getActiveTerminalView();
            if (prevTerminal !== nextTerminal) {
              if (nextTerminal == null) {
                if (atom.config.get('platformio-ide-terminal.core.mapTerminalsToAutoOpen')) {
                  return nextTerminal = _this.createTerminalView();
                }
              } else {
                _this.setActiveTerminalView(nextTerminal);
                if (prevTerminal != null ? prevTerminal.panel.isVisible() : void 0) {
                  return nextTerminal.toggle();
                }
              }
            }
          }
        };
      })(this)));
      this.registerContextMenu();
      this.subscriptions.add(atom.tooltips.add(this.plusBtn, {
        title: 'New Terminal'
      }));
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close All'
      }));
      this.statusContainer.on('dblclick', (function(_this) {
        return function(event) {
          if (event.target === event.delegateTarget) {
            return _this.newTerminalView();
          }
        };
      })(this));
      this.statusContainer.on('dragstart', '.pio-terminal-status-icon', this.onDragStart);
      this.statusContainer.on('dragend', '.pio-terminal-status-icon', this.onDragEnd);
      this.statusContainer.on('dragleave', this.onDragLeave);
      this.statusContainer.on('dragover', this.onDragOver);
      this.statusContainer.on('drop', this.onDrop);
      handleBlur = (function(_this) {
        return function() {
          var terminal;
          if (terminal = PlatformIOTerminalView.getFocusedTerminal()) {
            _this.returnFocus = _this.terminalViewForTerminal(terminal);
            return terminal.blur();
          }
        };
      })(this);
      handleFocus = (function(_this) {
        return function() {
          if (_this.returnFocus) {
            return setTimeout(function() {
              var ref1;
              if ((ref1 = _this.returnFocus) != null) {
                ref1.focus(true);
              }
              return _this.returnFocus = null;
            }, 100);
          }
        };
      })(this);
      window.addEventListener('blur', handleBlur);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('blur', handleBlur);
        }
      });
      window.addEventListener('focus', handleFocus);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('focus', handleFocus);
        }
      });
      return this.attach();
    };

    StatusBar.prototype.registerContextMenu = function() {
      return this.subscriptions.add(atom.commands.add('.platformio-ide-terminal.status-bar', {
        'platformio-ide-terminal:status-red': this.setStatusColor,
        'platformio-ide-terminal:status-orange': this.setStatusColor,
        'platformio-ide-terminal:status-yellow': this.setStatusColor,
        'platformio-ide-terminal:status-green': this.setStatusColor,
        'platformio-ide-terminal:status-blue': this.setStatusColor,
        'platformio-ide-terminal:status-purple': this.setStatusColor,
        'platformio-ide-terminal:status-pink': this.setStatusColor,
        'platformio-ide-terminal:status-cyan': this.setStatusColor,
        'platformio-ide-terminal:status-magenta': this.setStatusColor,
        'platformio-ide-terminal:status-default': this.clearStatusColor,
        'platformio-ide-terminal:context-close': function(event) {
          return $(event.target).closest('.pio-terminal-status-icon')[0].terminalView.destroy();
        },
        'platformio-ide-terminal:context-hide': function(event) {
          var statusIcon;
          statusIcon = $(event.target).closest('.pio-terminal-status-icon')[0];
          if (statusIcon.isActive()) {
            return statusIcon.terminalView.hide();
          }
        },
        'platformio-ide-terminal:context-rename': function(event) {
          return $(event.target).closest('.pio-terminal-status-icon')[0].rename();
        }
      }));
    };

    StatusBar.prototype.registerPaneSubscription = function() {
      return this.subscriptions.add(this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBar;
          paneElement = $(atom.views.getView(pane));
          tabBar = paneElement.find('ul');
          tabBar.on('drop', function(event) {
            return _this.onDropTabBar(event, pane);
          });
          tabBar.on('dragstart', function(event) {
            var ref1;
            if (((ref1 = event.target.item) != null ? ref1.constructor.name : void 0) !== 'PlatformIOTerminalView') {
              return;
            }
            return event.originalEvent.dataTransfer.setData('platformio-ide-terminal-tab', 'true');
          });
          return pane.onDidDestroy(function() {
            return tabBar.off('drop', this.onDropTabBar);
          });
        };
      })(this)));
    };

    StatusBar.prototype.createTerminalView = function(autoRun) {
      var args, env, shell, shellArguments, shellEnv;
      shell = atom.config.get('platformio-ide-terminal.core.shell');
      shellArguments = atom.config.get('platformio-ide-terminal.core.shellArguments');
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      shellEnv = atom.config.get('platformio-ide-terminal.core.shellEnv');
      env = {};
      shellEnv.split(' ').forEach((function(_this) {
        return function(element) {
          var configVar, envVar;
          configVar = element.split('=');
          envVar = {};
          envVar[configVar[0]] = configVar[1];
          return env = _.extend(env, envVar);
        };
      })(this));
      return this.createEmptyTerminalView(autoRun, shell, args, env);
    };

    StatusBar.prototype.createEmptyTerminalView = function(autoRun, shell, args, env) {
      var directory, editorFolder, editorPath, home, id, j, len, platformIOTerminalView, projectFolder, pwd, ref1, ref2, statusIcon;
      if (autoRun == null) {
        autoRun = [];
      }
      if (shell == null) {
        shell = null;
      }
      if (args == null) {
        args = [];
      }
      if (env == null) {
        env = {};
      }
      if (this.paneSubscription == null) {
        this.registerPaneSubscription();
      }
      projectFolder = atom.project.getPaths()[0];
      editorPath = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      if (editorPath != null) {
        editorFolder = path.dirname(editorPath);
        ref2 = atom.project.getPaths();
        for (j = 0, len = ref2.length; j < len; j++) {
          directory = ref2[j];
          if (editorPath.indexOf(directory) >= 0) {
            projectFolder = directory;
          }
        }
      }
      if ((projectFolder != null ? projectFolder.indexOf('atom://') : void 0) >= 0) {
        projectFolder = void 0;
      }
      home = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
      switch (atom.config.get('platformio-ide-terminal.core.workingDirectory')) {
        case 'Project':
          pwd = projectFolder || editorFolder || home;
          break;
        case 'Active File':
          pwd = editorFolder || projectFolder || home;
          break;
        default:
          pwd = home;
      }
      id = editorPath || projectFolder || home;
      id = {
        filePath: id,
        folderPath: path.dirname(id)
      };
      statusIcon = new StatusIcon();
      platformIOTerminalView = new PlatformIOTerminalView(id, pwd, statusIcon, this, shell, args, env, autoRun);
      statusIcon.initialize(platformIOTerminalView);
      platformIOTerminalView.attach();
      this.terminalViews.push(platformIOTerminalView);
      this.statusContainer.append(statusIcon);
      return platformIOTerminalView;
    };

    StatusBar.prototype.activeNextTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index + 1);
    };

    StatusBar.prototype.activePrevTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index - 1);
    };

    StatusBar.prototype.indexOf = function(view) {
      return this.terminalViews.indexOf(view);
    };

    StatusBar.prototype.activeTerminalView = function(index) {
      if (this.terminalViews.length < 2) {
        return false;
      }
      if (index >= this.terminalViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.terminalViews.length - 1;
      }
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.getActiveTerminalView = function() {
      return this.activeTerminal;
    };

    StatusBar.prototype.focusTerminal = function() {
      var terminal;
      if (this.activeTerminal == null) {
        return;
      }
      if (terminal = PlatformIOTerminalView.getFocusedTerminal()) {
        return this.activeTerminal.blur();
      } else {
        return this.activeTerminal.focusTerminal();
      }
    };

    StatusBar.prototype.getTerminalById = function(target, selector) {
      var index, j, ref1, terminal;
      if (selector == null) {
        selector = function(terminal) {
          return terminal.id;
        };
      }
      for (index = j = 0, ref1 = this.terminalViews.length; 0 <= ref1 ? j <= ref1 : j >= ref1; index = 0 <= ref1 ? ++j : --j) {
        terminal = this.terminalViews[index];
        if (terminal != null) {
          if (selector(terminal) === target) {
            return terminal;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.terminalViewForTerminal = function(terminal) {
      var index, j, ref1, terminalView;
      for (index = j = 0, ref1 = this.terminalViews.length; 0 <= ref1 ? j <= ref1 : j >= ref1; index = 0 <= ref1 ? ++j : --j) {
        terminalView = this.terminalViews[index];
        if (terminalView != null) {
          if (terminalView.getTerminal() === terminal) {
            return terminalView;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.runInActiveView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if (view != null) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.runNewTerminal = function() {
      this.activeTerminal = this.createEmptyTerminalView();
      this.activeTerminal.toggle();
      return this.activeTerminal;
    };

    StatusBar.prototype.runCommandInNewTerminal = function(commands) {
      this.activeTerminal = this.createTerminalView(commands);
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.runInOpenView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if ((view != null) && view.panel.isVisible()) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.setActiveTerminalView = function(view) {
      return this.activeTerminal = view;
    };

    StatusBar.prototype.removeTerminalView = function(view) {
      var index;
      index = this.indexOf(view);
      if (index < 0) {
        return;
      }
      this.terminalViews.splice(index, 1);
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.activateAdjacentTerminal = function(index) {
      if (index == null) {
        index = 0;
      }
      if (!(this.terminalViews.length > 0)) {
        return false;
      }
      index = Math.max(0, index - 1);
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.newTerminalView = function() {
      var ref1;
      if ((ref1 = this.activeTerminal) != null ? ref1.animating : void 0) {
        return;
      }
      this.activeTerminal = this.createTerminalView();
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.attach = function() {
      return this.statusBarProvider.addLeftTile({
        item: this,
        priority: -93
      });
    };

    StatusBar.prototype.destroyActiveTerm = function() {
      var index;
      if (this.activeTerminal == null) {
        return;
      }
      index = this.indexOf(this.activeTerminal);
      this.activeTerminal.destroy();
      this.activeTerminal = null;
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.closeAll = function() {
      var index, j, ref1, view;
      for (index = j = ref1 = this.terminalViews.length; ref1 <= 0 ? j <= 0 : j >= 0; index = ref1 <= 0 ? ++j : --j) {
        view = this.terminalViews[index];
        if (view != null) {
          view.destroy();
        }
      }
      return this.activeTerminal = null;
    };

    StatusBar.prototype.destroy = function() {
      var j, len, ref1, view;
      this.subscriptions.dispose();
      ref1 = this.terminalViews;
      for (j = 0, len = ref1.length; j < len; j++) {
        view = ref1[j];
        view.ptyProcess.terminate();
        view.terminal.destroy();
      }
      return this.detach();
    };

    StatusBar.prototype.toggle = function() {
      if (this.terminalViews.length === 0) {
        this.activeTerminal = this.createTerminalView();
      } else if (this.activeTerminal === null) {
        this.activeTerminal = this.terminalViews[0];
      }
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.setStatusColor = function(event) {
      var color;
      color = event.type.match(/\w+$/)[0];
      color = atom.config.get("platformio-ide-terminal.iconColors." + color).toRGBAString();
      return $(event.target).closest('.pio-terminal-status-icon').css('color', color);
    };

    StatusBar.prototype.clearStatusColor = function(event) {
      return $(event.target).closest('.pio-terminal-status-icon').css('color', '');
    };

    StatusBar.prototype.onDragStart = function(event) {
      var element;
      event.originalEvent.dataTransfer.setData('platformio-ide-terminal-panel', 'true');
      element = $(event.target).closest('.pio-terminal-status-icon');
      element.addClass('is-dragging');
      return event.originalEvent.dataTransfer.setData('from-index', element.index());
    };

    StatusBar.prototype.onDragLeave = function(event) {
      return this.removePlaceholder();
    };

    StatusBar.prototype.onDragEnd = function(event) {
      return this.clearDropTarget();
    };

    StatusBar.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, statusIcons;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent.dataTransfer.getData('platformio-ide-terminal') !== 'true') {
        return;
      }
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
        return;
      }
      this.removeDropTargetClasses();
      statusIcons = this.statusContainer.children('.pio-terminal-status-icon');
      if (newDropTargetIndex < statusIcons.length) {
        element = statusIcons.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholder().insertBefore(element);
      } else {
        element = statusIcons.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholder().insertAfter(element);
      }
    };

    StatusBar.prototype.onDrop = function(event) {
      var dataTransfer, fromIndex, pane, paneIndex, panelEvent, tabEvent, toIndex, view;
      dataTransfer = event.originalEvent.dataTransfer;
      panelEvent = dataTransfer.getData('platformio-ide-terminal-panel') === 'true';
      tabEvent = dataTransfer.getData('platformio-ide-terminal-tab') === 'true';
      if (!(panelEvent || tabEvent)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      toIndex = this.getDropTargetIndex(event);
      this.clearDropTarget();
      if (tabEvent) {
        fromIndex = parseInt(dataTransfer.getData('sortable-index'));
        paneIndex = parseInt(dataTransfer.getData('from-pane-index'));
        pane = atom.workspace.getPanes()[paneIndex];
        view = pane.itemAtIndex(fromIndex);
        pane.removeItem(view, false);
        view.show();
        view.toggleTabView();
        this.terminalViews.push(view);
        if (view.statusIcon.isActive()) {
          view.open();
        }
        this.statusContainer.append(view.statusIcon);
        fromIndex = this.terminalViews.length - 1;
      } else {
        fromIndex = parseInt(dataTransfer.getData('from-index'));
      }
      return this.updateOrder(fromIndex, toIndex);
    };

    StatusBar.prototype.onDropTabBar = function(event, pane) {
      var dataTransfer, fromIndex, tabBar, view;
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('platformio-ide-terminal-panel') !== 'true') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.clearDropTarget();
      fromIndex = parseInt(dataTransfer.getData('from-index'));
      view = this.terminalViews[fromIndex];
      view.css("height", "");
      view.terminal.element.style.height = "";
      tabBar = $(event.target).closest('.tab-bar');
      view.toggleTabView();
      this.removeTerminalView(view);
      this.statusContainer.children().eq(fromIndex).detach();
      view.statusIcon.removeTooltip();
      pane.addItem(view, pane.getItems().length);
      pane.activateItem(view);
      return view.focus();
    };

    StatusBar.prototype.clearDropTarget = function() {
      var element;
      element = this.find('.is-dragging');
      element.removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    StatusBar.prototype.removeDropTargetClasses = function() {
      this.statusContainer.find('.is-drop-target').removeClass('is-drop-target');
      return this.statusContainer.find('.drop-target-is-after').removeClass('drop-target-is-after');
    };

    StatusBar.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, statusIcons, target;
      target = $(event.target);
      if (this.isPlaceholder(target)) {
        return;
      }
      statusIcons = this.statusContainer.children('.pio-terminal-status-icon');
      element = target.closest('.pio-terminal-status-icon');
      if (element.length === 0) {
        element = statusIcons.last();
      }
      if (!element.length) {
        return 0;
      }
      elementCenter = element.offset().left + element.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return statusIcons.index(element);
      } else if (element.next('.pio-terminal-status-icon').length > 0) {
        return statusIcons.index(element.next('.pio-terminal-status-icon'));
      } else {
        return statusIcons.index(element) + 1;
      }
    };

    StatusBar.prototype.getPlaceholder = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li class="placeholder"></li>');
    };

    StatusBar.prototype.removePlaceholder = function() {
      var ref1;
      if ((ref1 = this.placeholderEl) != null) {
        ref1.remove();
      }
      return this.placeholderEl = null;
    };

    StatusBar.prototype.isPlaceholder = function(element) {
      return element.is('.placeholder');
    };

    StatusBar.prototype.iconAtIndex = function(index) {
      return this.getStatusIcons().eq(index);
    };

    StatusBar.prototype.getStatusIcons = function() {
      return this.statusContainer.children('.pio-terminal-status-icon');
    };

    StatusBar.prototype.moveIconToIndex = function(icon, toIndex) {
      var container, followingIcon;
      followingIcon = this.getStatusIcons()[toIndex];
      container = this.statusContainer[0];
      if (followingIcon != null) {
        return container.insertBefore(icon, followingIcon);
      } else {
        return container.appendChild(icon);
      }
    };

    StatusBar.prototype.moveTerminalView = function(fromIndex, toIndex) {
      var activeTerminal, view;
      activeTerminal = this.getActiveTerminalView();
      view = this.terminalViews.splice(fromIndex, 1)[0];
      this.terminalViews.splice(toIndex, 0, view);
      return this.setActiveTerminalView(activeTerminal);
    };

    StatusBar.prototype.updateOrder = function(fromIndex, toIndex) {
      var icon;
      if (fromIndex === toIndex) {
        return;
      }
      if (fromIndex < toIndex) {
        toIndex--;
      }
      icon = this.getStatusIcons().eq(fromIndex).detach();
      this.moveIconToIndex(icon.get(0), toIndex);
      this.moveTerminalView(fromIndex, toIndex);
      icon.addClass('inserted');
      return icon.one('webkitAnimationEnd', function() {
        return icon.removeClass('inserted');
      });
    };

    return StatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXNnYXZhci9kb3RmaWxlcy9hdG9tLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsL2xpYi9zdGF0dXMtYmFyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTs7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUQsRUFBSTs7RUFFSixzQkFBQSxHQUF5QixPQUFBLENBQVEsUUFBUjs7RUFDekIsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUViLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Ozs7Ozs7Ozt3QkFDSixhQUFBLEdBQWU7O3dCQUNmLGNBQUEsR0FBZ0I7O3dCQUNoQixXQUFBLEdBQWE7O0lBRWIsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0NBQVA7UUFBNkMsUUFBQSxFQUFVLENBQUMsQ0FBeEQ7T0FBTCxFQUFnRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDOUQsS0FBQyxDQUFBLENBQUQsQ0FBRztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7WUFBeUIsS0FBQSxFQUFPLGlCQUFoQztZQUFtRCxNQUFBLEVBQVEsU0FBM0Q7V0FBSDtVQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDhCQUFQO1lBQXVDLFFBQUEsRUFBVSxJQUFqRDtZQUF1RCxNQUFBLEVBQVEsaUJBQS9EO1lBQWtGLEVBQUEsRUFBSSxjQUF0RjtX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cmUgJ2F0b20nXG57JCwgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuUGxhdGZvcm1JT1Rlcm1pbmFsVmlldyA9IHJlcXVpcmUgJy4vdmlldydcblN0YXR1c0ljb24gPSByZXF1aXJlICcuL3N0YXR1cy1pY29uJ1xuXG5vcyA9IHJlcXVpcmUgJ29zJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgVmlld1xuICB0ZXJtaW5hbFZpZXdzOiBbXVxuICBhY3RpdmVUZXJtaW5hbDogbnVsbFxuICByZXR1cm5Gb2N1czogbnVsbFxuXG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbCBzdGF0dXMtYmFyJywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQGkgY2xhc3M6IFwiaWNvbiBpY29uLXBsdXNcIiwgY2xpY2s6ICduZXdUZXJtaW5hbFZpZXcnLCBvdXRsZXQ6ICdwbHVzQnRuJ1xuICAgICAgQHVsIGNsYXNzOiBcImxpc3QtaW5saW5lIHN0YXR1cy1jb250YWluZXJcIiwgdGFiaW5kZXg6ICctMScsIG91dGxldDogJ3N0YXR1c0NvbnRhaW5lcicsIGlzOiAnc3BhY2UtcGVuLXVsJ1xuICAgICAgQGkgY2xhc3M6IFwiaWNvbiBpY29uLXhcIiwgY2xpY2s6ICdjbG9zZUFsbCcsIG91dGxldDogJ2Nsb3NlQnRuJ1xuXG4gIGluaXRpYWxpemU6IChAc3RhdHVzQmFyUHJvdmlkZXIpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpmb2N1cyc6ID0+IEBmb2N1c1Rlcm1pbmFsKClcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpuZXcnOiA9PiBAbmV3VGVybWluYWxWaWV3KClcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpuZXh0JzogPT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBAYWN0aXZlVGVybWluYWxcbiAgICAgICAgcmV0dXJuIGlmIEBhY3RpdmVUZXJtaW5hbC5pc0FuaW1hdGluZygpXG4gICAgICAgIEBhY3RpdmVUZXJtaW5hbC5vcGVuKCkgaWYgQGFjdGl2ZU5leHRUZXJtaW5hbFZpZXcoKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnByZXYnOiA9PlxuICAgICAgICByZXR1cm4gdW5sZXNzIEBhY3RpdmVUZXJtaW5hbFxuICAgICAgICByZXR1cm4gaWYgQGFjdGl2ZVRlcm1pbmFsLmlzQW5pbWF0aW5nKClcbiAgICAgICAgQGFjdGl2ZVRlcm1pbmFsLm9wZW4oKSBpZiBAYWN0aXZlUHJldlRlcm1pbmFsVmlldygpXG4gICAgICAncGxhdGZvcm1pby1pZGUtdGVybWluYWw6Y2xvc2UnOiA9PiBAZGVzdHJveUFjdGl2ZVRlcm0oKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmNsb3NlLWFsbCc6ID0+IEBjbG9zZUFsbCgpXG4gICAgICAncGxhdGZvcm1pby1pZGUtdGVybWluYWw6cmVuYW1lJzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5yZW5hbWUoKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1zZWxlY3RlZC10ZXh0JzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oJyRTJylcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDppbnNlcnQtdGV4dCc6ID0+IEBydW5JbkFjdGl2ZVZpZXcgKGkpIC0+IGkuaW5wdXREaWFsb2coKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC0xJzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0MScpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC0yJzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0MicpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC0zJzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0MycpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC00JzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0NCcpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC01JzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0NScpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC02JzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0NicpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC03JzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0NycpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmluc2VydC1jdXN0b20tdGV4dC04JzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5pbnNlcnRTZWxlY3Rpb24oYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jdXN0b21UZXh0cy5jdXN0b21UZXh0OCcpKVxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmZ1bGxzY3JlZW4nOiA9PiBAYWN0aXZlVGVybWluYWwubWF4aW1pemUoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcueHRlcm0nLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnBhc3RlJzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5wYXN0ZSgpXG4gICAgICAncGxhdGZvcm1pby1pZGUtdGVybWluYWw6Y29weSc6ID0+IEBydW5JbkFjdGl2ZVZpZXcgKGkpIC0+IGkuY29weSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkgPT5cbiAgICAgIHJldHVybiB1bmxlc3MgaXRlbT9cblxuICAgICAgaWYgaXRlbS5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiUGxhdGZvcm1JT1Rlcm1pbmFsVmlld1wiXG4gICAgICAgIHNldFRpbWVvdXQgaXRlbS5mb2N1cywgMTAwXG4gICAgICBlbHNlIGlmIGl0ZW0uY29uc3RydWN0b3IubmFtZSBpcyBcIlRleHRFZGl0b3JcIlxuICAgICAgICBtYXBwaW5nID0gYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC5jb3JlLm1hcFRlcm1pbmFsc1RvJylcbiAgICAgICAgcmV0dXJuIGlmIG1hcHBpbmcgaXMgJ05vbmUnXG4gICAgICAgIHJldHVybiB1bmxlc3MgaXRlbS5nZXRQYXRoKClcblxuICAgICAgICBzd2l0Y2ggbWFwcGluZ1xuICAgICAgICAgIHdoZW4gJ0ZpbGUnXG4gICAgICAgICAgICBuZXh0VGVybWluYWwgPSBAZ2V0VGVybWluYWxCeUlkIGl0ZW0uZ2V0UGF0aCgpLCAodmlldykgLT4gdmlldy5nZXRJZCgpLmZpbGVQYXRoXG4gICAgICAgICAgd2hlbiAnRm9sZGVyJ1xuICAgICAgICAgICAgbmV4dFRlcm1pbmFsID0gQGdldFRlcm1pbmFsQnlJZCBwYXRoLmRpcm5hbWUoaXRlbS5nZXRQYXRoKCkpLCAodmlldykgLT4gdmlldy5nZXRJZCgpLmZvbGRlclBhdGhcblxuICAgICAgICBwcmV2VGVybWluYWwgPSBAZ2V0QWN0aXZlVGVybWluYWxWaWV3KClcbiAgICAgICAgaWYgcHJldlRlcm1pbmFsICE9IG5leHRUZXJtaW5hbFxuICAgICAgICAgIGlmIG5vdCBuZXh0VGVybWluYWw/XG4gICAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLmNvcmUubWFwVGVybWluYWxzVG9BdXRvT3BlbicpXG4gICAgICAgICAgICAgIG5leHRUZXJtaW5hbCA9IEBjcmVhdGVUZXJtaW5hbFZpZXcoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzZXRBY3RpdmVUZXJtaW5hbFZpZXcobmV4dFRlcm1pbmFsKVxuICAgICAgICAgICAgbmV4dFRlcm1pbmFsLnRvZ2dsZSgpIGlmIHByZXZUZXJtaW5hbD8ucGFuZWwuaXNWaXNpYmxlKClcblxuICAgIEByZWdpc3RlckNvbnRleHRNZW51KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAcGx1c0J0biwgdGl0bGU6ICdOZXcgVGVybWluYWwnXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBjbG9zZUJ0biwgdGl0bGU6ICdDbG9zZSBBbGwnXG5cbiAgICBAc3RhdHVzQ29udGFpbmVyLm9uICdkYmxjbGljaycsIChldmVudCkgPT5cbiAgICAgIEBuZXdUZXJtaW5hbFZpZXcoKSB1bmxlc3MgZXZlbnQudGFyZ2V0ICE9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0XG5cbiAgICBAc3RhdHVzQ29udGFpbmVyLm9uICdkcmFnc3RhcnQnLCAnLnBpby10ZXJtaW5hbC1zdGF0dXMtaWNvbicsIEBvbkRyYWdTdGFydFxuICAgIEBzdGF0dXNDb250YWluZXIub24gJ2RyYWdlbmQnLCAnLnBpby10ZXJtaW5hbC1zdGF0dXMtaWNvbicsIEBvbkRyYWdFbmRcbiAgICBAc3RhdHVzQ29udGFpbmVyLm9uICdkcmFnbGVhdmUnLCBAb25EcmFnTGVhdmVcbiAgICBAc3RhdHVzQ29udGFpbmVyLm9uICdkcmFnb3ZlcicsIEBvbkRyYWdPdmVyXG4gICAgQHN0YXR1c0NvbnRhaW5lci5vbiAnZHJvcCcsIEBvbkRyb3BcblxuICAgIGhhbmRsZUJsdXIgPSA9PlxuICAgICAgaWYgdGVybWluYWwgPSBQbGF0Zm9ybUlPVGVybWluYWxWaWV3LmdldEZvY3VzZWRUZXJtaW5hbCgpXG4gICAgICAgIEByZXR1cm5Gb2N1cyA9IEB0ZXJtaW5hbFZpZXdGb3JUZXJtaW5hbCh0ZXJtaW5hbClcbiAgICAgICAgdGVybWluYWwuYmx1cigpXG5cbiAgICBoYW5kbGVGb2N1cyA9ID0+XG4gICAgICBpZiBAcmV0dXJuRm9jdXNcbiAgICAgICAgc2V0VGltZW91dCA9PlxuICAgICAgICAgIEByZXR1cm5Gb2N1cz8uZm9jdXModHJ1ZSlcbiAgICAgICAgICBAcmV0dXJuRm9jdXMgPSBudWxsXG4gICAgICAgICwgMTAwXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsIGhhbmRsZUJsdXJcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogLT5cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdibHVyJywgaGFuZGxlQmx1clxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2ZvY3VzJywgaGFuZGxlRm9jdXNcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogLT5cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdmb2N1cycsIGhhbmRsZUZvY3VzXG5cbiAgICBAYXR0YWNoKClcblxuICByZWdpc3RlckNvbnRleHRNZW51OiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnBsYXRmb3JtaW8taWRlLXRlcm1pbmFsLnN0YXR1cy1iYXInLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnN0YXR1cy1yZWQnOiBAc2V0U3RhdHVzQ29sb3JcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpzdGF0dXMtb3JhbmdlJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAncGxhdGZvcm1pby1pZGUtdGVybWluYWw6c3RhdHVzLXllbGxvdyc6IEBzZXRTdGF0dXNDb2xvclxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnN0YXR1cy1ncmVlbic6IEBzZXRTdGF0dXNDb2xvclxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnN0YXR1cy1ibHVlJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAncGxhdGZvcm1pby1pZGUtdGVybWluYWw6c3RhdHVzLXB1cnBsZSc6IEBzZXRTdGF0dXNDb2xvclxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnN0YXR1cy1waW5rJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAncGxhdGZvcm1pby1pZGUtdGVybWluYWw6c3RhdHVzLWN5YW4nOiBAc2V0U3RhdHVzQ29sb3JcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpzdGF0dXMtbWFnZW50YSc6IEBzZXRTdGF0dXNDb2xvclxuICAgICAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOnN0YXR1cy1kZWZhdWx0JzogQGNsZWFyU3RhdHVzQ29sb3JcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpjb250ZXh0LWNsb3NlJzogKGV2ZW50KSAtPlxuICAgICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLnBpby10ZXJtaW5hbC1zdGF0dXMtaWNvbicpWzBdLnRlcm1pbmFsVmlldy5kZXN0cm95KClcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpjb250ZXh0LWhpZGUnOiAoZXZlbnQpIC0+XG4gICAgICAgIHN0YXR1c0ljb24gPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLnBpby10ZXJtaW5hbC1zdGF0dXMtaWNvbicpWzBdXG4gICAgICAgIHN0YXR1c0ljb24udGVybWluYWxWaWV3LmhpZGUoKSBpZiBzdGF0dXNJY29uLmlzQWN0aXZlKClcbiAgICAgICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbDpjb250ZXh0LXJlbmFtZSc6IChldmVudCkgLT5cbiAgICAgICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5waW8tdGVybWluYWwtc3RhdHVzLWljb24nKVswXS5yZW5hbWUoKVxuXG4gIHJlZ2lzdGVyUGFuZVN1YnNjcmlwdGlvbjogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmVTdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlUGFuZXMgKHBhbmUpID0+XG4gICAgICBwYW5lRWxlbWVudCA9ICQoYXRvbS52aWV3cy5nZXRWaWV3KHBhbmUpKVxuICAgICAgdGFiQmFyID0gcGFuZUVsZW1lbnQuZmluZCgndWwnKVxuXG4gICAgICB0YWJCYXIub24gJ2Ryb3AnLCAoZXZlbnQpID0+IEBvbkRyb3BUYWJCYXIoZXZlbnQsIHBhbmUpXG4gICAgICB0YWJCYXIub24gJ2RyYWdzdGFydCcsIChldmVudCkgLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBldmVudC50YXJnZXQuaXRlbT8uY29uc3RydWN0b3IubmFtZSBpcyAnUGxhdGZvcm1JT1Rlcm1pbmFsVmlldydcbiAgICAgICAgZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAncGxhdGZvcm1pby1pZGUtdGVybWluYWwtdGFiJywgJ3RydWUnXG4gICAgICBwYW5lLm9uRGlkRGVzdHJveSAtPiB0YWJCYXIub2ZmICdkcm9wJywgQG9uRHJvcFRhYkJhclxuXG4gIGNyZWF0ZVRlcm1pbmFsVmlldzogKGF1dG9SdW4pIC0+XG4gICAgc2hlbGwgPSBhdG9tLmNvbmZpZy5nZXQgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLmNvcmUuc2hlbGwnXG4gICAgc2hlbGxBcmd1bWVudHMgPSBhdG9tLmNvbmZpZy5nZXQgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLmNvcmUuc2hlbGxBcmd1bWVudHMnXG4gICAgYXJncyA9IHNoZWxsQXJndW1lbnRzLnNwbGl0KC9cXHMrL2cpLmZpbHRlciAoYXJnKSAtPiBhcmdcbiAgICBzaGVsbEVudiA9IGF0b20uY29uZmlnLmdldCAncGxhdGZvcm1pby1pZGUtdGVybWluYWwuY29yZS5zaGVsbEVudidcbiAgICBlbnYgPSB7fVxuICAgIHNoZWxsRW52LnNwbGl0KCcgJykuZm9yRWFjaCgoZWxlbWVudCkgPT5cbiAgICAgIGNvbmZpZ1ZhciA9IGVsZW1lbnQuc3BsaXQoJz0nKVxuICAgICAgZW52VmFyID0ge31cbiAgICAgIGVudlZhcltjb25maWdWYXJbMF1dID0gY29uZmlnVmFyWzFdXG4gICAgICBlbnYgPSBfLmV4dGVuZChlbnYsIGVudlZhcilcbiAgICApXG4gICAgQGNyZWF0ZUVtcHR5VGVybWluYWxWaWV3IGF1dG9SdW4sIHNoZWxsLCBhcmdzLCBlbnZcblxuICBjcmVhdGVFbXB0eVRlcm1pbmFsVmlldzogKGF1dG9SdW49W10sIHNoZWxsID0gbnVsbCwgYXJncyA9IFtdLCBlbnY9IHt9KSAtPlxuICAgIEByZWdpc3RlclBhbmVTdWJzY3JpcHRpb24oKSB1bmxlc3MgQHBhbmVTdWJzY3JpcHRpb24/XG5cbiAgICBwcm9qZWN0Rm9sZGVyID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICBlZGl0b3JQYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcblxuICAgIGlmIGVkaXRvclBhdGg/XG4gICAgICBlZGl0b3JGb2xkZXIgPSBwYXRoLmRpcm5hbWUoZWRpdG9yUGF0aClcbiAgICAgIGZvciBkaXJlY3RvcnkgaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICAgICAgaWYgZWRpdG9yUGF0aC5pbmRleE9mKGRpcmVjdG9yeSkgPj0gMFxuICAgICAgICAgIHByb2plY3RGb2xkZXIgPSBkaXJlY3RvcnlcblxuICAgIHByb2plY3RGb2xkZXIgPSB1bmRlZmluZWQgaWYgcHJvamVjdEZvbGRlcj8uaW5kZXhPZignYXRvbTovLycpID49IDBcblxuICAgIGhvbWUgPSBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMicgdGhlbiBwcm9jZXNzLmVudi5IT01FUEFUSCBlbHNlIHByb2Nlc3MuZW52LkhPTUVcblxuICAgIHN3aXRjaCBhdG9tLmNvbmZpZy5nZXQoJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLmNvcmUud29ya2luZ0RpcmVjdG9yeScpXG4gICAgICB3aGVuICdQcm9qZWN0JyB0aGVuIHB3ZCA9IHByb2plY3RGb2xkZXIgb3IgZWRpdG9yRm9sZGVyIG9yIGhvbWVcbiAgICAgIHdoZW4gJ0FjdGl2ZSBGaWxlJyB0aGVuIHB3ZCA9IGVkaXRvckZvbGRlciBvciBwcm9qZWN0Rm9sZGVyIG9yIGhvbWVcbiAgICAgIGVsc2UgcHdkID0gaG9tZVxuXG4gICAgaWQgPSBlZGl0b3JQYXRoIG9yIHByb2plY3RGb2xkZXIgb3IgaG9tZVxuICAgIGlkID0gZmlsZVBhdGg6IGlkLCBmb2xkZXJQYXRoOiBwYXRoLmRpcm5hbWUoaWQpXG5cbiAgICBzdGF0dXNJY29uID0gbmV3IFN0YXR1c0ljb24oKVxuICAgIHBsYXRmb3JtSU9UZXJtaW5hbFZpZXcgPSBuZXcgUGxhdGZvcm1JT1Rlcm1pbmFsVmlldyhpZCwgcHdkLCBzdGF0dXNJY29uLCB0aGlzLCBzaGVsbCwgYXJncywgZW52LCBhdXRvUnVuKVxuICAgIHN0YXR1c0ljb24uaW5pdGlhbGl6ZShwbGF0Zm9ybUlPVGVybWluYWxWaWV3KVxuXG4gICAgcGxhdGZvcm1JT1Rlcm1pbmFsVmlldy5hdHRhY2goKVxuXG4gICAgQHRlcm1pbmFsVmlld3MucHVzaCBwbGF0Zm9ybUlPVGVybWluYWxWaWV3XG4gICAgQHN0YXR1c0NvbnRhaW5lci5hcHBlbmQgc3RhdHVzSWNvblxuICAgIHJldHVybiBwbGF0Zm9ybUlPVGVybWluYWxWaWV3XG5cbiAgYWN0aXZlTmV4dFRlcm1pbmFsVmlldzogLT5cbiAgICBpbmRleCA9IEBpbmRleE9mKEBhY3RpdmVUZXJtaW5hbClcbiAgICByZXR1cm4gZmFsc2UgaWYgaW5kZXggPCAwXG4gICAgQGFjdGl2ZVRlcm1pbmFsVmlldyBpbmRleCArIDFcblxuICBhY3RpdmVQcmV2VGVybWluYWxWaWV3OiAtPlxuICAgIGluZGV4ID0gQGluZGV4T2YoQGFjdGl2ZVRlcm1pbmFsKVxuICAgIHJldHVybiBmYWxzZSBpZiBpbmRleCA8IDBcbiAgICBAYWN0aXZlVGVybWluYWxWaWV3IGluZGV4IC0gMVxuXG4gIGluZGV4T2Y6ICh2aWV3KSAtPlxuICAgIEB0ZXJtaW5hbFZpZXdzLmluZGV4T2YodmlldylcblxuICBhY3RpdmVUZXJtaW5hbFZpZXc6IChpbmRleCkgLT5cbiAgICByZXR1cm4gZmFsc2UgaWYgQHRlcm1pbmFsVmlld3MubGVuZ3RoIDwgMlxuXG4gICAgaWYgaW5kZXggPj0gQHRlcm1pbmFsVmlld3MubGVuZ3RoXG4gICAgICBpbmRleCA9IDBcbiAgICBpZiBpbmRleCA8IDBcbiAgICAgIGluZGV4ID0gQHRlcm1pbmFsVmlld3MubGVuZ3RoIC0gMVxuXG4gICAgQGFjdGl2ZVRlcm1pbmFsID0gQHRlcm1pbmFsVmlld3NbaW5kZXhdXG4gICAgcmV0dXJuIHRydWVcblxuICBnZXRBY3RpdmVUZXJtaW5hbFZpZXc6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVUZXJtaW5hbFxuXG4gIGZvY3VzVGVybWluYWw6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAYWN0aXZlVGVybWluYWw/XG5cbiAgICBpZiB0ZXJtaW5hbCA9IFBsYXRmb3JtSU9UZXJtaW5hbFZpZXcuZ2V0Rm9jdXNlZFRlcm1pbmFsKClcbiAgICAgICAgQGFjdGl2ZVRlcm1pbmFsLmJsdXIoKVxuICAgIGVsc2VcbiAgICAgICAgQGFjdGl2ZVRlcm1pbmFsLmZvY3VzVGVybWluYWwoKVxuXG4gIGdldFRlcm1pbmFsQnlJZDogKHRhcmdldCwgc2VsZWN0b3IpIC0+XG4gICAgc2VsZWN0b3IgPz0gKHRlcm1pbmFsKSAtPiB0ZXJtaW5hbC5pZFxuXG4gICAgZm9yIGluZGV4IGluIFswIC4uIEB0ZXJtaW5hbFZpZXdzLmxlbmd0aF1cbiAgICAgIHRlcm1pbmFsID0gQHRlcm1pbmFsVmlld3NbaW5kZXhdXG4gICAgICBpZiB0ZXJtaW5hbD9cbiAgICAgICAgcmV0dXJuIHRlcm1pbmFsIGlmIHNlbGVjdG9yKHRlcm1pbmFsKSA9PSB0YXJnZXRcblxuICAgIHJldHVybiBudWxsXG5cbiAgdGVybWluYWxWaWV3Rm9yVGVybWluYWw6ICh0ZXJtaW5hbCkgLT5cbiAgICBmb3IgaW5kZXggaW4gWzAgLi4gQHRlcm1pbmFsVmlld3MubGVuZ3RoXVxuICAgICAgdGVybWluYWxWaWV3ID0gQHRlcm1pbmFsVmlld3NbaW5kZXhdXG4gICAgICBpZiB0ZXJtaW5hbFZpZXc/XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbFZpZXcgaWYgdGVybWluYWxWaWV3LmdldFRlcm1pbmFsKCkgPT0gdGVybWluYWxcblxuICAgIHJldHVybiBudWxsXG5cbiAgcnVuSW5BY3RpdmVWaWV3OiAoY2FsbGJhY2spIC0+XG4gICAgdmlldyA9IEBnZXRBY3RpdmVUZXJtaW5hbFZpZXcoKVxuICAgIGlmIHZpZXc/XG4gICAgICByZXR1cm4gY2FsbGJhY2sodmlldylcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJ1bk5ld1Rlcm1pbmFsOiAoKSAtPlxuICAgIEBhY3RpdmVUZXJtaW5hbCA9IEBjcmVhdGVFbXB0eVRlcm1pbmFsVmlldygpXG4gICAgQGFjdGl2ZVRlcm1pbmFsLnRvZ2dsZSgpXG4gICAgcmV0dXJuIEBhY3RpdmVUZXJtaW5hbFxuXG4gIHJ1bkNvbW1hbmRJbk5ld1Rlcm1pbmFsOiAoY29tbWFuZHMpIC0+XG4gICAgQGFjdGl2ZVRlcm1pbmFsID0gQGNyZWF0ZVRlcm1pbmFsVmlldyhjb21tYW5kcylcbiAgICBAYWN0aXZlVGVybWluYWwudG9nZ2xlKClcblxuICBydW5Jbk9wZW5WaWV3OiAoY2FsbGJhY2spIC0+XG4gICAgdmlldyA9IEBnZXRBY3RpdmVUZXJtaW5hbFZpZXcoKVxuICAgIGlmIHZpZXc/IGFuZCB2aWV3LnBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICByZXR1cm4gY2FsbGJhY2sodmlldylcbiAgICByZXR1cm4gbnVsbFxuXG4gIHNldEFjdGl2ZVRlcm1pbmFsVmlldzogKHZpZXcpIC0+XG4gICAgQGFjdGl2ZVRlcm1pbmFsID0gdmlld1xuXG4gIHJlbW92ZVRlcm1pbmFsVmlldzogKHZpZXcpIC0+XG4gICAgaW5kZXggPSBAaW5kZXhPZiB2aWV3XG4gICAgcmV0dXJuIGlmIGluZGV4IDwgMFxuICAgIEB0ZXJtaW5hbFZpZXdzLnNwbGljZSBpbmRleCwgMVxuXG4gICAgQGFjdGl2YXRlQWRqYWNlbnRUZXJtaW5hbCBpbmRleFxuXG4gIGFjdGl2YXRlQWRqYWNlbnRUZXJtaW5hbDogKGluZGV4PTApIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBAdGVybWluYWxWaWV3cy5sZW5ndGggPiAwXG5cbiAgICBpbmRleCA9IE1hdGgubWF4KDAsIGluZGV4IC0gMSlcbiAgICBAYWN0aXZlVGVybWluYWwgPSBAdGVybWluYWxWaWV3c1tpbmRleF1cblxuICAgIHJldHVybiB0cnVlXG5cbiAgbmV3VGVybWluYWxWaWV3OiAtPlxuICAgIHJldHVybiBpZiBAYWN0aXZlVGVybWluYWw/LmFuaW1hdGluZ1xuXG4gICAgQGFjdGl2ZVRlcm1pbmFsID0gQGNyZWF0ZVRlcm1pbmFsVmlldygpXG4gICAgQGFjdGl2ZVRlcm1pbmFsLnRvZ2dsZSgpXG5cbiAgYXR0YWNoOiAtPlxuICAgIEBzdGF0dXNCYXJQcm92aWRlci5hZGRMZWZ0VGlsZShpdGVtOiB0aGlzLCBwcmlvcml0eTogLTkzKVxuXG4gIGRlc3Ryb3lBY3RpdmVUZXJtOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVRlcm1pbmFsP1xuXG4gICAgaW5kZXggPSBAaW5kZXhPZihAYWN0aXZlVGVybWluYWwpXG4gICAgQGFjdGl2ZVRlcm1pbmFsLmRlc3Ryb3koKVxuICAgIEBhY3RpdmVUZXJtaW5hbCA9IG51bGxcblxuICAgIEBhY3RpdmF0ZUFkamFjZW50VGVybWluYWwgaW5kZXhcblxuICBjbG9zZUFsbDogPT5cbiAgICBmb3IgaW5kZXggaW4gW0B0ZXJtaW5hbFZpZXdzLmxlbmd0aCAuLiAwXVxuICAgICAgdmlldyA9IEB0ZXJtaW5hbFZpZXdzW2luZGV4XVxuICAgICAgaWYgdmlldz9cbiAgICAgICAgdmlldy5kZXN0cm95KClcbiAgICBAYWN0aXZlVGVybWluYWwgPSBudWxsXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBmb3IgdmlldyBpbiBAdGVybWluYWxWaWV3c1xuICAgICAgdmlldy5wdHlQcm9jZXNzLnRlcm1pbmF0ZSgpXG4gICAgICB2aWV3LnRlcm1pbmFsLmRlc3Ryb3koKVxuICAgIEBkZXRhY2goKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAdGVybWluYWxWaWV3cy5sZW5ndGggPT0gMFxuICAgICAgQGFjdGl2ZVRlcm1pbmFsID0gQGNyZWF0ZVRlcm1pbmFsVmlldygpXG4gICAgZWxzZSBpZiBAYWN0aXZlVGVybWluYWwgPT0gbnVsbFxuICAgICAgQGFjdGl2ZVRlcm1pbmFsID0gQHRlcm1pbmFsVmlld3NbMF1cbiAgICBAYWN0aXZlVGVybWluYWwudG9nZ2xlKClcblxuICBzZXRTdGF0dXNDb2xvcjogKGV2ZW50KSAtPlxuICAgIGNvbG9yID0gZXZlbnQudHlwZS5tYXRjaCgvXFx3KyQvKVswXVxuICAgIGNvbG9yID0gYXRvbS5jb25maWcuZ2V0KFwicGxhdGZvcm1pby1pZGUtdGVybWluYWwuaWNvbkNvbG9ycy4je2NvbG9yfVwiKS50b1JHQkFTdHJpbmcoKVxuICAgICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcucGlvLXRlcm1pbmFsLXN0YXR1cy1pY29uJykuY3NzICdjb2xvcicsIGNvbG9yXG5cbiAgY2xlYXJTdGF0dXNDb2xvcjogKGV2ZW50KSAtPlxuICAgICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcucGlvLXRlcm1pbmFsLXN0YXR1cy1pY29uJykuY3NzICdjb2xvcicsICcnXG5cbiAgb25EcmFnU3RhcnQ6IChldmVudCkgPT5cbiAgICBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC1wYW5lbCcsICd0cnVlJ1xuXG4gICAgZWxlbWVudCA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcucGlvLXRlcm1pbmFsLXN0YXR1cy1pY29uJylcbiAgICBlbGVtZW50LmFkZENsYXNzICdpcy1kcmFnZ2luZydcbiAgICBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdmcm9tLWluZGV4JywgZWxlbWVudC5pbmRleCgpXG5cbiAgb25EcmFnTGVhdmU6IChldmVudCkgPT5cbiAgICBAcmVtb3ZlUGxhY2Vob2xkZXIoKVxuXG4gIG9uRHJhZ0VuZDogKGV2ZW50KSA9PlxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gIG9uRHJhZ092ZXI6IChldmVudCkgPT5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB1bmxlc3MgZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgncGxhdGZvcm1pby1pZGUtdGVybWluYWwnKSBpcyAndHJ1ZSdcbiAgICAgIHJldHVyblxuXG4gICAgbmV3RHJvcFRhcmdldEluZGV4ID0gQGdldERyb3BUYXJnZXRJbmRleChldmVudClcbiAgICByZXR1cm4gdW5sZXNzIG5ld0Ryb3BUYXJnZXRJbmRleD9cbiAgICBAcmVtb3ZlRHJvcFRhcmdldENsYXNzZXMoKVxuICAgIHN0YXR1c0ljb25zID0gQHN0YXR1c0NvbnRhaW5lci5jaGlsZHJlbiAnLnBpby10ZXJtaW5hbC1zdGF0dXMtaWNvbidcblxuICAgIGlmIG5ld0Ryb3BUYXJnZXRJbmRleCA8IHN0YXR1c0ljb25zLmxlbmd0aFxuICAgICAgZWxlbWVudCA9IHN0YXR1c0ljb25zLmVxKG5ld0Ryb3BUYXJnZXRJbmRleCkuYWRkQ2xhc3MgJ2lzLWRyb3AtdGFyZ2V0J1xuICAgICAgQGdldFBsYWNlaG9sZGVyKCkuaW5zZXJ0QmVmb3JlKGVsZW1lbnQpXG4gICAgZWxzZVxuICAgICAgZWxlbWVudCA9IHN0YXR1c0ljb25zLmVxKG5ld0Ryb3BUYXJnZXRJbmRleCAtIDEpLmFkZENsYXNzICdkcm9wLXRhcmdldC1pcy1hZnRlcidcbiAgICAgIEBnZXRQbGFjZWhvbGRlcigpLmluc2VydEFmdGVyKGVsZW1lbnQpXG5cbiAgb25Ecm9wOiAoZXZlbnQpID0+XG4gICAge2RhdGFUcmFuc2Zlcn0gPSBldmVudC5vcmlnaW5hbEV2ZW50XG4gICAgcGFuZWxFdmVudCA9IGRhdGFUcmFuc2Zlci5nZXREYXRhKCdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC1wYW5lbCcpIGlzICd0cnVlJ1xuICAgIHRhYkV2ZW50ID0gZGF0YVRyYW5zZmVyLmdldERhdGEoJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLXRhYicpIGlzICd0cnVlJ1xuICAgIHJldHVybiB1bmxlc3MgcGFuZWxFdmVudCBvciB0YWJFdmVudFxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICB0b0luZGV4ID0gQGdldERyb3BUYXJnZXRJbmRleChldmVudClcbiAgICBAY2xlYXJEcm9wVGFyZ2V0KClcblxuICAgIGlmIHRhYkV2ZW50XG4gICAgICBmcm9tSW5kZXggPSBwYXJzZUludChkYXRhVHJhbnNmZXIuZ2V0RGF0YSgnc29ydGFibGUtaW5kZXgnKSlcbiAgICAgIHBhbmVJbmRleCA9IHBhcnNlSW50KGRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXBhbmUtaW5kZXgnKSlcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpW3BhbmVJbmRleF1cbiAgICAgIHZpZXcgPSBwYW5lLml0ZW1BdEluZGV4KGZyb21JbmRleClcbiAgICAgIHBhbmUucmVtb3ZlSXRlbSh2aWV3LCBmYWxzZSlcbiAgICAgIHZpZXcuc2hvdygpXG5cbiAgICAgIHZpZXcudG9nZ2xlVGFiVmlldygpXG4gICAgICBAdGVybWluYWxWaWV3cy5wdXNoIHZpZXdcbiAgICAgIHZpZXcub3BlbigpIGlmIHZpZXcuc3RhdHVzSWNvbi5pc0FjdGl2ZSgpXG4gICAgICBAc3RhdHVzQ29udGFpbmVyLmFwcGVuZCB2aWV3LnN0YXR1c0ljb25cbiAgICAgIGZyb21JbmRleCA9IEB0ZXJtaW5hbFZpZXdzLmxlbmd0aCAtIDFcbiAgICBlbHNlXG4gICAgICBmcm9tSW5kZXggPSBwYXJzZUludChkYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS1pbmRleCcpKVxuICAgIEB1cGRhdGVPcmRlcihmcm9tSW5kZXgsIHRvSW5kZXgpXG5cbiAgb25Ecm9wVGFiQmFyOiAoZXZlbnQsIHBhbmUpID0+XG4gICAge2RhdGFUcmFuc2Zlcn0gPSBldmVudC5vcmlnaW5hbEV2ZW50XG4gICAgcmV0dXJuIHVubGVzcyBkYXRhVHJhbnNmZXIuZ2V0RGF0YSgncGxhdGZvcm1pby1pZGUtdGVybWluYWwtcGFuZWwnKSBpcyAndHJ1ZSdcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gICAgZnJvbUluZGV4ID0gcGFyc2VJbnQoZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20taW5kZXgnKSlcbiAgICB2aWV3ID0gQHRlcm1pbmFsVmlld3NbZnJvbUluZGV4XVxuICAgIHZpZXcuY3NzIFwiaGVpZ2h0XCIsIFwiXCJcbiAgICB2aWV3LnRlcm1pbmFsLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCJcIlxuICAgIHRhYkJhciA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcudGFiLWJhcicpXG5cbiAgICB2aWV3LnRvZ2dsZVRhYlZpZXcoKVxuICAgIEByZW1vdmVUZXJtaW5hbFZpZXcgdmlld1xuICAgIEBzdGF0dXNDb250YWluZXIuY2hpbGRyZW4oKS5lcShmcm9tSW5kZXgpLmRldGFjaCgpXG4gICAgdmlldy5zdGF0dXNJY29uLnJlbW92ZVRvb2x0aXAoKVxuXG4gICAgcGFuZS5hZGRJdGVtIHZpZXcsIHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGhcbiAgICBwYW5lLmFjdGl2YXRlSXRlbSB2aWV3XG5cbiAgICB2aWV3LmZvY3VzKClcblxuICBjbGVhckRyb3BUYXJnZXQ6IC0+XG4gICAgZWxlbWVudCA9IEBmaW5kKCcuaXMtZHJhZ2dpbmcnKVxuICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MgJ2lzLWRyYWdnaW5nJ1xuICAgIEByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlcygpXG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlczogLT5cbiAgICBAc3RhdHVzQ29udGFpbmVyLmZpbmQoJy5pcy1kcm9wLXRhcmdldCcpLnJlbW92ZUNsYXNzICdpcy1kcm9wLXRhcmdldCdcbiAgICBAc3RhdHVzQ29udGFpbmVyLmZpbmQoJy5kcm9wLXRhcmdldC1pcy1hZnRlcicpLnJlbW92ZUNsYXNzICdkcm9wLXRhcmdldC1pcy1hZnRlcidcblxuICBnZXREcm9wVGFyZ2V0SW5kZXg6IChldmVudCkgLT5cbiAgICB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldClcbiAgICByZXR1cm4gaWYgQGlzUGxhY2Vob2xkZXIodGFyZ2V0KVxuXG4gICAgc3RhdHVzSWNvbnMgPSBAc3RhdHVzQ29udGFpbmVyLmNoaWxkcmVuKCcucGlvLXRlcm1pbmFsLXN0YXR1cy1pY29uJylcbiAgICBlbGVtZW50ID0gdGFyZ2V0LmNsb3Nlc3QoJy5waW8tdGVybWluYWwtc3RhdHVzLWljb24nKVxuICAgIGVsZW1lbnQgPSBzdGF0dXNJY29ucy5sYXN0KCkgaWYgZWxlbWVudC5sZW5ndGggaXMgMFxuXG4gICAgcmV0dXJuIDAgdW5sZXNzIGVsZW1lbnQubGVuZ3RoXG5cbiAgICBlbGVtZW50Q2VudGVyID0gZWxlbWVudC5vZmZzZXQoKS5sZWZ0ICsgZWxlbWVudC53aWR0aCgpIC8gMlxuXG4gICAgaWYgZXZlbnQub3JpZ2luYWxFdmVudC5wYWdlWCA8IGVsZW1lbnRDZW50ZXJcbiAgICAgIHN0YXR1c0ljb25zLmluZGV4KGVsZW1lbnQpXG4gICAgZWxzZSBpZiBlbGVtZW50Lm5leHQoJy5waW8tdGVybWluYWwtc3RhdHVzLWljb24nKS5sZW5ndGggPiAwXG4gICAgICBzdGF0dXNJY29ucy5pbmRleChlbGVtZW50Lm5leHQoJy5waW8tdGVybWluYWwtc3RhdHVzLWljb24nKSlcbiAgICBlbHNlXG4gICAgICBzdGF0dXNJY29ucy5pbmRleChlbGVtZW50KSArIDFcblxuICBnZXRQbGFjZWhvbGRlcjogLT5cbiAgICBAcGxhY2Vob2xkZXJFbCA/PSAkKCc8bGkgY2xhc3M9XCJwbGFjZWhvbGRlclwiPjwvbGk+JylcblxuICByZW1vdmVQbGFjZWhvbGRlcjogLT5cbiAgICBAcGxhY2Vob2xkZXJFbD8ucmVtb3ZlKClcbiAgICBAcGxhY2Vob2xkZXJFbCA9IG51bGxcblxuICBpc1BsYWNlaG9sZGVyOiAoZWxlbWVudCkgLT5cbiAgICBlbGVtZW50LmlzKCcucGxhY2Vob2xkZXInKVxuXG4gIGljb25BdEluZGV4OiAoaW5kZXgpIC0+XG4gICAgQGdldFN0YXR1c0ljb25zKCkuZXEoaW5kZXgpXG5cbiAgZ2V0U3RhdHVzSWNvbnM6IC0+XG4gICAgQHN0YXR1c0NvbnRhaW5lci5jaGlsZHJlbignLnBpby10ZXJtaW5hbC1zdGF0dXMtaWNvbicpXG5cbiAgbW92ZUljb25Ub0luZGV4OiAoaWNvbiwgdG9JbmRleCkgLT5cbiAgICBmb2xsb3dpbmdJY29uID0gQGdldFN0YXR1c0ljb25zKClbdG9JbmRleF1cbiAgICBjb250YWluZXIgPSBAc3RhdHVzQ29udGFpbmVyWzBdXG4gICAgaWYgZm9sbG93aW5nSWNvbj9cbiAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoaWNvbiwgZm9sbG93aW5nSWNvbilcbiAgICBlbHNlXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWNvbilcblxuICBtb3ZlVGVybWluYWxWaWV3OiAoZnJvbUluZGV4LCB0b0luZGV4KSA9PlxuICAgIGFjdGl2ZVRlcm1pbmFsID0gQGdldEFjdGl2ZVRlcm1pbmFsVmlldygpXG4gICAgdmlldyA9IEB0ZXJtaW5hbFZpZXdzLnNwbGljZShmcm9tSW5kZXgsIDEpWzBdXG4gICAgQHRlcm1pbmFsVmlld3Muc3BsaWNlIHRvSW5kZXgsIDAsIHZpZXdcbiAgICBAc2V0QWN0aXZlVGVybWluYWxWaWV3IGFjdGl2ZVRlcm1pbmFsXG5cbiAgdXBkYXRlT3JkZXI6IChmcm9tSW5kZXgsIHRvSW5kZXgpIC0+XG4gICAgcmV0dXJuIGlmIGZyb21JbmRleCBpcyB0b0luZGV4XG4gICAgdG9JbmRleC0tIGlmIGZyb21JbmRleCA8IHRvSW5kZXhcblxuICAgIGljb24gPSBAZ2V0U3RhdHVzSWNvbnMoKS5lcShmcm9tSW5kZXgpLmRldGFjaCgpXG4gICAgQG1vdmVJY29uVG9JbmRleCBpY29uLmdldCgwKSwgdG9JbmRleFxuICAgIEBtb3ZlVGVybWluYWxWaWV3IGZyb21JbmRleCwgdG9JbmRleFxuICAgIGljb24uYWRkQ2xhc3MgJ2luc2VydGVkJ1xuICAgIGljb24ub25lICd3ZWJraXRBbmltYXRpb25FbmQnLCAtPiBpY29uLnJlbW92ZUNsYXNzKCdpbnNlcnRlZCcpXG4iXX0=
