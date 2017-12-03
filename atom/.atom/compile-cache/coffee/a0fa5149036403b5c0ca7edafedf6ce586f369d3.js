(function() {
  var $, CompositeDisposable, RailroadDiagramElement, Regex2RailRoadDiagram, TextEditor, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = require('atom-space-pen-views').$;

  Regex2RailRoadDiagram = require('./regex-to-railroad.coffee').Regex2RailRoadDiagram;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextEditor = ref.TextEditor;

  RailroadDiagramElement = (function(superClass) {
    extend(RailroadDiagramElement, superClass);

    function RailroadDiagramElement() {
      return RailroadDiagramElement.__super__.constructor.apply(this, arguments);
    }

    RailroadDiagramElement.prototype.createdCallback = function() {};

    RailroadDiagramElement.prototype.initialize = function(model) {
      this.model = model;
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
      this.classList.add("regex-railroad-diagram");
      this.currentRegex = null;
      this.subscriptions = null;
      this.createView();
      return this;
    };

    RailroadDiagramElement.prototype.createView = function() {
      var btnClick, changeDelay, displayName, grammar, i, j, len, len1, name, possibleGrammars, ref1;
      this.textEditor = new TextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        placeholderText: 'Type in your regex'
      });
      this.textEditorSubscriptions = new CompositeDisposable;
      this.is_visible = false;
      changeDelay = null;
      this.textEditorSubscriptions.add(this.textEditor.onDidChange((function(_this) {
        return function() {
          return _this.showRailRoadDiagram(_this.textEditor.getText(), _this.options);
        };
      })(this)));
      this.regexGrammars = {};
      ref1 = atom.grammars.getGrammars();
      for (i = 0, len = ref1.length; i < len; i++) {
        grammar = ref1[i];
        console.log("grammar", grammar.name);
        if (grammar.name.match(/.*reg.*ex/i)) {
          displayName = grammar.name;
          this.textEditor.setGrammar(grammar);
          this.regexGrammars[grammar.name] = grammar;
        }
      }
      possibleGrammars = ['Regular Expression Replacement (Javascript)', 'Regular Expressions (Javascript)', 'Regular Expressions (Python)'];
      for (j = 0, len1 = possibleGrammars.length; j < len1; j++) {
        name = possibleGrammars[j];
        if (indexOf.call(this.regexGrammars, name) >= 0) {
          this.textEditor.setGrammar(this.regexGrammars[name]);
          break;
        }
      }
      this.innerHTML = "<section class=\"section settings-view\">\n  <div class=\"texteditor-container\">\n  </div>\n  <div class=\"btn-group option-buttons\">\n    <button class=\"btn btn-multiline\">m</button>\n    <button class=\"btn btn-dotall\">s</button>\n  </div>\n</section>\n<div class=\"regex-railroad-view-container\">\n</div>";
      this.viewContainer = this.querySelector('.regex-railroad-view-container');
      this.options = null;
      this.multilineButton = this.querySelector('.btn-multiline');
      this.dotallButton = this.querySelector('.btn-dotall');
      btnClick = (function(_this) {
        return function(btnSelector, opt) {
          var btn;
          btn = _this.querySelector(btnSelector);
          if (indexOf.call(btn.classList, 'selected') >= 0) {
            btn.classList.remove('selected');
            _this.options.options = _this.options.options.replace(opt, '');
          } else {
            btn.classList.add('selected');
            _this.options.options = _this.options.options + opt;
          }
          return _this.showRailRoadDiagram(_this.textEditor.getText(), _this.options);
        };
      })(this);
      this.multilineButton.onclick = (function(_this) {
        return function() {
          return btnClick('.btn-multiline', 'm');
        };
      })(this);
      this.dotallButton.onclick = (function(_this) {
        return function() {
          return btnClick('.btn-dotall', 's');
        };
      })(this);
      this.textEditorView = atom.views.getView(this.textEditor);
      this.querySelector('.texteditor-container').appendChild(this.textEditorView);
      return this.textEditorSubscriptions.add(atom.commands.add(this.textEditor.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.confirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      }));
    };

    RailroadDiagramElement.prototype.focusTextEditor = function() {
      return this.textEditorView.focus();
    };

    RailroadDiagramElement.prototype.confirm = function() {
      var editor, i, len, selection, selections;
      editor = atom.workspace.getActiveTextEditor();
      selections = editor.getSelections();
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        editor.setTextInBufferRange(selection.getBufferRange(), this.textEditor.getText());
      }
      return atom.views.getView(atom.workspace).focus();
    };

    RailroadDiagramElement.prototype.cancel = function() {
      this.assertHidden();
      return atom.views.getView(atom.workspace).focus();
    };

    RailroadDiagramElement.prototype.isVisible = function() {
      return this.is_visible;
    };

    RailroadDiagramElement.prototype.setModel = function(model) {
      this.model = model;
    };

    RailroadDiagramElement.prototype.removeDiagram = function() {
      var child, i, len, ref1, ref2;
      ref1 = this.viewContainer.childNodes;
      for (i = 0, len = ref1.length; i < len; i++) {
        child = ref1[i];
        child.remove();
      }
      return (ref2 = this.subscriptions) != null ? ref2.dispose() : void 0;
    };

    RailroadDiagramElement.prototype.destroy = function() {
      var ref1;
      this.is_visible = false;
      this.removeDiagram();
      this.panel.remove();
      this.remove();
      return (ref1 = this.textEditorSubscriptions) != null ? ref1.dispose() : void 0;
    };

    RailroadDiagramElement.prototype.showDiagram = function(regex, options) {
      var ref1;
      if (this.currentRegex === regex && !this.hidden && options.options === ((ref1 = this.options) != null ? ref1.options : void 0)) {
        return;
      }
      this.is_visible = true;
      this.activeEditor = atom.workspace.getActiveTextEditor();
      this.options = options;
      this.textEditor.setText(regex);
      return this.panel.show();
    };

    RailroadDiagramElement.prototype.showRailRoadDiagram = function(regex, options) {
      var e, i, len, ref1;
      this.removeDiagram();
      this.subscriptions = new CompositeDisposable;
      try {
        Regex2RailRoadDiagram(regex, this.viewContainer, options);
        ref1 = $(this.viewContainer).find('g[title]');
        for (i = 0, len = ref1.length; i < len; i++) {
          e = ref1[i];
          this.subscriptions.add(atom.tooltips.add(e, {
            title: $(e).attr('title')
          }));
        }
        this.currentRegex = regex;
      } catch (error) {
        e = error;
        this.showError(regex, e);
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.activeEditor.scrollToCursorPosition();
        };
      })(this)), 200);
    };

    RailroadDiagramElement.prototype.showError = function(regex, e) {
      var sp;
      if (e.offset) {
        sp = " ".repeat(e.offset);
        return this.viewContainer.innerHTML = "<div class=\"error-message\"><pre class=\"text-error\">" + regex + "\n" + sp + "^ " + e.message + "</pre></div>";
      } else {
        return this.viewContainer.innerHTML = "<div class=\"error-message\"><pre>" + regex + "</pre><p class=\"text-error\">" + e.message + "</p></div>";
      }
    };

    RailroadDiagramElement.prototype.assertHidden = function() {
      var ref1;
      if (!this.hidden) {
        this.panel.hide();
      }
      this.currentRegex = null;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      return this.is_visible = false;
    };

    return RailroadDiagramElement;

  })(HTMLElement);

  module.exports = RailroadDiagramElement = document.registerElement('regex-railroad-diagram', {
    prototype: RailroadDiagramElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXNnYXZhci9kb3RmaWxlcy9hdG9tLy5hdG9tL3BhY2thZ2VzL3JlZ2V4LXJhaWxyb2FkLWRpYWdyYW0vbGliL3JhaWxyb2FkLWRpYWdyYW0tZWxlbWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNGQUFBO0lBQUE7Ozs7RUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUjs7RUFDTCx3QkFBeUIsT0FBQSxDQUFRLDRCQUFSOztFQUMxQixNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUdoQjs7Ozs7OztxQ0FDSixlQUFBLEdBQWlCLFNBQUEsR0FBQTs7cUNBRWpCLFVBQUEsR0FBWSxTQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsUUFBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO1FBQUEsSUFBQSxFQUFNLElBQU47UUFBWSxPQUFBLEVBQVMsS0FBckI7T0FBOUI7TUFDVCxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSx3QkFBZjtNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxVQUFELENBQUE7YUFDQTtJQU5VOztxQ0FRWixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FDaEI7UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUNBLFNBQUEsRUFBVyxDQURYO1FBRUEsUUFBQSxFQUFVLElBRlY7UUFHQSxXQUFBLEVBQWEsS0FIYjtRQUlBLGVBQUEsRUFBaUIsb0JBSmpCO09BRGdCO01BT2xCLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixJQUFJO01BRS9CLElBQUMsQ0FBQSxVQUFELEdBQWM7TUFFZCxXQUFBLEdBQWM7TUFDZCxJQUFD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QUFBOzthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFKRjs7OztLQXZLcUI7O0VBNktyQyxNQUFNLENBQUMsT0FBUCxHQUFpQixzQkFBQSxHQUF5QixRQUFRLENBQUMsZUFBVCxDQUF5Qix3QkFBekIsRUFBbUQ7SUFBQSxTQUFBLEVBQVcsc0JBQXNCLENBQUMsU0FBbEM7R0FBbkQ7QUFsTDFDIiwic291cmNlc0NvbnRlbnQiOlsieyR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG57UmVnZXgyUmFpbFJvYWREaWFncmFtfSA9IHJlcXVpcmUgJy4vcmVnZXgtdG8tcmFpbHJvYWQuY29mZmVlJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRFZGl0b3J9ID0gcmVxdWlyZSAnYXRvbSdcblxuXG5jbGFzcyBSYWlscm9hZERpYWdyYW1FbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbiAgY3JlYXRlZENhbGxiYWNrOiAtPlxuXG4gIGluaXRpYWxpemU6IChAbW9kZWwpIC0+XG4gICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwgaXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2VcbiAgICBAY2xhc3NMaXN0LmFkZCBcInJlZ2V4LXJhaWxyb2FkLWRpYWdyYW1cIlxuICAgIEBjdXJyZW50UmVnZXggPSBudWxsXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgQGNyZWF0ZVZpZXcoKVxuICAgIHRoaXNcblxuICBjcmVhdGVWaWV3OiAtPlxuICAgIEB0ZXh0RWRpdG9yID0gbmV3IFRleHRFZGl0b3JcbiAgICAgIG1pbmk6IHRydWVcbiAgICAgIHRhYkxlbmd0aDogMlxuICAgICAgc29mdFRhYnM6IHRydWVcbiAgICAgIHNvZnRXcmFwcGVkOiBmYWxzZVxuICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnVHlwZSBpbiB5b3VyIHJlZ2V4J1xuXG4gICAgQHRleHRFZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBpc192aXNpYmxlID0gZmFsc2VcblxuICAgIGNoYW5nZURlbGF5ID0gbnVsbFxuICAgIEB0ZXh0RWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgQHRleHRFZGl0b3Iub25EaWRDaGFuZ2UgPT5cbiAgICAgICMgVE9ETzogaWYgaW5zZXJ0ZWQgYSAoLCBhZGQgdGhlICkgKGFuZCBzbyBvbi4pXG5cbiAgICAgIEBzaG93UmFpbFJvYWREaWFncmFtIEB0ZXh0RWRpdG9yLmdldFRleHQoKSwgQG9wdGlvbnNcblxuXG4gICAgICAjICMgd2l0aCBhIGxpdHRsZSBkZWxheSwgd2UgZG8gbm90IGdldCBmbGlja2VyaW5nIGlmIHBlcnNvbiB0eXBlcyBmYXN0XG4gICAgICAjIGlmIGNoYW5nZURlbGF5XG4gICAgICAjICAgY2xlYXJUaW1lb3V0KGNoYW5nZURlbGF5KVxuICAgICAgIyAgIGNoYW5nZURlbGF5ID0gbnVsbFxuICAgICAgI1xuICAgICAgIyBjaGFuZ2VEZWxheSA9IHNldFRpbWVvdXQoXG4gICAgICAjICAgKD0+IEBzaG93UmFpbFJvYWREaWFncmFtIEB0ZXh0RWRpdG9yLmdldFRleHQoKSwgQG9wdGlvbnMpLFxuICAgICAgIyAgIDMwMClcblxuICAgIEByZWdleEdyYW1tYXJzID0ge31cbiAgICBmb3IgZ3JhbW1hciBpbiBhdG9tLmdyYW1tYXJzLmdldEdyYW1tYXJzKClcbiAgICAgIGNvbnNvbGUubG9nIFwiZ3JhbW1hclwiLCBncmFtbWFyLm5hbWVcbiAgICAgIGlmIGdyYW1tYXIubmFtZS5tYXRjaCAvLipyZWcuKmV4L2lcbiAgICAgICAgZGlzcGxheU5hbWUgPSBncmFtbWFyLm5hbWVcbiAgICAgICAgQHRleHRFZGl0b3Iuc2V0R3JhbW1hcihncmFtbWFyKVxuICAgICAgICAjaWYgbSA9IGdyYW1tYXIubmFtZS5tYXRjaCAvXFwoKC4qKVxcKS9cbiAgICAgICAgIyAgZGlzcGxheU5hbWUgPSBtWzFdXG4gICAgICAgIEByZWdleEdyYW1tYXJzW2dyYW1tYXIubmFtZV0gPSBncmFtbWFyXG5cbiAgICBwb3NzaWJsZUdyYW1tYXJzID0gW1xuICAgICAgJ1JlZ3VsYXIgRXhwcmVzc2lvbiBSZXBsYWNlbWVudCAoSmF2YXNjcmlwdCknXG4gICAgICAnUmVndWxhciBFeHByZXNzaW9ucyAoSmF2YXNjcmlwdCknXG4gICAgICAnUmVndWxhciBFeHByZXNzaW9ucyAoUHl0aG9uKSdcbiAgICBdXG5cbiAgICBmb3IgbmFtZSBpbiBwb3NzaWJsZUdyYW1tYXJzXG4gICAgICBpZiBuYW1lIGluIEByZWdleEdyYW1tYXJzXG4gICAgICAgIEB0ZXh0RWRpdG9yLnNldEdyYW1tYXIoQHJlZ2V4R3JhbW1hcnNbbmFtZV0pXG4gICAgICAgIGJyZWFrXG5cbiAgICBAaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cInNlY3Rpb24gc2V0dGluZ3Mtdmlld1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dGVkaXRvci1jb250YWluZXJcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgb3B0aW9uLWJ1dHRvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1tdWx0aWxpbmVcIj5tPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZG90YWxsXCI+czwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJyZWdleC1yYWlscm9hZC12aWV3LWNvbnRhaW5lclwiPlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG5cbiAgICBAdmlld0NvbnRhaW5lciA9IEBxdWVyeVNlbGVjdG9yKCcucmVnZXgtcmFpbHJvYWQtdmlldy1jb250YWluZXInKVxuICAgIEBvcHRpb25zID0gbnVsbFxuXG4gICAgQG11bHRpbGluZUJ1dHRvbiA9IEBxdWVyeVNlbGVjdG9yKCcuYnRuLW11bHRpbGluZScpXG4gICAgQGRvdGFsbEJ1dHRvbiA9IEBxdWVyeVNlbGVjdG9yKCcuYnRuLWRvdGFsbCcpXG5cbiAgICBidG5DbGljayA9IChidG5TZWxlY3Rvciwgb3B0KSA9PlxuICAgICAgYnRuID0gQHF1ZXJ5U2VsZWN0b3IoYnRuU2VsZWN0b3IpXG4gICAgICBpZiAnc2VsZWN0ZWQnIGluIGJ0bi5jbGFzc0xpc3RcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUgJ3NlbGVjdGVkJ1xuICAgICAgICBAb3B0aW9ucy5vcHRpb25zID0gQG9wdGlvbnMub3B0aW9ucy5yZXBsYWNlIG9wdCwgJydcbiAgICAgIGVsc2VcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQgJ3NlbGVjdGVkJ1xuICAgICAgICBAb3B0aW9ucy5vcHRpb25zID0gQG9wdGlvbnMub3B0aW9ucyArIG9wdFxuXG4gICAgICBAc2hvd1JhaWxSb2FkRGlhZ3JhbSBAdGV4dEVkaXRvci5nZXRUZXh0KCksIEBvcHRpb25zXG5cbiAgICBAbXVsdGlsaW5lQnV0dG9uLm9uY2xpY2sgPSA9PlxuICAgICAgYnRuQ2xpY2sgJy5idG4tbXVsdGlsaW5lJywnbSdcblxuICAgIEBkb3RhbGxCdXR0b24ub25jbGljayA9ID0+XG4gICAgICBidG5DbGljayAnLmJ0bi1kb3RhbGwnLCdzJ1xuXG4gICAgQHRleHRFZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KEB0ZXh0RWRpdG9yKVxuXG4gICAgQHF1ZXJ5U2VsZWN0b3IoJy50ZXh0ZWRpdG9yLWNvbnRhaW5lcicpLmFwcGVuZENoaWxkIEB0ZXh0RWRpdG9yVmlld1xuXG4gICAgQHRleHRFZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAdGV4dEVkaXRvci5lbGVtZW50LFxuICAgICAgJ2NvcmU6Y29uZmlybSc6ID0+IEBjb25maXJtKClcbiAgICAgICdjb3JlOmNhbmNlbCc6ICA9PiBAY2FuY2VsKClcblxuICBmb2N1c1RleHRFZGl0b3I6IC0+XG4gICAgQHRleHRFZGl0b3JWaWV3LmZvY3VzKClcblxuICBjb25maXJtOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2Ugc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCksIEB0ZXh0RWRpdG9yLmdldFRleHQoKVxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuZm9jdXMoKVxuXG4gIGNhbmNlbDogLT5cbiAgICBAYXNzZXJ0SGlkZGVuKClcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmZvY3VzKClcblxuICBpc1Zpc2libGU6IC0+XG4gICAgQGlzX3Zpc2libGVcblxuICBzZXRNb2RlbDogKEBtb2RlbCkgLT5cblxuICByZW1vdmVEaWFncmFtOiAtPlxuICAgIGZvciBjaGlsZCBpbiBAdmlld0NvbnRhaW5lci5jaGlsZE5vZGVzXG4gICAgICBjaGlsZC5yZW1vdmUoKVxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBpc192aXNpYmxlID0gZmFsc2VcbiAgICBAcmVtb3ZlRGlhZ3JhbSgpXG4gICAgQHBhbmVsLnJlbW92ZSgpXG4gICAgQHJlbW92ZSgpXG4gICAgQHRleHRFZGl0b3JTdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBzaG93RGlhZ3JhbTogKHJlZ2V4LCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBpZiBAY3VycmVudFJlZ2V4IGlzIHJlZ2V4IGFuZCBub3QgQGhpZGRlbiBhbmQgb3B0aW9ucy5vcHRpb25zIGlzIEBvcHRpb25zPy5vcHRpb25zXG4gICAgQGlzX3Zpc2libGUgPSB0cnVlXG4gICAgQGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBvcHRpb25zID0gb3B0aW9uc1xuICAgIEB0ZXh0RWRpdG9yLnNldFRleHQocmVnZXgpXG4gICAgQHBhbmVsLnNob3coKVxuXG4gIHNob3dSYWlsUm9hZERpYWdyYW06IChyZWdleCwgb3B0aW9ucykgLT5cbiAgICBAcmVtb3ZlRGlhZ3JhbSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdHJ5XG4gICAgICBSZWdleDJSYWlsUm9hZERpYWdyYW0gcmVnZXgsIEB2aWV3Q29udGFpbmVyLCBvcHRpb25zXG5cbiAgICAgIGZvciBlIGluICQoQHZpZXdDb250YWluZXIpLmZpbmQoJ2dbdGl0bGVdJylcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20udG9vbHRpcHMuYWRkIGUsIHRpdGxlOiAkKGUpLmF0dHIoJ3RpdGxlJylcblxuICAgICAgQGN1cnJlbnRSZWdleCA9IHJlZ2V4XG4gICAgY2F0Y2ggZVxuICAgICAgQHNob3dFcnJvciByZWdleCwgZVxuXG4gICAgc2V0VGltZW91dCAoPT4gQGFjdGl2ZUVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKCkpLCAyMDBcblxuICBzaG93RXJyb3I6IChyZWdleCwgZSkgLT5cbiAgICAjY29uc29sZS5sb2cgXCJjYXVnaHQgZXJyb3Igd2hlbiB0cnlpbmcgdG8gZGlzcGxheSByZWdleCAje3JlZ2V4fVwiLCBlLnN0YWNrXG4gICAgaWYgZS5vZmZzZXRcbiAgICAgIHNwID0gXCIgXCIucmVwZWF0IGUub2Zmc2V0XG4gICAgICBAdmlld0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXCI8ZGl2IGNsYXNzPVwiZXJyb3ItbWVzc2FnZVwiPjxwcmUgY2xhc3M9XCJ0ZXh0LWVycm9yXCI+I3tyZWdleH1cXG4je3NwfV4gI3tlLm1lc3NhZ2V9PC9wcmU+PC9kaXY+XCJcIlwiXG4gICAgZWxzZVxuICAgICAgQHZpZXdDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlwiPGRpdiBjbGFzcz1cImVycm9yLW1lc3NhZ2VcIj48cHJlPiN7cmVnZXh9PC9wcmU+PHAgY2xhc3M9XCJ0ZXh0LWVycm9yXCI+I3tlLm1lc3NhZ2V9PC9wPjwvZGl2PlwiXCJcIlxuXG4gIGFzc2VydEhpZGRlbjogLT5cbiAgICBAcGFuZWwuaGlkZSgpIHVubGVzcyBAaGlkZGVuXG4gICAgQGN1cnJlbnRSZWdleCA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGlzX3Zpc2libGUgPSBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhaWxyb2FkRGlhZ3JhbUVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQgJ3JlZ2V4LXJhaWxyb2FkLWRpYWdyYW0nLCBwcm90b3R5cGU6IFJhaWxyb2FkRGlhZ3JhbUVsZW1lbnQucHJvdG90eXBlXG4iXX0=
