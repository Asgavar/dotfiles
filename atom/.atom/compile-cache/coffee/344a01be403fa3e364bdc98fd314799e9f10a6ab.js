(function() {
  var CliStatusView, CommandOutputView, View, domify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  domify = require('domify');

  CommandOutputView = require('./command-output-view');

  module.exports = CliStatusView = (function(superClass) {
    extend(CliStatusView, superClass);

    function CliStatusView() {
      return CliStatusView.__super__.constructor.apply(this, arguments);
    }

    CliStatusView.content = function() {
      return this.div({
        "class": 'cli-status inline-block'
      }, (function(_this) {
        return function() {
          _this.span({
            outlet: 'termStatusContainer'
          }, function() {});
          return _this.span({
            click: 'newTermClick',
            "class": "cli-status icon icon-plus"
          });
        };
      })(this));
    };

    CliStatusView.prototype.commandViews = [];

    CliStatusView.prototype.activeIndex = 0;

    CliStatusView.prototype.initialize = function(serializeState) {
      atom.commands.add('atom-workspace', {
        'terminal-status:new': (function(_this) {
          return function() {
            return _this.newTermClick();
          };
        })(this),
        'terminal-status:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-status:next': (function(_this) {
          return function() {
            return _this.activeNextCommandView();
          };
        })(this),
        'terminal-status:prev': (function(_this) {
          return function() {
            return _this.activePrevCommandView();
          };
        })(this)
      });
      this.createCommandView();
      return this.attach();
    };

    CliStatusView.prototype.createCommandView = function() {
      var commandOutputView, termStatus;
      termStatus = domify('<span class="cli-status icon icon-terminal"></span>');
      commandOutputView = new CommandOutputView;
      commandOutputView.statusIcon = termStatus;
      commandOutputView.statusView = this;
      this.commandViews.push(commandOutputView);
      termStatus.addEventListener('click', (function(_this) {
        return function() {
          return commandOutputView.toggle();
        };
      })(this));
      this.termStatusContainer.append(termStatus);
      return commandOutputView;
    };

    CliStatusView.prototype.activeNextCommandView = function() {
      return this.activeCommandView(this.activeIndex + 1);
    };

    CliStatusView.prototype.activePrevCommandView = function() {
      return this.activeCommandView(this.activeIndex - 1);
    };

    CliStatusView.prototype.activeCommandView = function(index) {
      if (index >= this.commandViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.commandViews.length - 1;
      }
      return this.commandViews[index] && this.commandViews[index].open();
    };

    CliStatusView.prototype.setActiveCommandView = function(commandView) {
      return this.activeIndex = this.commandViews.indexOf(commandView);
    };

    CliStatusView.prototype.removeCommandView = function(commandView) {
      var index;
      index = this.commandViews.indexOf(commandView);
      return index >= 0 && this.commandViews.splice(index, 1);
    };

    CliStatusView.prototype.newTermClick = function() {
      return this.createCommandView().toggle();
    };

    CliStatusView.prototype.attach = function(statusBar) {
      statusBar = document.querySelector("status-bar");
      if (statusBar != null) {
        return this.statusBarTile = statusBar.addLeftTile({
          item: this,
          priority: 100
        });
      }
    };

    CliStatusView.prototype.destroy = function() {
      var i, index, ref;
      for (index = i = ref = this.commandViews.length; ref <= 0 ? i <= 0 : i >= 0; index = ref <= 0 ? ++i : --i) {
        this.removeCommandView(this.commandViews[index]);
      }
      return this.detach();
    };

    CliStatusView.prototype.toggle = function() {
      if (this.commandViews[this.activeIndex]) {
        return this.commandViews[this.activeIndex].toggle();
      } else {
        return this.newTermClick();
      }
    };

    return CliStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXNnYXZhci9kb3RmaWxlcy9hdG9tLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9saWIvY2xpLXN0YXR1cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7O0VBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVI7O0VBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUNULGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUFQO09BQUwsRUFBdUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3JDLEtBQUMsQ0FBQSxJQUFELENBQU07WUFBQSxNQUFBLEVBQVEscUJBQVI7V0FBTixFQUFxQyxTQUFBLEdBQUEsQ0FBckM7aUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtZQUFBLEtBQUEsRUFBTyxjQUFQO1lBQXVCLENBQUEsS0FBQSxDQUFBLEVBQU8sMkJBQTlCO1dBQU47UUFGcUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDO0lBRFE7OzRCQUtWLFlBQUEsR0FBYzs7NEJBQ2QsV0FBQSxHQUFhOzs0QkFDYixVQUFBLEdBQVksU0FBQyxjQUFEO01BRVYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNJO1FBQUEscUJBQUEsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO1FBQ0Esd0JBQUEsRUFBMEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxL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QSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBSE87OzRCQUtULE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsWUFBYSxDQUFBLElBQUMsQ0FBQSxXQUFELENBQWpCO2VBQ0UsSUFBQyxDQUFBLFlBQWEsQ0FBQSxJQUFDLENBQUEsV0FBRCxDQUFhLENBQUMsTUFBNUIsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxZQUFELENBQUEsRUFIRjs7SUFETTs7OztLQW5Fa0I7QUFMNUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmRvbWlmeSA9IHJlcXVpcmUgJ2RvbWlmeSdcbkNvbW1hbmRPdXRwdXRWaWV3ID0gcmVxdWlyZSAnLi9jb21tYW5kLW91dHB1dC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDbGlTdGF0dXNWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAnY2xpLXN0YXR1cyBpbmxpbmUtYmxvY2snLCA9PlxuICAgICAgQHNwYW4gb3V0bGV0OiAndGVybVN0YXR1c0NvbnRhaW5lcicsID0+XG4gICAgICBAc3BhbiBjbGljazogJ25ld1Rlcm1DbGljaycsIGNsYXNzOiBcImNsaS1zdGF0dXMgaWNvbiBpY29uLXBsdXNcIlxuXG4gIGNvbW1hbmRWaWV3czogW11cbiAgYWN0aXZlSW5kZXg6IDBcbiAgaW5pdGlhbGl6ZTogKHNlcmlhbGl6ZVN0YXRlKSAtPlxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgJ3Rlcm1pbmFsLXN0YXR1czpuZXcnOiA9PiBAbmV3VGVybUNsaWNrKClcbiAgICAgICAgJ3Rlcm1pbmFsLXN0YXR1czp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcbiAgICAgICAgJ3Rlcm1pbmFsLXN0YXR1czpuZXh0JzogPT4gQGFjdGl2ZU5leHRDb21tYW5kVmlldygpXG4gICAgICAgICd0ZXJtaW5hbC1zdGF0dXM6cHJldic6ID0+IEBhY3RpdmVQcmV2Q29tbWFuZFZpZXcoKVxuXG4gICAgQGNyZWF0ZUNvbW1hbmRWaWV3KClcbiAgICBAYXR0YWNoKClcblxuICBjcmVhdGVDb21tYW5kVmlldzogKCktPlxuICAgIHRlcm1TdGF0dXMgPSBkb21pZnkgJzxzcGFuIGNsYXNzPVwiY2xpLXN0YXR1cyBpY29uIGljb24tdGVybWluYWxcIj48L3NwYW4+J1xuICAgIGNvbW1hbmRPdXRwdXRWaWV3ID0gbmV3IENvbW1hbmRPdXRwdXRWaWV3XG4gICAgY29tbWFuZE91dHB1dFZpZXcuc3RhdHVzSWNvbiA9IHRlcm1TdGF0dXNcbiAgICBjb21tYW5kT3V0cHV0Vmlldy5zdGF0dXNWaWV3ID0gdGhpc1xuICAgIEBjb21tYW5kVmlld3MucHVzaCBjb21tYW5kT3V0cHV0Vmlld1xuICAgIHRlcm1TdGF0dXMuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAoKSA9PlxuICAgICAgY29tbWFuZE91dHB1dFZpZXcudG9nZ2xlKClcbiAgICBAdGVybVN0YXR1c0NvbnRhaW5lci5hcHBlbmQgdGVybVN0YXR1c1xuICAgIHJldHVybiBjb21tYW5kT3V0cHV0Vmlld1xuXG4gIGFjdGl2ZU5leHRDb21tYW5kVmlldzogKCktPlxuICAgIEBhY3RpdmVDb21tYW5kVmlldyBAYWN0aXZlSW5kZXggKyAxXG5cbiAgYWN0aXZlUHJldkNvbW1hbmRWaWV3OiAoKS0+XG4gICAgQGFjdGl2ZUNvbW1hbmRWaWV3IEBhY3RpdmVJbmRleCAtIDFcblxuICBhY3RpdmVDb21tYW5kVmlldzogKGluZGV4KSAtPlxuICAgIGlmIGluZGV4ID49IEBjb21tYW5kVmlld3MubGVuZ3RoXG4gICAgICBpbmRleCA9IDBcbiAgICBpZiBpbmRleCA8IDBcbiAgICAgIGluZGV4ID0gQGNvbW1hbmRWaWV3cy5sZW5ndGggLSAxXG4gICAgQGNvbW1hbmRWaWV3c1tpbmRleF0gYW5kIEBjb21tYW5kVmlld3NbaW5kZXhdLm9wZW4oKVxuXG4gIHNldEFjdGl2ZUNvbW1hbmRWaWV3OiAoY29tbWFuZFZpZXcpIC0+XG4gICAgQGFjdGl2ZUluZGV4ID0gQGNvbW1hbmRWaWV3cy5pbmRleE9mIGNvbW1hbmRWaWV3XG5cbiAgcmVtb3ZlQ29tbWFuZFZpZXc6IChjb21tYW5kVmlldykgLT5cbiAgICBpbmRleCA9IEBjb21tYW5kVmlld3MuaW5kZXhPZiBjb21tYW5kVmlld1xuICAgIGluZGV4ID49MCBhbmQgQGNvbW1hbmRWaWV3cy5zcGxpY2UgaW5kZXgsIDFcblxuICBuZXdUZXJtQ2xpY2s6ICgpLT5cbiAgICBAY3JlYXRlQ29tbWFuZFZpZXcoKS50b2dnbGUoKVxuXG4gIGF0dGFjaDogKHN0YXR1c0JhcikgLT5cbiAgICBzdGF0dXNCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic3RhdHVzLWJhclwiKVxuICAgIGlmIHN0YXR1c0Jhcj9cbiAgICAgIEBzdGF0dXNCYXJUaWxlID0gc3RhdHVzQmFyLmFkZExlZnRUaWxlKGl0ZW06IHRoaXMsIHByaW9yaXR5OiAxMDApXG5cbiAgIyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNhbiBiZSByZXRyaWV2ZWQgd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZFxuICAjIHNlcmlhbGl6ZTogLT5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIGZvciBpbmRleCBpbiBbQGNvbW1hbmRWaWV3cy5sZW5ndGggLi4gMF1cbiAgICAgIEByZW1vdmVDb21tYW5kVmlldyBAY29tbWFuZFZpZXdzW2luZGV4XVxuICAgIEBkZXRhY2goKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAY29tbWFuZFZpZXdzW0BhY3RpdmVJbmRleF1cbiAgICAgIEBjb21tYW5kVmlld3NbQGFjdGl2ZUluZGV4XS50b2dnbGUoKVxuICAgIGVsc2VcbiAgICAgIEBuZXdUZXJtQ2xpY2soKVxuIl19
