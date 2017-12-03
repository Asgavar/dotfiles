(function() {
  var CommandOutputView, TextEditorView, View, addClass, ansihtml, exec, fs, lastOpenedView, readline, ref, ref1, removeClass, resolve, spawn,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  View = require('atom-space-pen-views').View;

  ref = require('child_process'), spawn = ref.spawn, exec = ref.exec;

  ansihtml = require('ansi-html-stream');

  readline = require('readline');

  ref1 = require('domutil'), addClass = ref1.addClass, removeClass = ref1.removeClass;

  resolve = require('path').resolve;

  fs = require('fs');

  lastOpenedView = null;

  module.exports = CommandOutputView = (function(superClass) {
    extend(CommandOutputView, superClass);

    function CommandOutputView() {
      this.flashIconClass = bind(this.flashIconClass, this);
      return CommandOutputView.__super__.constructor.apply(this, arguments);
    }

    CommandOutputView.prototype.cwd = null;

    CommandOutputView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'panel cli-status panel-bottom'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'killBtn',
                click: 'kill',
                "class": 'btn hide'
              }, function() {
                return _this.span('kill');
              });
              _this.button({
                click: 'destroy',
                "class": 'btn'
              }, function() {
                return _this.span('destroy');
              });
              return _this.button({
                click: 'close',
                "class": 'btn'
              }, function() {
                _this.span({
                  "class": "icon icon-x"
                });
                return _this.span('close');
              });
            });
          });
          return _this.div({
            "class": 'cli-panel-body'
          }, function() {
            _this.pre({
              "class": "terminal",
              outlet: "cliOutput"
            }, "Welcome to terminal status. http://github.com/guileen/terminal-status");
            return _this.subview('cmdEditor', new TextEditorView({
              mini: true,
              placeholderText: 'input your command here'
            }));
          });
        };
      })(this));
    };

    CommandOutputView.prototype.initialize = function() {
      var assigned, cmd, command, fn, j, len;
      this.userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      assigned = false;
      cmd = [['test -e /etc/profile && source /etc/profile', 'test -e ~/.profile && source ~/.profile', ['node -pe "JSON.stringify(process.env)"', 'nodejs -pe "JSON.stringify(process.env)"', 'iojs -pe "JSON.stringify(process.env)"'].join("||")].join(";"), 'node -pe "JSON.stringify(process.env)"', 'nodejs -pe "JSON.stringify(process.env)"', 'iojs -pe "JSON.stringify(process.env)"'];
      fn = function(command) {
        if (!assigned) {
          return exec(command, function(code, stdout, stderr) {
            if (!assigned && !stderr) {
              try {
                process.env = JSON.parse(stdout);
                return assigned = true;
              } catch (error) {
                return console.log(command + " couldn't be loaded");
              }
            }
          });
        }
      };
      for (j = 0, len = cmd.length; j < len; j++) {
        command = cmd[j];
        fn(command);
      }
      atom.commands.add('atom-workspace', "cli-status:toggle-output", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      return atom.commands.add('atom-workspace', "core:confirm", (function(_this) {
        return function() {
          return _this.readLine();
        };
      })(this));
    };

    CommandOutputView.prototype.readLine = function() {
      var args, cmd, inputCmd;
      inputCmd = this.cmdEditor.getModel().getText();
      this.cliOutput.append("\n$>" + inputCmd + "\n");
      this.scrollToBottom();
      args = [];
      inputCmd.replace(/("[^"]*"|'[^']*'|[^\s'"]+)/g, (function(_this) {
        return function(s) {
          if (s[0] !== '"' && s[0] !== "'") {
            s = s.replace(/~/g, _this.userHome);
          }
          return args.push(s);
        };
      })(this));
      cmd = args.shift();
      if (cmd === 'cd') {
        return this.cd(args);
      }
      if (cmd === 'ls') {
        return this.ls(args);
      }
      return this.spawn(inputCmd, cmd, args);
    };

    CommandOutputView.prototype.adjustWindowHeight = function() {
      var maxHeight;
      maxHeight = atom.config.get('terminal-status.WindowHeight');
      return this.cliOutput.css("max-height", maxHeight + "px");
    };

    CommandOutputView.prototype.showCmd = function() {
      this.cmdEditor.show();
      this.cmdEditor.getModel().selectAll();
      this.cmdEditor.focus();
      return this.scrollToBottom();
    };

    CommandOutputView.prototype.scrollToBottom = function() {
      return this.cliOutput.scrollTop(10000000);
    };

    CommandOutputView.prototype.flashIconClass = function(className, time) {
      var onStatusOut;
      if (time == null) {
        time = 100;
      }
      console.log('addClass', className);
      addClass(this.statusIcon, className);
      this.timer && clearTimeout(this.timer);
      onStatusOut = (function(_this) {
        return function() {
          return removeClass(_this.statusIcon, className);
        };
      })(this);
      return this.timer = setTimeout(onStatusOut, time);
    };

    CommandOutputView.prototype.destroy = function() {
      var _destroy;
      _destroy = (function(_this) {
        return function() {
          if (_this.hasParent()) {
            _this.close();
          }
          if (_this.statusIcon && _this.statusIcon.parentNode) {
            _this.statusIcon.parentNode.removeChild(_this.statusIcon);
          }
          return _this.statusView.removeCommandView(_this);
        };
      })(this);
      if (this.program) {
        this.program.once('exit', _destroy);
        return this.program.kill();
      } else {
        return _destroy();
      }
    };

    CommandOutputView.prototype.kill = function() {
      if (this.program) {
        return this.program.kill();
      }
    };

    CommandOutputView.prototype.open = function() {
      this.lastLocation = atom.workspace.getActivePane();
      if (!this.hasParent()) {
        atom.workspace.addBottomPanel({
          item: this
        });
      }
      if (lastOpenedView && lastOpenedView !== this) {
        lastOpenedView.close();
      }
      lastOpenedView = this;
      this.scrollToBottom();
      this.statusView.setActiveCommandView(this);
      return this.cmdEditor.focus();
    };

    CommandOutputView.prototype.close = function() {
      this.lastLocation.activate();
      this.detach();
      return lastOpenedView = null;
    };

    CommandOutputView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    CommandOutputView.prototype.cd = function(args) {
      var dir;
      if (!args[0]) {
        args = [this.getCwd()];
      }
      dir = resolve(this.getCwd(), args[0]);
      return fs.stat(dir, (function(_this) {
        return function(err, stat) {
          if (err) {
            if (err.code === 'ENOENT') {
              return _this.errorMessage("cd: " + args[0] + ": No such file or directory");
            }
            return _this.errorMessage(err.message);
          }
          if (!stat.isDirectory()) {
            return _this.errorMessage("cd: not a directory: " + args[0]);
          }
          _this.cwd = dir;
          return _this.message("cwd: " + _this.cwd);
        };
      })(this));
    };

    CommandOutputView.prototype.ls = function(args) {
      var files, filesBlocks;
      files = fs.readdirSync(this.getCwd());
      filesBlocks = [];
      files.forEach((function(_this) {
        return function(filename) {
          try {
            return filesBlocks.push(_this._fileInfoHtml(filename, _this.getCwd()));
          } catch (error) {
            return console.log(filename + " couln't be read");
          }
        };
      })(this));
      filesBlocks = filesBlocks.sort(function(a, b) {
        var aDir, bDir;
        aDir = a[1].isDirectory();
        bDir = b[1].isDirectory();
        if (aDir && !bDir) {
          return -1;
        }
        if (!aDir && bDir) {
          return 1;
        }
        return a[2] > b[2] && 1 || -1;
      });
      filesBlocks = filesBlocks.map(function(b) {
        return b[0];
      });
      return this.message(filesBlocks.join('') + '<div class="clear"/>');
    };

    CommandOutputView.prototype._fileInfoHtml = function(filename, parent) {
      var classes, filepath, stat;
      classes = ['icon', 'file-info'];
      filepath = parent + '/' + filename;
      stat = fs.lstatSync(filepath);
      if (stat.isSymbolicLink()) {
        classes.push('stat-link');
        stat = fs.statSync(filepath);
      }
      if (stat.isFile()) {
        if (stat.mode & 73) {
          classes.push('stat-program');
        }
        classes.push('icon-file-text');
      }
      if (stat.isDirectory()) {
        classes.push('icon-file-directory');
      }
      if (stat.isCharacterDevice()) {
        classes.push('stat-char-dev');
      }
      if (stat.isFIFO()) {
        classes.push('stat-fifo');
      }
      if (stat.isSocket()) {
        classes.push('stat-sock');
      }
      if (filename[0] === '.') {
        classes.push('status-ignored');
      }
      return ["<span class=\"" + (classes.join(' ')) + "\">" + filename + "</span>", stat, filename];
    };

    CommandOutputView.prototype.getGitStatusName = function(path, gitRoot, repo) {
      var status;
      status = (repo.getCachedPathStatus || repo.getPathStatus)(path);
      console.log('path status', path, status);
      if (status) {
        if (repo.isStatusModified(status)) {
          return 'modified';
        }
        if (repo.isStatusNew(status)) {
          return 'added';
        }
      }
      if (repo.isPathIgnore(path)) {
        return 'ignored';
      }
    };

    CommandOutputView.prototype.message = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-error');
      return addClass(this.statusIcon, 'status-success');
    };

    CommandOutputView.prototype.errorMessage = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-success');
      return addClass(this.statusIcon, 'status-error');
    };

    CommandOutputView.prototype.getCwd = function() {
      var activeRootDir, editor, i, j, ref2, rootDirs;
      editor = atom.workspace.getActiveTextEditor();
      rootDirs = atom.project.rootDirectories;
      activeRootDir = 0;
      for (i = j = 0, ref2 = rootDirs.length; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
        if (editor && rootDirs[i] && rootDirs[i].contains(editor.getPath())) {
          activeRootDir = i;
        }
      }
      if (rootDirs.length === 0) {
        rootDirs = false;
      }
      this.cwd = this.cwd || (rootDirs[activeRootDir] && rootDirs[activeRootDir].path) || this.userHome;
      return this.cwd;
    };

    CommandOutputView.prototype.spawn = function(inputCmd, cmd, args) {
      var err, htmlStream;
      this.cmdEditor.hide();
      htmlStream = ansihtml();
      htmlStream.on('data', (function(_this) {
        return function(data) {
          _this.cliOutput.append(data);
          return _this.scrollToBottom();
        };
      })(this));
      try {
        this.program = exec(inputCmd, {
          stdio: 'pipe',
          env: process.env,
          cwd: this.getCwd()
        });
        this.program.stdout.pipe(htmlStream);
        this.program.stderr.pipe(htmlStream);
        removeClass(this.statusIcon, 'status-success');
        removeClass(this.statusIcon, 'status-error');
        addClass(this.statusIcon, 'status-running');
        this.killBtn.removeClass('hide');
        this.program.once('exit', (function(_this) {
          return function(code) {
            console.log('exit', code);
            _this.killBtn.addClass('hide');
            removeClass(_this.statusIcon, 'status-running');
            _this.program = null;
            addClass(_this.statusIcon, code === 0 && 'status-success' || 'status-error');
            return _this.showCmd();
          };
        })(this));
        this.program.on('error', (function(_this) {
          return function(err) {
            console.log('error');
            _this.cliOutput.append(err.message);
            _this.showCmd();
            return addClass(_this.statusIcon, 'status-error');
          };
        })(this));
        this.program.stdout.on('data', (function(_this) {
          return function() {
            _this.flashIconClass('status-info');
            return removeClass(_this.statusIcon, 'status-error');
          };
        })(this));
        return this.program.stderr.on('data', (function(_this) {
          return function() {
            console.log('stderr');
            return _this.flashIconClass('status-error', 300);
          };
        })(this));
      } catch (error) {
        err = error;
        this.cliOutput.append(err.message);
        return this.showCmd();
      }
    };

    return CommandOutputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXNnYXZhci9kb3RmaWxlcy9hdG9tLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9saWIvY29tbWFuZC1vdXRwdXQtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVJQUFBO0lBQUE7Ozs7RUFBQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSOztFQUNsQixPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFDVCxNQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixFQUFDLGlCQUFELEVBQVE7O0VBQ1IsUUFBQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUjs7RUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBQ1gsT0FBMEIsT0FBQSxDQUFRLFNBQVIsQ0FBMUIsRUFBQyx3QkFBRCxFQUFXOztFQUNWLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBQ1osRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLGNBQUEsR0FBaUI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7O2dDQUNKLEdBQUEsR0FBSzs7SUFDTCxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLFFBQUEsRUFBVSxDQUFDLENBQVg7UUFBYyxDQUFBLEtBQUEsQ0FBQSxFQUFPLCtCQUFyQjtPQUFMLEVBQTJELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUN6RCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFQO1dBQUwsRUFBNkIsU0FBQTttQkFDM0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDthQUFMLEVBQXlCLFNBQUE7Y0FDdkIsS0FBQyxDQUFBLE1BQUQsQ0FBUTtnQkFBQSxNQUFBLEVBQVEsU0FBUjtnQkFBbUIsS0FBQSxFQUFPLE1BQTFC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QUFBLGFBQUE7UUE2Qk07UUFDSixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLE9BQXRCO2VBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQS9CRjs7SUFOSzs7OztLQXhPdUI7QUFaaEMiLCJzb3VyY2VzQ29udGVudCI6WyJ7VGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG57Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntzcGF3biwgZXhlY30gPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuYW5zaWh0bWwgPSByZXF1aXJlICdhbnNpLWh0bWwtc3RyZWFtJ1xucmVhZGxpbmUgPSByZXF1aXJlICdyZWFkbGluZSdcbnthZGRDbGFzcywgcmVtb3ZlQ2xhc3N9ID0gcmVxdWlyZSAnZG9tdXRpbCdcbntyZXNvbHZlfSA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuXG5sYXN0T3BlbmVkVmlldyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29tbWFuZE91dHB1dFZpZXcgZXh0ZW5kcyBWaWV3XG4gIGN3ZDogbnVsbFxuICBAY29udGVudDogLT5cbiAgICBAZGl2IHRhYkluZGV4OiAtMSwgY2xhc3M6ICdwYW5lbCBjbGktc3RhdHVzIHBhbmVsLWJvdHRvbScsID0+XG4gICAgICBAZGl2IGNsYXNzOiAncGFuZWwtaGVhZGluZycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAna2lsbEJ0bicsIGNsaWNrOiAna2lsbCcsIGNsYXNzOiAnYnRuIGhpZGUnLCA9PlxuICAgICAgICAgICAgIyBAc3BhbiBjbGFzczogXCJpY29uIGljb24teFwiXG4gICAgICAgICAgICBAc3BhbiAna2lsbCdcbiAgICAgICAgICBAYnV0dG9uIGNsaWNrOiAnZGVzdHJveScsIGNsYXNzOiAnYnRuJywgPT5cbiAgICAgICAgICAgICMgQHNwYW4gY2xhc3M6IFwiaWNvbiBpY29uLXhcIlxuICAgICAgICAgICAgQHNwYW4gJ2Rlc3Ryb3knXG4gICAgICAgICAgQGJ1dHRvbiBjbGljazogJ2Nsb3NlJywgY2xhc3M6ICdidG4nLCA9PlxuICAgICAgICAgICAgQHNwYW4gY2xhc3M6IFwiaWNvbiBpY29uLXhcIlxuICAgICAgICAgICAgQHNwYW4gJ2Nsb3NlJ1xuICAgICAgQGRpdiBjbGFzczogJ2NsaS1wYW5lbC1ib2R5JywgPT5cbiAgICAgICAgQHByZSBjbGFzczogXCJ0ZXJtaW5hbFwiLCBvdXRsZXQ6IFwiY2xpT3V0cHV0XCIsXG4gICAgICAgICAgXCJXZWxjb21lIHRvIHRlcm1pbmFsIHN0YXR1cy4gaHR0cDovL2dpdGh1Yi5jb20vZ3VpbGVlbi90ZXJtaW5hbC1zdGF0dXNcIlxuICAgICAgICBAc3VidmlldyAnY21kRWRpdG9yJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ2lucHV0IHlvdXIgY29tbWFuZCBoZXJlJylcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEB1c2VySG9tZSA9IHByb2Nlc3MuZW52LkhPTUUgb3IgcHJvY2Vzcy5lbnYuSE9NRVBBVEggb3IgcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEU7XG5cbiAgICBhc3NpZ25lZCA9IGZhbHNlXG5cbiAgICBjbWQgPSBbXG4gICAgICAgIFtcbiAgICAgICAgICAgICd0ZXN0IC1lIC9ldGMvcHJvZmlsZSAmJiBzb3VyY2UgL2V0Yy9wcm9maWxlJyxcbiAgICAgICAgICAgICd0ZXN0IC1lIH4vLnByb2ZpbGUgJiYgc291cmNlIH4vLnByb2ZpbGUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdub2RlIC1wZSBcIkpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KVwiJyxcbiAgICAgICAgICAgICAgICAnbm9kZWpzIC1wZSBcIkpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KVwiJyxcbiAgICAgICAgICAgICAgICAnaW9qcyAtcGUgXCJKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudilcIidcbiAgICAgICAgICAgIF0uam9pbihcInx8XCIpXG4gICAgICAgIF0uam9pbihcIjtcIiksXG4gICAgICAgICdub2RlIC1wZSBcIkpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KVwiJyxcbiAgICAgICAgJ25vZGVqcyAtcGUgXCJKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudilcIicsXG4gICAgICAgICdpb2pzIC1wZSBcIkpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KVwiJ1xuICAgIF1cblxuICAgIGZvciBjb21tYW5kIGluIGNtZFxuICAgICAgZG8oY29tbWFuZCkgLT5cbiAgICAgICAgaWYgbm90IGFzc2lnbmVkXG4gICAgICAgICAgZXhlYyBjb21tYW5kLCAoY29kZSwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICAgICAgICBpZiBub3QgYXNzaWduZWQgYW5kIG5vdCBzdGRlcnJcbiAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYgPSBKU09OLnBhcnNlKHN0ZG91dClcbiAgICAgICAgICAgICAgICBhc3NpZ25lZCA9IHRydWVcbiAgICAgICAgICAgICAgY2F0Y2hcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBcIiN7Y29tbWFuZH0gY291bGRuJ3QgYmUgbG9hZGVkXCJcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsIFwiY2xpLXN0YXR1czp0b2dnbGUtb3V0cHV0XCIsID0+IEB0b2dnbGUoKVxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsIFwiY29yZTpjb25maXJtXCIsID0+IEByZWFkTGluZSgpXG5cbiAgcmVhZExpbmU6IC0+XG4gICAgaW5wdXRDbWQgPSBAY21kRWRpdG9yLmdldE1vZGVsKCkuZ2V0VGV4dCgpXG5cbiAgICBAY2xpT3V0cHV0LmFwcGVuZCBcIlxcbiQ+I3tpbnB1dENtZH1cXG5cIlxuICAgIEBzY3JvbGxUb0JvdHRvbSgpXG4gICAgYXJncyA9IFtdXG4gICAgIyBzdXBwb3J0ICdhIGIgYycgYW5kIFwiZm9vIGJhclwiXG4gICAgaW5wdXRDbWQucmVwbGFjZSAvKFwiW15cIl0qXCJ8J1teJ10qJ3xbXlxccydcIl0rKS9nLCAocykgPT5cbiAgICAgIGlmIHNbMF0gIT0gJ1wiJyBhbmQgc1swXSAhPSBcIidcIlxuICAgICAgICBzID0gcy5yZXBsYWNlIC9+L2csIEB1c2VySG9tZVxuICAgICAgYXJncy5wdXNoIHNcbiAgICBjbWQgPSBhcmdzLnNoaWZ0KClcbiAgICBpZiBjbWQgPT0gJ2NkJ1xuICAgICAgcmV0dXJuIEBjZCBhcmdzXG4gICAgaWYgY21kID09ICdscydcbiAgICAgIHJldHVybiBAbHMgYXJnc1xuICAgIEBzcGF3biBpbnB1dENtZCwgY21kLCBhcmdzXG5cbiAgYWRqdXN0V2luZG93SGVpZ2h0OiAtPlxuICAgIG1heEhlaWdodCA9IGF0b20uY29uZmlnLmdldCgndGVybWluYWwtc3RhdHVzLldpbmRvd0hlaWdodCcpXG4gICAgQGNsaU91dHB1dC5jc3MoXCJtYXgtaGVpZ2h0XCIsIFwiI3ttYXhIZWlnaHR9cHhcIilcblxuICBzaG93Q21kOiAtPlxuICAgIEBjbWRFZGl0b3Iuc2hvdygpXG4gICAgQGNtZEVkaXRvci5nZXRNb2RlbCgpLnNlbGVjdEFsbCgpXG4gICAgQGNtZEVkaXRvci5mb2N1cygpXG4gICAgQHNjcm9sbFRvQm90dG9tKClcblxuICBzY3JvbGxUb0JvdHRvbTogLT5cbiAgICBAY2xpT3V0cHV0LnNjcm9sbFRvcCAxMDAwMDAwMFxuXG4gIGZsYXNoSWNvbkNsYXNzOiAoY2xhc3NOYW1lLCB0aW1lPTEwMCk9PlxuICAgIGNvbnNvbGUubG9nICdhZGRDbGFzcycsIGNsYXNzTmFtZVxuICAgIGFkZENsYXNzIEBzdGF0dXNJY29uLCBjbGFzc05hbWVcbiAgICBAdGltZXIgYW5kIGNsZWFyVGltZW91dChAdGltZXIpXG4gICAgb25TdGF0dXNPdXQgPSA9PlxuICAgICAgcmVtb3ZlQ2xhc3MgQHN0YXR1c0ljb24sIGNsYXNzTmFtZVxuICAgIEB0aW1lciA9IHNldFRpbWVvdXQgb25TdGF0dXNPdXQsIHRpbWVcblxuICBkZXN0cm95OiAtPlxuICAgIF9kZXN0cm95ID0gPT5cbiAgICAgIGlmIEBoYXNQYXJlbnQoKVxuICAgICAgICBAY2xvc2UoKVxuICAgICAgaWYgQHN0YXR1c0ljb24gYW5kIEBzdGF0dXNJY29uLnBhcmVudE5vZGVcbiAgICAgICAgQHN0YXR1c0ljb24ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChAc3RhdHVzSWNvbilcbiAgICAgIEBzdGF0dXNWaWV3LnJlbW92ZUNvbW1hbmRWaWV3IHRoaXNcbiAgICBpZiBAcHJvZ3JhbVxuICAgICAgQHByb2dyYW0ub25jZSAnZXhpdCcsIF9kZXN0cm95XG4gICAgICBAcHJvZ3JhbS5raWxsKClcbiAgICBlbHNlXG4gICAgICBfZGVzdHJveSgpXG5cbiAga2lsbDogLT5cbiAgICBpZiBAcHJvZ3JhbVxuICAgICAgQHByb2dyYW0ua2lsbCgpXG5cbiAgb3BlbjogLT5cbiAgICBAbGFzdExvY2F0aW9uID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbChpdGVtOiB0aGlzKSB1bmxlc3MgQGhhc1BhcmVudCgpXG5cbiAgICBpZiBsYXN0T3BlbmVkVmlldyBhbmQgbGFzdE9wZW5lZFZpZXcgIT0gdGhpc1xuICAgICAgbGFzdE9wZW5lZFZpZXcuY2xvc2UoKVxuICAgIGxhc3RPcGVuZWRWaWV3ID0gdGhpc1xuICAgIEBzY3JvbGxUb0JvdHRvbSgpXG4gICAgQHN0YXR1c1ZpZXcuc2V0QWN0aXZlQ29tbWFuZFZpZXcgdGhpc1xuICAgIEBjbWRFZGl0b3IuZm9jdXMoKVxuXG4gIGNsb3NlOiAtPlxuICAgIEBsYXN0TG9jYXRpb24uYWN0aXZhdGUoKVxuICAgIEBkZXRhY2goKVxuICAgIGxhc3RPcGVuZWRWaWV3ID0gbnVsbFxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAaGFzUGFyZW50KClcbiAgICAgIEBjbG9zZSgpXG4gICAgZWxzZVxuICAgICAgQG9wZW4oKVxuXG4gIGNkOiAoYXJncyktPlxuICAgIGFyZ3MgPSBbQGdldEN3ZCgpXSBpZiBub3QgYXJnc1swXVxuICAgIGRpciA9IHJlc29sdmUgQGdldEN3ZCgpLCBhcmdzWzBdXG4gICAgZnMuc3RhdCBkaXIsIChlcnIsIHN0YXQpID0+XG4gICAgICBpZiBlcnJcbiAgICAgICAgaWYgZXJyLmNvZGUgPT0gJ0VOT0VOVCdcbiAgICAgICAgICByZXR1cm4gQGVycm9yTWVzc2FnZSBcImNkOiAje2FyZ3NbMF19OiBObyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5XCJcbiAgICAgICAgcmV0dXJuIEBlcnJvck1lc3NhZ2UgZXJyLm1lc3NhZ2VcbiAgICAgIGlmIG5vdCBzdGF0LmlzRGlyZWN0b3J5KClcbiAgICAgICAgcmV0dXJuIEBlcnJvck1lc3NhZ2UgXCJjZDogbm90IGEgZGlyZWN0b3J5OiAje2FyZ3NbMF19XCJcbiAgICAgIEBjd2QgPSBkaXJcbiAgICAgIEBtZXNzYWdlIFwiY3dkOiAje0Bjd2R9XCJcblxuICBsczogKGFyZ3MpLT5cbiAgICBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jIEBnZXRDd2QoKVxuICAgIGZpbGVzQmxvY2tzID0gW11cbiAgICBmaWxlcy5mb3JFYWNoIChmaWxlbmFtZSkgPT5cbiAgICAgIHRyeVxuICAgICAgICBmaWxlc0Jsb2Nrcy5wdXNoIEBfZmlsZUluZm9IdG1sKGZpbGVuYW1lLCBAZ2V0Q3dkKCkpXG4gICAgICBjYXRjaFxuICAgICAgICBjb25zb2xlLmxvZyBcIiN7ZmlsZW5hbWV9IGNvdWxuJ3QgYmUgcmVhZFwiXG4gICAgZmlsZXNCbG9ja3MgPSBmaWxlc0Jsb2Nrcy5zb3J0IChhLCBiKS0+XG4gICAgICBhRGlyID0gYVsxXS5pc0RpcmVjdG9yeSgpXG4gICAgICBiRGlyID0gYlsxXS5pc0RpcmVjdG9yeSgpXG4gICAgICBpZiBhRGlyIGFuZCBub3QgYkRpclxuICAgICAgICByZXR1cm4gLTFcbiAgICAgIGlmIG5vdCBhRGlyIGFuZCBiRGlyXG4gICAgICAgIHJldHVybiAxXG4gICAgICBhWzJdID4gYlsyXSBhbmQgMSBvciAtMVxuICAgIGZpbGVzQmxvY2tzID0gZmlsZXNCbG9ja3MubWFwIChiKSAtPlxuICAgICAgYlswXVxuICAgIEBtZXNzYWdlIGZpbGVzQmxvY2tzLmpvaW4oJycpICsgJzxkaXYgY2xhc3M9XCJjbGVhclwiLz4nXG5cbiAgX2ZpbGVJbmZvSHRtbDogKGZpbGVuYW1lLCBwYXJlbnQpLT5cbiAgICBjbGFzc2VzID0gWydpY29uJywgJ2ZpbGUtaW5mbyddXG4gICAgZmlsZXBhdGggPSBwYXJlbnQgKyAnLycgKyBmaWxlbmFtZVxuICAgIHN0YXQgPSBmcy5sc3RhdFN5bmMgZmlsZXBhdGhcbiAgICBpZiBzdGF0LmlzU3ltYm9saWNMaW5rKClcbiAgICAgICMgY2xhc3Nlcy5wdXNoICdpY29uLWZpbGUtc3ltbGluay1maWxlJ1xuICAgICAgY2xhc3Nlcy5wdXNoICdzdGF0LWxpbmsnXG4gICAgICBzdGF0ID0gZnMuc3RhdFN5bmMgZmlsZXBhdGhcbiAgICBpZiBzdGF0LmlzRmlsZSgpXG4gICAgICBpZiBzdGF0Lm1vZGUgJiA3MyAjMDExMVxuICAgICAgICBjbGFzc2VzLnB1c2ggJ3N0YXQtcHJvZ3JhbSdcbiAgICAgICMgVE9ETyBjaGVjayBleHRlbnNpb25cbiAgICAgIGNsYXNzZXMucHVzaCAnaWNvbi1maWxlLXRleHQnXG4gICAgaWYgc3RhdC5pc0RpcmVjdG9yeSgpXG4gICAgICBjbGFzc2VzLnB1c2ggJ2ljb24tZmlsZS1kaXJlY3RvcnknXG4gICAgaWYgc3RhdC5pc0NoYXJhY3RlckRldmljZSgpXG4gICAgICBjbGFzc2VzLnB1c2ggJ3N0YXQtY2hhci1kZXYnXG4gICAgaWYgc3RhdC5pc0ZJRk8oKVxuICAgICAgY2xhc3Nlcy5wdXNoICdzdGF0LWZpZm8nXG4gICAgaWYgc3RhdC5pc1NvY2tldCgpXG4gICAgICBjbGFzc2VzLnB1c2ggJ3N0YXQtc29jaydcbiAgICBpZiBmaWxlbmFtZVswXSA9PSAnLidcbiAgICAgIGNsYXNzZXMucHVzaCAnc3RhdHVzLWlnbm9yZWQnXG4gICAgIyBpZiBzdGF0dXNOYW1lID0gQGdldEdpdFN0YXR1c05hbWUgZmlsZXBhdGhcbiAgICAjICAgY2xhc3Nlcy5wdXNoIHN0YXR1c05hbWVcbiAgICAjIG90aGVyIHN0YXQgaW5mb1xuICAgIFtcIjxzcGFuIGNsYXNzPVxcXCIje2NsYXNzZXMuam9pbiAnICd9XFxcIj4je2ZpbGVuYW1lfTwvc3Bhbj5cIiwgc3RhdCwgZmlsZW5hbWVdXG5cbiAgZ2V0R2l0U3RhdHVzTmFtZTogKHBhdGgsIGdpdFJvb3QsIHJlcG8pIC0+XG4gICAgc3RhdHVzID0gKHJlcG8uZ2V0Q2FjaGVkUGF0aFN0YXR1cyBvciByZXBvLmdldFBhdGhTdGF0dXMpKHBhdGgpXG4gICAgY29uc29sZS5sb2cgJ3BhdGggc3RhdHVzJywgcGF0aCwgc3RhdHVzXG4gICAgaWYgc3RhdHVzXG4gICAgICBpZiByZXBvLmlzU3RhdHVzTW9kaWZpZWQgc3RhdHVzXG4gICAgICAgIHJldHVybiAnbW9kaWZpZWQnXG4gICAgICBpZiByZXBvLmlzU3RhdHVzTmV3IHN0YXR1c1xuICAgICAgICByZXR1cm4gJ2FkZGVkJ1xuICAgIGlmIHJlcG8uaXNQYXRoSWdub3JlIHBhdGhcbiAgICAgIHJldHVybiAnaWdub3JlZCdcblxuICBtZXNzYWdlOiAobWVzc2FnZSkgLT5cbiAgICBAY2xpT3V0cHV0LmFwcGVuZCBtZXNzYWdlXG4gICAgQHNob3dDbWQoKVxuICAgIHJlbW92ZUNsYXNzIEBzdGF0dXNJY29uLCAnc3RhdHVzLWVycm9yJ1xuICAgIGFkZENsYXNzIEBzdGF0dXNJY29uLCAnc3RhdHVzLXN1Y2Nlc3MnXG5cbiAgZXJyb3JNZXNzYWdlOiAobWVzc2FnZSkgLT5cbiAgICBAY2xpT3V0cHV0LmFwcGVuZCBtZXNzYWdlXG4gICAgQHNob3dDbWQoKVxuICAgIHJlbW92ZUNsYXNzIEBzdGF0dXNJY29uLCAnc3RhdHVzLXN1Y2Nlc3MnXG4gICAgYWRkQ2xhc3MgQHN0YXR1c0ljb24sICdzdGF0dXMtZXJyb3InXG5cbiAgZ2V0Q3dkOiAoKS0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcm9vdERpcnMgPSBhdG9tLnByb2plY3Qucm9vdERpcmVjdG9yaWVzXG4gICAgYWN0aXZlUm9vdERpciA9IDA7XG4gICAgZm9yIGkgaW4gWzAuLnJvb3REaXJzLmxlbmd0aF1cbiAgICAgIGlmIGVkaXRvciBhbmQgcm9vdERpcnNbaV0gYW5kIHJvb3REaXJzW2ldLmNvbnRhaW5zKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICAgIGFjdGl2ZVJvb3REaXIgPSBpXG5cbiAgICBpZiByb290RGlycy5sZW5ndGggPT0gMFxuICAgICAgcm9vdERpcnMgPSBmYWxzZVxuXG4gICAgQGN3ZCA9IEBjd2Qgb3IgKHJvb3REaXJzW2FjdGl2ZVJvb3REaXJdIGFuZCByb290RGlyc1thY3RpdmVSb290RGlyXS5wYXRoKSBvciBAdXNlckhvbWVcblxuICAgIEBjd2RcblxuICBzcGF3bjogKGlucHV0Q21kLCBjbWQsIGFyZ3MpIC0+XG4gICAgQGNtZEVkaXRvci5oaWRlKClcbiAgICBodG1sU3RyZWFtID0gYW5zaWh0bWwoKVxuICAgIGh0bWxTdHJlYW0ub24gJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICAgIEBjbGlPdXRwdXQuYXBwZW5kIGRhdGFcbiAgICAgIEBzY3JvbGxUb0JvdHRvbSgpXG4gICAgdHJ5XG4gICAgICAjIEBwcm9ncmFtID0gc3Bhd24gY21kLCBhcmdzLCBzdGRpbzogJ3BpcGUnLCBlbnY6IHByb2Nlc3MuZW52LCBjd2Q6IEBnZXRDd2QoKVxuICAgICAgQHByb2dyYW0gPSBleGVjIGlucHV0Q21kLCBzdGRpbzogJ3BpcGUnLCBlbnY6IHByb2Nlc3MuZW52LCBjd2Q6IEBnZXRDd2QoKVxuICAgICAgQHByb2dyYW0uc3Rkb3V0LnBpcGUgaHRtbFN0cmVhbVxuICAgICAgQHByb2dyYW0uc3RkZXJyLnBpcGUgaHRtbFN0cmVhbVxuICAgICAgcmVtb3ZlQ2xhc3MgQHN0YXR1c0ljb24sICdzdGF0dXMtc3VjY2VzcydcbiAgICAgIHJlbW92ZUNsYXNzIEBzdGF0dXNJY29uLCAnc3RhdHVzLWVycm9yJ1xuICAgICAgYWRkQ2xhc3MgQHN0YXR1c0ljb24sICdzdGF0dXMtcnVubmluZydcbiAgICAgIEBraWxsQnRuLnJlbW92ZUNsYXNzICdoaWRlJ1xuICAgICAgQHByb2dyYW0ub25jZSAnZXhpdCcsIChjb2RlKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyAnZXhpdCcsIGNvZGVcbiAgICAgICAgQGtpbGxCdG4uYWRkQ2xhc3MgJ2hpZGUnXG4gICAgICAgIHJlbW92ZUNsYXNzIEBzdGF0dXNJY29uLCAnc3RhdHVzLXJ1bm5pbmcnXG4gICAgICAgICMgcmVtb3ZlQ2xhc3MgQHN0YXR1c0ljb24sICdzdGF0dXMtZXJyb3InXG4gICAgICAgIEBwcm9ncmFtID0gbnVsbFxuICAgICAgICBhZGRDbGFzcyBAc3RhdHVzSWNvbiwgY29kZSA9PSAwIGFuZCAnc3RhdHVzLXN1Y2Nlc3MnIG9yICdzdGF0dXMtZXJyb3InXG4gICAgICAgIEBzaG93Q21kKClcbiAgICAgIEBwcm9ncmFtLm9uICdlcnJvcicsIChlcnIpID0+XG4gICAgICAgIGNvbnNvbGUubG9nICdlcnJvcidcbiAgICAgICAgQGNsaU91dHB1dC5hcHBlbmQgZXJyLm1lc3NhZ2VcbiAgICAgICAgQHNob3dDbWQoKVxuICAgICAgICBhZGRDbGFzcyBAc3RhdHVzSWNvbiwgJ3N0YXR1cy1lcnJvcidcbiAgICAgIEBwcm9ncmFtLnN0ZG91dC5vbiAnZGF0YScsICgpID0+XG4gICAgICAgIEBmbGFzaEljb25DbGFzcyAnc3RhdHVzLWluZm8nXG4gICAgICAgIHJlbW92ZUNsYXNzIEBzdGF0dXNJY29uLCAnc3RhdHVzLWVycm9yJ1xuICAgICAgQHByb2dyYW0uc3RkZXJyLm9uICdkYXRhJywgKCkgPT5cbiAgICAgICAgY29uc29sZS5sb2cgJ3N0ZGVycidcbiAgICAgICAgQGZsYXNoSWNvbkNsYXNzICdzdGF0dXMtZXJyb3InLCAzMDBcblxuICAgIGNhdGNoIGVyclxuICAgICAgQGNsaU91dHB1dC5hcHBlbmQgZXJyLm1lc3NhZ2VcbiAgICAgIEBzaG93Q21kKClcbiJdfQ==
