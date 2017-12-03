(function() {
  var CliStatusView;

  CliStatusView = require('./cli-status-view');

  module.exports = {
    cliStatusView: null,
    activate: function(state) {
      var createStatusEntry;
      createStatusEntry = (function(_this) {
        return function() {
          return _this.cliStatusView = new CliStatusView(state.cliStatusViewState);
        };
      })(this);
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return createStatusEntry();
        };
      })(this));
    },
    deactivate: function() {
      return this.cliStatusView.destroy();
    },
    config: {
      WindowHeight: {
        type: 'integer',
        "default": 300
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXNnYXZhci9kb3RmaWxlcy9hdG9tLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9saWIvY2xpLXN0YXR1cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSOztFQUVoQixNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ04sVUFBQTtNQUFBLGlCQUFBLEdBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDaEIsS0FBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQWMsS0FBSyxDQUFDLGtCQUFwQjtRQURMO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUVwQixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUFkLENBQTJDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxpQkFBQSxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDO0lBSE0sQ0FGVjtJQU9BLFVBQUEsRUFBWSxTQUFBO2FBQ1IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFEUSxDQVBaO0lBVUEsTUFBQSxFQUNJO01BQUEsWUFBQSxFQUNJO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEdBRFQ7T0FESjtLQVhKOztBQUhKIiwic291cmNlc0NvbnRlbnQiOlsiQ2xpU3RhdHVzVmlldyA9IHJlcXVpcmUgJy4vY2xpLXN0YXR1cy12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgY2xpU3RhdHVzVmlldzogbnVsbFxuXG4gICAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAgICAgY3JlYXRlU3RhdHVzRW50cnkgPSA9PlxuICAgICAgICAgICAgQGNsaVN0YXR1c1ZpZXcgPSBuZXcgQ2xpU3RhdHVzVmlldyhzdGF0ZS5jbGlTdGF0dXNWaWV3U3RhdGUpXG4gICAgICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyA9PiBjcmVhdGVTdGF0dXNFbnRyeSgpXG5cbiAgICBkZWFjdGl2YXRlOiAtPlxuICAgICAgICBAY2xpU3RhdHVzVmlldy5kZXN0cm95KClcblxuICAgIGNvbmZpZzpcbiAgICAgICAgV2luZG93SGVpZ2h0OlxuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgICAgICBkZWZhdWx0OiAzMDBcbiJdfQ==
