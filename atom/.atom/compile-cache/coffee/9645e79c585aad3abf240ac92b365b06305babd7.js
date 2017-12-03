(function() {
  var Choice, Comment, Diagram, Group, NonTerminal, OneOrMore, Optional, Sequence, Skip, Terminal, ZeroOrMore, doSpace, get_flag_name, makeLiteral, parse, parseRegex, quantifiedComment, ref, rx2rr;

  parse = require("regexp");

  ref = require('./railroad-diagrams'), Diagram = ref.Diagram, Sequence = ref.Sequence, Choice = ref.Choice, Optional = ref.Optional, OneOrMore = ref.OneOrMore, ZeroOrMore = ref.ZeroOrMore, Terminal = ref.Terminal, NonTerminal = ref.NonTerminal, Comment = ref.Comment, Skip = ref.Skip, Group = ref.Group;

  doSpace = function() {
    return NonTerminal("SP", {
      title: "Space character",
      "class": "literal whitespace"
    });
  };

  makeLiteral = function(text) {
    var j, len, part, parts, sequence;
    if (text === " ") {
      return doSpace();
    } else {
      parts = text.split(/(^ +| {2,}| +$)/);
      sequence = [];
      for (j = 0, len = parts.length; j < len; j++) {
        part = parts[j];
        if (!part.length) {
          continue;
        }
        if (/^ +$/.test(part)) {
          if (part.length === 1) {
            sequence.push(doSpace());
          } else {
            sequence.push(OneOrMore(doSpace(), Comment(part.length + "x", {
              title: "repeat " + part.length + " times"
            })));
          }
        } else {
          sequence.push(Terminal(part, {
            "class": "literal"
          }));
        }
      }
      if (sequence.length === 1) {
        return sequence[0];
      } else {
        return new Sequence(sequence);
      }
    }
  };

  get_flag_name = function(flag) {
    var flag_names;
    flag_names = {
      A: 'pcre:anchored',
      D: 'pcre:dollar-endonly',
      S: 'pcre:study',
      U: 'pcre:ungreedy',
      X: 'pcre:extra',
      J: 'pcre:extra',
      i: 'case-insensitive',
      m: 'multi-line',
      s: 'dotall',
      e: 'evaluate',
      o: 'compile-once',
      x: 'extended-legilibility',
      g: 'global',
      c: 'current-position',
      p: 'preserve',
      d: 'no-unicode-rules',
      u: 'unicode-rules',
      a: 'ascii-rules',
      l: 'current-locale'
    };
    if (flag in flag_names) {
      return flag_names[flag];
    } else {
      return "unknown:" + flag;
    }
  };

  rx2rr = function(node, options) {
    var _class, _text, _title, alternatives, body, char, charset, doEndOfString, doStartOfString, extra, f, flags, greedy, i, isSingleString, j, k, l, len, len1, len2, len3, list, literal, m, max, min, min_width, n, opts, plural, ref1, ref2, ref3, ref4, ref5, sequence, text, turn_off, turn_off_long, turn_on, turn_on_long, x;
    opts = options.options;
    isSingleString = function() {
      return opts.match(/s/);
    };
    doStartOfString = function() {
      var title;
      if (opts.match(/m/)) {
        title = "Beginning of line";
      } else {
        title = "Beginning of string";
      }
      return NonTerminal("START", {
        title: title,
        "class": 'zero-width-assertion'
      });
    };
    doEndOfString = function() {
      var title;
      if (opts.match(/m/)) {
        title = "End of line";
      } else {
        title = "End of string";
      }
      return NonTerminal("END", {
        title: title,
        "class": 'zero-width-assertion'
      });
    };
    switch (node.type) {
      case "match":
        literal = '';
        sequence = [];
        ref1 = node.body;
        for (j = 0, len = ref1.length; j < len; j++) {
          n = ref1[j];
          if (n.type === "literal" && n.escaped) {
            if (n.body === "A") {
              sequence.push(doStartOfString());
            } else if (n.body === "Z") {
              sequence.push(doEndOfString());
            } else {
              literal += n.body;
            }
          } else if (n.type === "literal") {
            literal += n.body;
          } else {
            if (literal) {
              sequence.push(makeLiteral(literal));
              literal = '';
            }
            sequence.push(rx2rr(n, options));
          }
        }
        if (literal) {
          sequence.push(makeLiteral(literal));
        }
        if (sequence.length === 1) {
          return sequence[0];
        } else {
          return new Sequence(sequence);
        }
        break;
      case "alternate":
        alternatives = [];
        while (node.type === "alternate") {
          alternatives.push(rx2rr(node.left, options));
          node = node.right;
        }
        alternatives.push(rx2rr(node, options));
        return new Choice(Math.floor(alternatives.length / 2) - 1, alternatives);
      case "quantified":
        ref2 = node.quantifier, min = ref2.min, max = ref2.max, greedy = ref2.greedy;
        body = rx2rr(node.body, options);
        if (!(min <= max)) {
          throw new Error("Minimum quantifier (" + min + ") must be lower than ", +("maximum quantifier (" + max + ")"));
        }
        plural = function(x) {
          if (x !== 1) {
            return "s";
          } else {
            return "";
          }
        };
        switch (min) {
          case 0:
            if (max === 1) {
              return Optional(body);
            } else {
              if (max === 0) {
                return ZeroOrMore(body, quantifiedComment("0x", greedy, {
                  title: "exact 0 times repitition does not make sense"
                }));
              } else if (max !== 2e308) {
                return ZeroOrMore(body, quantifiedComment("0-" + max + "x", greedy, {
                  title: ("repeat 0 to " + max + " time") + plural(max)
                }));
              } else {
                return ZeroOrMore(body, quantifiedComment("*", greedy, {
                  title: "repeat zero or more times"
                }));
              }
            }
            break;
          case 1:
            if (max === 1) {
              return OneOrMore(body, Comment("1", {
                title: "once"
              }));
            } else if (max !== 2e308) {
              return OneOrMore(body, quantifiedComment("1-" + max + "x", greedy, {
                title: "repeat 1 to " + max + " times"
              }));
            } else {
              return OneOrMore(body, quantifiedComment("+", greedy, {
                title: "repeat at least one time"
              }));
            }
            break;
          default:
            if (max === min) {
              return OneOrMore(body, Comment(max + "x", {
                title: "repeat " + max + " times"
              }));
            } else if (max !== 2e308) {
              return OneOrMore(body, quantifiedComment(min + "-" + max + "x", greedy, {
                title: "repeat " + min + " to " + max + " times"
              }));
            } else {
              return OneOrMore(body, quantifiedComment(">= " + min + "x", greedy, {
                title: ("repeat at least " + min + " time") + plural(min)
              }));
            }
        }
        break;
      case "capture-group":
        text = "capture " + node.index;
        min_width = 55;
        if (node.name) {
          text += " (" + node.name + ")";
          min_width = 55 + (node.name.split('').length + 3) * 7;
        }
        return Group(rx2rr(node.body, options), Comment(text, {
          "class": "caption"
        }), {
          minWidth: min_width,
          attrs: {
            "class": 'capture-group group'
          }
        });
      case "flags":
        turn_on_long = [];
        turn_off_long = [];
        console.log(node);
        flags = node.body.join('');
        ref3 = flags.split('-'), turn_on = ref3[0], turn_off = ref3[1];
        if (turn_on == null) {
          turn_on = '';
        }
        if (turn_off == null) {
          turn_off = '';
        }
        ref4 = turn_on.split('');
        for (k = 0, len1 = ref4.length; k < len1; k++) {
          f = ref4[k];
          turn_on_long.push(get_flag_name(f));
        }
        ref5 = turn_off.split('');
        for (l = 0, len2 = ref5.length; l < len2; l++) {
          f = ref5[l];
          if (f === 'i') {
            turn_on_long.push('case-sensitive');
          } else {
            turn_off_long.push(get_flag_name(f));
          }
        }
        _title = [];
        if (turn_on) {
          _title.push("Turn on: " + turn_on_long.join(', '));
        }
        if (turn_off) {
          _title.push("Turn off: " + turn_off_long.join(', '));
        }
        return NonTerminal("SET: " + node.body.join(''), {
          title: _title.join("\n"),
          "class": 'zero-width-assertion'
        });
      case "non-capture-group":
        return rx2rr(node.body, options);
      case "positive-lookahead":
        return Group(rx2rr(node.body, options), Comment("=> ?", {
          title: "Positive lookahead",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookahead positive zero-width-assertion group"
          }
        });
      case "negative-lookahead":
        return Group(rx2rr(node.body, options), Comment("!> ?", {
          title: "Negative lookahead",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookahead negative zero-width-assertion group"
          }
        });
      case "positive-lookbehind":
        return Group(rx2rr(node.body, options), Comment("<= ?", {
          title: "Positive lookbehind",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookbehind positive zero-width-assertion group"
          }
        });
      case "negative-lookbehind":
        return Group(rx2rr(node.body, options), Comment("<! ?", {
          title: "Negative lookbehind",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookbehind negative zero-width-assertion group"
          }
        });
      case "back-reference":
        return NonTerminal("" + node.code, {
          title: "Match capture " + node.code + " (Back Reference)",
          "class": 'back-reference'
        });
      case "literal":
        if (node.escaped) {
          if (node.body === "A") {
            return doStartOfString();
          } else if (node.body === "Z") {
            return doEndOfString();
          } else {
            return Terminal(node.body, {
              "class": "literal"
            });
          }
        } else {
          return makeLiteral(node.body);
        }
        break;
      case "start":
        return doStartOfString();
      case "end":
        return doEndOfString();
      case "word":
        return NonTerminal("WORD", {
          title: "Word character A-Z, 0-9, _",
          "class": 'character-class'
        });
      case "non-word":
        return NonTerminal("NON-WORD", {
          title: "Non-word character, all except A-Z, 0-9, _",
          "class": 'character-class invert'
        });
      case "line-feed":
        return NonTerminal("LF", {
          title: "Line feed '\\n'",
          "class": 'literal whitespace'
        });
      case "carriage-return":
        return NonTerminal("CR", {
          title: "Carriage Return '\\r'",
          "class": 'literal whitespace'
        });
      case "vertical-tab":
        return NonTerminal("VTAB", {
          title: "Vertical tab '\\v'",
          "class": 'literal whitespace'
        });
      case "tab":
        return NonTerminal("TAB", {
          title: "Tab stop '\\t'",
          "class": 'literal whitespace'
        });
      case "form-feed":
        return NonTerminal("FF", {
          title: "Form feed",
          "class": 'literal whitespace'
        });
      case "back-space":
        return NonTerminal("BS", {
          title: "Backspace",
          "class": 'literal'
        });
      case "digit":
        return NonTerminal("0-9", {
          "class": 'character-class'
        });
      case "null-character":
        return NonTerminal("NULL", {
          title: "Null character '\\0'",
          "class": 'literal'
        });
      case "non-digit":
        return NonTerminal("not 0-9", {
          title: "All except digits",
          "class": 'character-class invert'
        });
      case "white-space":
        return NonTerminal("WS", {
          title: "Whitespace: space, tabstop, linefeed, carriage-return, etc.",
          "class": 'character-class whitespace'
        });
      case "non-white-space":
        return NonTerminal("NON-WS", {
          title: "Not whitespace: all except space, tabstop, line-feed, carriage-return, etc.",
          "class": 'character-class invert'
        });
      case "range":
        return NonTerminal(node.text, {
          "class": "character-class"
        });
      case "charset":
        charset = (function() {
          var len3, m, ref6, results;
          ref6 = node.body;
          results = [];
          for (m = 0, len3 = ref6.length; m < len3; m++) {
            x = ref6[m];
            results.push(x.text);
          }
          return results;
        })();
        if (charset.length === 1) {
          char = charset[0];
          if (char === " ") {
            if (node.invert) {
              return doSpace();
            }
          }
          if (node.invert) {
            return NonTerminal("not " + char, {
              title: "Match all except " + char,
              "class": 'character-class invert'
            });
          } else {
            if (char === "SP") {
              return doSpace();
            } else {
              return Terminal(char, {
                "class": "literal"
              });
            }
          }
        } else {
          list = charset.slice(0, -1).join(", ");
          for (i = m = 0, len3 = list.length; m < len3; i = ++m) {
            x = list[i];
            if (x === " ") {
              list[i] = "SP";
            }
          }
          if (node.invert) {
            return NonTerminal("not " + list + " and " + charset.slice(-1), {
              "class": 'character-class invert'
            });
          } else {
            return NonTerminal(list + " or " + charset.slice(-1), {
              "class": 'character-class'
            });
          }
        }
        break;
      case "hex":
      case "octal":
      case "unicode":
        return Terminal(node.text, {
          "class": 'literal charachter-code'
        });
      case "unicode-category":
        _text = node.code;
        _class = 'unicode-category character-class';
        if (node.invert) {
          _class += ' invert';
          _text = "NON-" + _text;
        }
        return NonTerminal(_text, {
          title: "Unicode Category " + node.code,
          "class": _class
        });
      case "any-character":
        extra = !isSingleString() ? " except newline" : "";
        return NonTerminal("ANY", {
          title: "Any character" + extra,
          "class": 'character-class'
        });
      case "word-boundary":
        return NonTerminal("WB", {
          title: "Word-boundary",
          "class": 'zero-width-assertion'
        });
      case "non-word-boundary":
        return NonTerminal("NON-WB", {
          title: "Non-word-boundary (match if in a word)",
          "class": 'zero-width-assertion invert'
        });
      default:
        return NonTerminal(node.type);
    }
  };

  quantifiedComment = function(comment, greedy, attrs) {
    if (comment && greedy) {
      attrs.title += ', longest possible match';
      attrs["class"] = 'quantified greedy';
      return Comment(comment + ' (greedy)', attrs);
    } else if (greedy) {
      attrs.title = 'longest possible match';
      attrs["class"] = 'quantified greedy';
      return Comment('greedy', attrs);
    } else if (comment) {
      attrs.title += ', shortest possible match';
      attrs["class"] = 'quantified lazy';
      return Comment(comment + ' (lazy)', attrs);
    } else {
      attrs.title = 'shortest possible match';
      attrs["class"] = 'quantified lazy';
      return Comment('lazy', attrs);
    }
  };

  parseRegex = function(regex) {
    if (regex instanceof RegExp) {
      regex = regex.source;
    }
    return parse(regex);
  };

  module.exports = {
    Regex2RailRoadDiagram: function(regex, parent, opts) {
      return Diagram(rx2rr(parseRegex(regex), opts)).addTo(parent);
    },
    ParseRegex: parseRegex
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXNnYXZhci9kb3RmaWxlcy9hdG9tLy5hdG9tL3BhY2thZ2VzL3JlZ2V4LXJhaWxyb2FkLWRpYWdyYW0vbGliL3JlZ2V4LXRvLXJhaWxyb2FkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxRQUFSOztFQUVSLE1BQ3VDLE9BQUEsQ0FBUSxxQkFBUixDQUR2QyxFQUFDLHFCQUFELEVBQVUsdUJBQVYsRUFBb0IsbUJBQXBCLEVBQTRCLHVCQUE1QixFQUFzQyx5QkFBdEMsRUFBaUQsMkJBQWpELEVBQTZELHVCQUE3RCxFQUNDLDZCQURELEVBQ2MscUJBRGQsRUFDdUIsZUFEdkIsRUFDNkI7O0VBRTdCLE9BQUEsR0FBVSxTQUFBO1dBQUcsV0FBQSxDQUFZLElBQVosRUFBa0I7TUFBQSxLQUFBLEVBQU8saUJBQVA7TUFBMEIsQ0FBQSxLQUFBLENBQUEsRUFBTyxvQkFBakM7S0FBbEI7RUFBSDs7RUFHVixXQUFBLEdBQWMsU0FBQyxJQUFEO0FBRVosUUFBQTtJQUFBLElBQUcsSUFBQSxLQUFRLEdBQVg7YUFDRSxPQUFBLENBQUEsRUFERjtLQUFBLE1BQUE7TUFHRSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxpQkFBWDtNQUNSLFFBQUEsR0FBVztBQUNYLFdBQUEsdUNBQUE7O1FBQ0UsSUFBQSxDQUFnQixJQUFJLENBQUMsTUFBckI7QUFBQSxtQkFBQTs7UUFDQSxJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFIO1VBQ0UsSUFBRyxJQUFJLENBQUMsTUFBTCxLQUFlLENBQWxCO1lBQ0UsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFBLENBQUEsQ0FBZCxFQURGO1dBQUEsTUFBQTtZQUdFLFFBQVEsQ0FBQyxJQUFULENBQWMsU0FBQSxDQUFVLE9BQUEsQ0FBQSxDQUFWLEVBQXFCLE9BQUEsQ0FBVyxJQUFJ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QUFDLEtBQUQsRUFBTCxHQUFjO2FBQ2QsT0FBQSxDQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFQRzs7RUFUYTs7RUFrQnBCLFVBQUEsR0FBYSxTQUFDLEtBQUQ7SUFDWCxJQUFHLEtBQUEsWUFBaUIsTUFBcEI7TUFDRSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BRGhCOztXQUdBLEtBQUEsQ0FBTSxLQUFOO0VBSlc7O0VBTWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLHFCQUFBLEVBQXVCLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsSUFBaEI7YUFDckIsT0FBQSxDQUFRLEtBQUEsQ0FBTSxVQUFBLENBQVcsS0FBWCxDQUFOLEVBQXlCLElBQXpCLENBQVIsQ0FBdUMsQ0FBQyxLQUF4QyxDQUE4QyxNQUE5QztJQURxQixDQUF2QjtJQUdBLFVBQUEsRUFBWSxVQUhaOztBQTlXRiIsInNvdXJjZXNDb250ZW50IjpbInBhcnNlID0gcmVxdWlyZSBcInJlZ2V4cFwiXG5cbntEaWFncmFtLCBTZXF1ZW5jZSwgQ2hvaWNlLCBPcHRpb25hbCwgT25lT3JNb3JlLCBaZXJvT3JNb3JlLCBUZXJtaW5hbCxcbiBOb25UZXJtaW5hbCwgQ29tbWVudCwgU2tpcCwgR3JvdXAgfSA9IHJlcXVpcmUgJy4vcmFpbHJvYWQtZGlhZ3JhbXMnXG5cbmRvU3BhY2UgPSAtPiBOb25UZXJtaW5hbChcIlNQXCIsIHRpdGxlOiBcIlNwYWNlIGNoYXJhY3RlclwiLCBjbGFzczogXCJsaXRlcmFsIHdoaXRlc3BhY2VcIilcblxuXG5tYWtlTGl0ZXJhbCA9ICh0ZXh0KSAtPlxuICAjZGVidWdnZXJcbiAgaWYgdGV4dCA9PSBcIiBcIlxuICAgIGRvU3BhY2UoKVxuICBlbHNlXG4gICAgcGFydHMgPSB0ZXh0LnNwbGl0IC8oXiArfCB7Mix9fCArJCkvXG4gICAgc2VxdWVuY2UgPSBbXVxuICAgIGZvciBwYXJ0IGluIHBhcnRzXG4gICAgICBjb250aW51ZSB1bmxlc3MgcGFydC5sZW5ndGhcbiAgICAgIGlmIC9eICskLy50ZXN0KHBhcnQpXG4gICAgICAgIGlmIHBhcnQubGVuZ3RoID09IDFcbiAgICAgICAgICBzZXF1ZW5jZS5wdXNoIGRvU3BhY2UoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc2VxdWVuY2UucHVzaCBPbmVPck1vcmUoZG9TcGFjZSgpLCBDb21tZW50KFwiI3twYXJ0Lmxlbmd0aH14XCIsIHRpdGxlOiBcInJlcGVhdCAje3BhcnQubGVuZ3RofSB0aW1lc1wiKSlcbiAgICAgIGVsc2VcbiAgICAgICAgc2VxdWVuY2UucHVzaCBUZXJtaW5hbChwYXJ0LCBjbGFzczogXCJsaXRlcmFsXCIpXG5cbiAgICBpZiBzZXF1ZW5jZS5sZW5ndGggPT0gMVxuICAgICAgc2VxdWVuY2VbMF1cbiAgICBlbHNlXG4gICAgICBuZXcgU2VxdWVuY2Ugc2VxdWVuY2VcblxuZ2V0X2ZsYWdfbmFtZSA9IChmbGFnKSAtPlxuICBmbGFnX25hbWVzID0ge1xuICAgIEE6ICdwY3JlOmFuY2hvcmVkJ1xuICAgIEQ6ICdwY3JlOmRvbGxhci1lbmRvbmx5J1xuICAgIFM6ICdwY3JlOnN0dWR5J1xuICAgIFU6ICdwY3JlOnVuZ3JlZWR5J1xuICAgIFg6ICdwY3JlOmV4dHJhJ1xuICAgIEo6ICdwY3JlOmV4dHJhJ1xuICAgIGk6ICdjYXNlLWluc2Vuc2l0aXZlJ1xuICAgIG06ICdtdWx0aS1saW5lJ1xuICAgIHM6ICdkb3RhbGwnXG4gICAgZTogJ2V2YWx1YXRlJ1xuICAgIG86ICdjb21waWxlLW9uY2UnXG4gICAgeDogJ2V4dGVuZGVkLWxlZ2lsaWJpbGl0eSdcbiAgICBnOiAnZ2xvYmFsJ1xuICAgIGM6ICdjdXJyZW50LXBvc2l0aW9uJ1xuICAgIHA6ICdwcmVzZXJ2ZSdcbiAgICBkOiAnbm8tdW5pY29kZS1ydWxlcydcbiAgICB1OiAndW5pY29kZS1ydWxlcydcbiAgICBhOiAnYXNjaWktcnVsZXMnXG4gICAgbDogJ2N1cnJlbnQtbG9jYWxlJ1xuICB9XG5cbiAgaWYgZmxhZyBvZiBmbGFnX25hbWVzXG4gICAgZmxhZ19uYW1lc1tmbGFnXVxuICBlbHNlXG4gICAgXCJ1bmtub3duOiN7ZmxhZ31cIlxuXG5yeDJyciA9IChub2RlLCBvcHRpb25zKSAtPlxuICBvcHRzID0gb3B0aW9ucy5vcHRpb25zXG5cbiAgaXNTaW5nbGVTdHJpbmcgPSAtPiBvcHRzLm1hdGNoIC9zL1xuXG4gIGRvU3RhcnRPZlN0cmluZyA9IC0+XG4gICAgaWYgb3B0cy5tYXRjaCAvbS9cbiAgICAgIHRpdGxlID0gXCJCZWdpbm5pbmcgb2YgbGluZVwiXG4gICAgZWxzZVxuICAgICAgdGl0bGUgPSBcIkJlZ2lubmluZyBvZiBzdHJpbmdcIlxuICAgIE5vblRlcm1pbmFsKFwiU1RBUlRcIiwgdGl0bGU6IHRpdGxlLCBjbGFzczogJ3plcm8td2lkdGgtYXNzZXJ0aW9uJylcblxuICBkb0VuZE9mU3RyaW5nICAgPSAtPlxuICAgIGlmIG9wdHMubWF0Y2ggL20vXG4gICAgICB0aXRsZSA9IFwiRW5kIG9mIGxpbmVcIlxuICAgIGVsc2VcbiAgICAgIHRpdGxlID0gXCJFbmQgb2Ygc3RyaW5nXCJcblxuICAgIE5vblRlcm1pbmFsKFwiRU5EXCIsIHRpdGxlOiB0aXRsZSwgY2xhc3M6ICd6ZXJvLXdpZHRoLWFzc2VydGlvbicpXG5cbiMgIGRlYnVnZ2VyXG4gIHN3aXRjaCBub2RlLnR5cGVcbiAgICB3aGVuIFwibWF0Y2hcIlxuICAgICAgbGl0ZXJhbCA9ICcnXG4gICAgICBzZXF1ZW5jZSA9IFtdXG5cbiAgICAgIGZvciBuIGluIG5vZGUuYm9keVxuICAgICAgICBpZiBuLnR5cGUgaXMgXCJsaXRlcmFsXCIgYW5kIG4uZXNjYXBlZFxuICAgICAgICAgIGlmIG4uYm9keSBpcyBcIkFcIlxuICAgICAgICAgICAgc2VxdWVuY2UucHVzaCBkb1N0YXJ0T2ZTdHJpbmcoKVxuICAgICAgICAgIGVsc2UgaWYgbi5ib2R5IGlzIFwiWlwiXG4gICAgICAgICAgICBzZXF1ZW5jZS5wdXNoIGRvRW5kT2ZTdHJpbmcoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpdGVyYWwgKz0gbi5ib2R5XG5cbiAgICAgICAgZWxzZSBpZiBuLnR5cGUgaXMgXCJsaXRlcmFsXCIgICMgYW5kIG5vdCBuLmVzY2FwZWRcbiAgICAgICAgICBsaXRlcmFsICs9IG4uYm9keVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbGl0ZXJhbFxuICAgICAgICAgICAgc2VxdWVuY2UucHVzaCBtYWtlTGl0ZXJhbChsaXRlcmFsKVxuICAgICAgICAgICAgbGl0ZXJhbCA9ICcnXG5cbiAgICAgICAgICBzZXF1ZW5jZS5wdXNoIHJ4MnJyIG4sIG9wdGlvbnNcblxuICAgICAgaWYgbGl0ZXJhbFxuICAgICAgICBzZXF1ZW5jZS5wdXNoIG1ha2VMaXRlcmFsKGxpdGVyYWwpXG5cbiAgICAgIGlmIHNlcXVlbmNlLmxlbmd0aCA9PSAxXG4gICAgICAgIHNlcXVlbmNlWzBdXG4gICAgICBlbHNlXG4gICAgICAgIG5ldyBTZXF1ZW5jZSBzZXF1ZW5jZVxuXG4gICAgd2hlbiBcImFsdGVybmF0ZVwiXG4gICAgICBhbHRlcm5hdGl2ZXMgPSBbXVxuICAgICAgd2hpbGUgbm9kZS50eXBlIGlzIFwiYWx0ZXJuYXRlXCJcbiAgICAgICAgYWx0ZXJuYXRpdmVzLnB1c2ggcngycnIgbm9kZS5sZWZ0LCBvcHRpb25zXG4gICAgICAgIG5vZGUgPSBub2RlLnJpZ2h0XG5cbiAgICAgIGFsdGVybmF0aXZlcy5wdXNoIHJ4MnJyIG5vZGUsIG9wdGlvbnNcblxuICAgICAgbmV3IENob2ljZSBNYXRoLmZsb29yKGFsdGVybmF0aXZlcy5sZW5ndGgvMiktMSwgYWx0ZXJuYXRpdmVzXG5cbiAgICB3aGVuIFwicXVhbnRpZmllZFwiXG4gICAgICB7bWluLCBtYXgsIGdyZWVkeX0gPSBub2RlLnF1YW50aWZpZXJcblxuICAgICAgYm9keSA9IHJ4MnJyIG5vZGUuYm9keSwgb3B0aW9uc1xuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaW5pbXVtIHF1YW50aWZpZXIgKCN7bWlufSkgbXVzdCBiZSBsb3dlciB0aGFuIFwiXG4gICAgICAgICAgKyBcIm1heGltdW0gcXVhbnRpZmllciAoI3ttYXh9KVwiKSB1bmxlc3MgbWluIDw9IG1heFxuXG4gICAgICBwbHVyYWwgPSAoeCkgLT4gaWYgeCAhPSAxIHRoZW4gXCJzXCIgZWxzZSBcIlwiXG5cbiAgICAgIHN3aXRjaCBtaW5cbiAgICAgICAgd2hlbiAwXG4gICAgICAgICAgaWYgbWF4IGlzIDFcbiAgICAgICAgICAgIE9wdGlvbmFsKGJvZHkpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgbWF4ID09IDBcbiAgICAgICAgICAgICAgWmVyb09yTW9yZShib2R5LCBxdWFudGlmaWVkQ29tbWVudChcIjB4XCIsIGdyZWVkeSwgdGl0bGU6IFwiZXhhY3QgMCB0aW1lcyByZXBpdGl0aW9uIGRvZXMgbm90IG1ha2Ugc2Vuc2VcIikpXG4gICAgICAgICAgICBlbHNlIGlmIG1heCAhPSBJbmZpbml0eVxuICAgICAgICAgICAgICBaZXJvT3JNb3JlKGJvZHksIHF1YW50aWZpZWRDb21tZW50KFwiMC0je21heH14XCIsIGdyZWVkeSwgdGl0bGU6IFwicmVwZWF0IDAgdG8gI3ttYXh9IHRpbWVcIiArIHBsdXJhbChtYXgpKSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgWmVyb09yTW9yZShib2R5LCBxdWFudGlmaWVkQ29tbWVudChcIipcIiwgZ3JlZWR5LCB0aXRsZTogXCJyZXBlYXQgemVybyBvciBtb3JlIHRpbWVzXCIpKVxuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBpZiBtYXggPT0gMVxuICAgICAgICAgICAgT25lT3JNb3JlKGJvZHksIENvbW1lbnQoXCIxXCIsIHRpdGxlOiBcIm9uY2VcIikpXG4gICAgICAgICAgZWxzZSBpZiBtYXggIT0gSW5maW5pdHlcbiAgICAgICAgICAgIE9uZU9yTW9yZShib2R5LCBxdWFudGlmaWVkQ29tbWVudChcIjEtI3ttYXh9eFwiLCBncmVlZHksIHRpdGxlOiBcInJlcGVhdCAxIHRvICN7bWF4fSB0aW1lc1wiKSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBPbmVPck1vcmUoYm9keSwgcXVhbnRpZmllZENvbW1lbnQoXCIrXCIsIGdyZWVkeSwgdGl0bGU6IFwicmVwZWF0IGF0IGxlYXN0IG9uZSB0aW1lXCIpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbWF4ID09IG1pblxuICAgICAgICAgICAgT25lT3JNb3JlKGJvZHksIENvbW1lbnQoXCIje21heH14XCIsIHRpdGxlOiBcInJlcGVhdCAje21heH0gdGltZXNcIikpXG4gICAgICAgICAgZWxzZSBpZiBtYXggIT0gSW5maW5pdHlcbiAgICAgICAgICAgIE9uZU9yTW9yZShib2R5LCBxdWFudGlmaWVkQ29tbWVudChcIiN7bWlufS0je21heH14XCIsIGdyZWVkeSwgdGl0bGU6IFwicmVwZWF0ICN7bWlufSB0byAje21heH0gdGltZXNcIikpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgT25lT3JNb3JlKGJvZHksIHF1YW50aWZpZWRDb21tZW50KFwiPj0gI3ttaW59eFwiLCBncmVlZHksIHRpdGxlOiBcInJlcGVhdCBhdCBsZWFzdCAje21pbn0gdGltZVwiICsgcGx1cmFsKG1pbikpKVxuXG4gICAgd2hlbiBcImNhcHR1cmUtZ3JvdXBcIlxuICAgICAgdGV4dCA9IFwiY2FwdHVyZSAje25vZGUuaW5kZXh9XCJcbiAgICAgIG1pbl93aWR0aCA9IDU1XG4gICAgICBpZiBub2RlLm5hbWVcbiAgICAgICAgdGV4dCArPSBcIiAoI3tub2RlLm5hbWV9KVwiXG4gICAgICAgIG1pbl93aWR0aCA9IDU1ICsgKG5vZGUubmFtZS5zcGxpdCgnJykubGVuZ3RoKzMpKjdcbiAgICAgIEdyb3VwIHJ4MnJyKG5vZGUuYm9keSwgb3B0aW9ucyksIENvbW1lbnQodGV4dCwgY2xhc3M6IFwiY2FwdGlvblwiKSwgbWluV2lkdGg6IG1pbl93aWR0aCwgYXR0cnM6IHtjbGFzczogJ2NhcHR1cmUtZ3JvdXAgZ3JvdXAnfVxuXG4gICAgd2hlbiBcImZsYWdzXCJcbiAgICAgIHR1cm5fb25fbG9uZyA9IFtdXG4gICAgICB0dXJuX29mZl9sb25nID0gW11cbiAgICAgIGNvbnNvbGUubG9nIG5vZGVcbiAgICAgIGZsYWdzID0gbm9kZS5ib2R5LmpvaW4oJycpXG4gICAgICBbdHVybl9vbiwgdHVybl9vZmZdID0gZmxhZ3Muc3BsaXQoJy0nKVxuICAgICAgdHVybl9vbiA/PSAnJ1xuICAgICAgdHVybl9vZmYgPz0gJydcbiAgICAgIGZvciBmIGluIHR1cm5fb24uc3BsaXQoJycpXG4gICAgICAgIHR1cm5fb25fbG9uZy5wdXNoIGdldF9mbGFnX25hbWUoZilcblxuICAgICAgZm9yIGYgaW4gdHVybl9vZmYuc3BsaXQoJycpXG4gICAgICAgIGlmIGYgPT0gJ2knXG4gICAgICAgICAgdHVybl9vbl9sb25nLnB1c2goJ2Nhc2Utc2Vuc2l0aXZlJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHR1cm5fb2ZmX2xvbmcucHVzaCBnZXRfZmxhZ19uYW1lKGYpXG5cbiAgICAgIF90aXRsZSA9IFtdXG4gICAgICBpZiB0dXJuX29uXG4gICAgICAgIF90aXRsZS5wdXNoIFwiVHVybiBvbjogXCIrdHVybl9vbl9sb25nLmpvaW4oJywgJylcbiAgICAgIGlmIHR1cm5fb2ZmXG4gICAgICAgIF90aXRsZS5wdXNoIFwiVHVybiBvZmY6IFwiK3R1cm5fb2ZmX2xvbmcuam9pbignLCAnKVxuXG4gICAgICBOb25UZXJtaW5hbChcIlNFVDogXCIrbm9kZS5ib2R5LmpvaW4oJycpLCB0aXRsZTogX3RpdGxlLmpvaW4oXCJcXG5cIiksIGNsYXNzOiAnemVyby13aWR0aC1hc3NlcnRpb24nKVxuICAgICAgI05vblRlcm1pbmFsKFwiV09SRFwiLCB0aXRsZTogXCJXb3JkIGNoYXJhY3RlciBBLVosIDAtOSwgX1wiLCBjbGFzczogJ2NoYXJhY3Rlci1jbGFzcycpXG5cbiAgICB3aGVuIFwibm9uLWNhcHR1cmUtZ3JvdXBcIlxuICAgICAgIyBHcm91cCByeDJycihub2RlLmJvZHksIG9wdGlvbnMpLCBudWxsLCBhdHRyczoge2NsYXNzOiAnZ3JvdXAnfVxuICAgICAgcngycnIobm9kZS5ib2R5LCBvcHRpb25zKVxuXG4gICAgd2hlbiBcInBvc2l0aXZlLWxvb2thaGVhZFwiXG4gICAgICBHcm91cCByeDJycihub2RlLmJvZHksIG9wdGlvbnMpLCBDb21tZW50KFwiPT4gP1wiLCB0aXRsZTogXCJQb3NpdGl2ZSBsb29rYWhlYWRcIiwgY2xhc3M6IFwiY2FwdGlvblwiKSwgYXR0cnM6IHtjbGFzczogXCJsb29rYWhlYWQgcG9zaXRpdmUgemVyby13aWR0aC1hc3NlcnRpb24gZ3JvdXBcIn1cblxuICAgIHdoZW4gXCJuZWdhdGl2ZS1sb29rYWhlYWRcIlxuICAgICAgR3JvdXAgcngycnIobm9kZS5ib2R5LCBvcHRpb25zKSwgQ29tbWVudChcIiE+ID9cIiwgdGl0bGU6IFwiTmVnYXRpdmUgbG9va2FoZWFkXCIsIGNsYXNzOiBcImNhcHRpb25cIiksIGF0dHJzOiB7Y2xhc3M6IFwibG9va2FoZWFkIG5lZ2F0aXZlIHplcm8td2lkdGgtYXNzZXJ0aW9uIGdyb3VwXCJ9XG5cbiAgICB3aGVuIFwicG9zaXRpdmUtbG9va2JlaGluZFwiXG4gICAgICBHcm91cCByeDJycihub2RlLmJvZHksIG9wdGlvbnMpLCBDb21tZW50KFwiPD0gP1wiLCB0aXRsZTogXCJQb3NpdGl2ZSBsb29rYmVoaW5kXCIsIGNsYXNzOiBcImNhcHRpb25cIiksIGF0dHJzOiB7Y2xhc3M6IFwibG9va2JlaGluZCBwb3NpdGl2ZSB6ZXJvLXdpZHRoLWFzc2VydGlvbiBncm91cFwifVxuXG4gICAgd2hlbiBcIm5lZ2F0aXZlLWxvb2tiZWhpbmRcIlxuICAgICAgR3JvdXAgcngycnIobm9kZS5ib2R5LCBvcHRpb25zKSwgQ29tbWVudChcIjwhID9cIiwgdGl0bGU6IFwiTmVnYXRpdmUgbG9va2JlaGluZFwiLCBjbGFzczogXCJjYXB0aW9uXCIpLCBhdHRyczoge2NsYXNzOiBcImxvb2tiZWhpbmQgbmVnYXRpdmUgemVyby13aWR0aC1hc3NlcnRpb24gZ3JvdXBcIn1cblxuICAgIHdoZW4gXCJiYWNrLXJlZmVyZW5jZVwiXG4gICAgICBOb25UZXJtaW5hbChcIiN7bm9kZS5jb2RlfVwiLCB0aXRsZTogXCJNYXRjaCBjYXB0dXJlICN7bm9kZS5jb2RlfSAoQmFjayBSZWZlcmVuY2UpXCIsIGNsYXNzOiAnYmFjay1yZWZlcmVuY2UnKVxuXG4gICAgd2hlbiBcImxpdGVyYWxcIlxuICAgICAgaWYgbm9kZS5lc2NhcGVkXG4gICAgICAgIGlmIG5vZGUuYm9keSBpcyBcIkFcIlxuICAgICAgICAgIGRvU3RhcnRPZlN0cmluZygpXG4gICAgICAgIGVsc2UgaWYgbm9kZS5ib2R5IGlzIFwiWlwiXG4gICAgICAgICAgZG9FbmRPZlN0cmluZygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAjVGVybWluYWwoXCJcXFxcXCIrbm9kZS5ib2R5KVxuICAgICAgICAgIFRlcm1pbmFsKG5vZGUuYm9keSwgY2xhc3M6IFwibGl0ZXJhbFwiKVxuICAgICAgZWxzZVxuICAgICAgICBtYWtlTGl0ZXJhbChub2RlLmJvZHkpXG5cbiAgICB3aGVuIFwic3RhcnRcIlxuICAgICAgZG9TdGFydE9mU3RyaW5nKClcblxuICAgIHdoZW4gXCJlbmRcIlxuICAgICAgZG9FbmRPZlN0cmluZygpXG5cbiAgICB3aGVuIFwid29yZFwiXG4gICAgICBOb25UZXJtaW5hbChcIldPUkRcIiwgdGl0bGU6IFwiV29yZCBjaGFyYWN0ZXIgQS1aLCAwLTksIF9cIiwgY2xhc3M6ICdjaGFyYWN0ZXItY2xhc3MnKVxuXG4gICAgd2hlbiBcIm5vbi13b3JkXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiTk9OLVdPUkRcIiwgdGl0bGU6IFwiTm9uLXdvcmQgY2hhcmFjdGVyLCBhbGwgZXhjZXB0IEEtWiwgMC05LCBfXCIsIGNsYXNzOiAnY2hhcmFjdGVyLWNsYXNzIGludmVydCcpXG5cbiAgICB3aGVuIFwibGluZS1mZWVkXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiTEZcIiwgdGl0bGU6IFwiTGluZSBmZWVkICdcXFxcbidcIiwgY2xhc3M6ICdsaXRlcmFsIHdoaXRlc3BhY2UnKVxuXG4gICAgd2hlbiBcImNhcnJpYWdlLXJldHVyblwiXG4gICAgICBOb25UZXJtaW5hbChcIkNSXCIsIHRpdGxlOiBcIkNhcnJpYWdlIFJldHVybiAnXFxcXHInXCIsIGNsYXNzOiAnbGl0ZXJhbCB3aGl0ZXNwYWNlJylcblxuICAgIHdoZW4gXCJ2ZXJ0aWNhbC10YWJcIlxuICAgICAgTm9uVGVybWluYWwoXCJWVEFCXCIsIHRpdGxlOiBcIlZlcnRpY2FsIHRhYiAnXFxcXHYnXCIsIGNsYXNzOiAnbGl0ZXJhbCB3aGl0ZXNwYWNlJylcblxuICAgIHdoZW4gXCJ0YWJcIlxuICAgICAgTm9uVGVybWluYWwoXCJUQUJcIiwgdGl0bGU6IFwiVGFiIHN0b3AgJ1xcXFx0J1wiLCBjbGFzczogJ2xpdGVyYWwgd2hpdGVzcGFjZScpXG5cbiAgICB3aGVuIFwiZm9ybS1mZWVkXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiRkZcIiwgdGl0bGU6IFwiRm9ybSBmZWVkXCIsIGNsYXNzOiAnbGl0ZXJhbCB3aGl0ZXNwYWNlJylcblxuICAgIHdoZW4gXCJiYWNrLXNwYWNlXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiQlNcIiwgdGl0bGU6IFwiQmFja3NwYWNlXCIsIGNsYXNzOiAnbGl0ZXJhbCcpXG5cbiAgICB3aGVuIFwiZGlnaXRcIlxuICAgICAgTm9uVGVybWluYWwoXCIwLTlcIiwgY2xhc3M6ICdjaGFyYWN0ZXItY2xhc3MnKVxuXG4gICAgd2hlbiBcIm51bGwtY2hhcmFjdGVyXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiTlVMTFwiLCB0aXRsZTogXCJOdWxsIGNoYXJhY3RlciAnXFxcXDAnXCIsIGNsYXNzOiAnbGl0ZXJhbCcpXG5cbiAgICB3aGVuIFwibm9uLWRpZ2l0XCJcbiAgICAgIE5vblRlcm1pbmFsKFwibm90IDAtOVwiLCB0aXRsZTogXCJBbGwgZXhjZXB0IGRpZ2l0c1wiLCBjbGFzczogJ2NoYXJhY3Rlci1jbGFzcyBpbnZlcnQnKVxuXG4gICAgd2hlbiBcIndoaXRlLXNwYWNlXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiV1NcIiwgdGl0bGU6IFwiV2hpdGVzcGFjZTogc3BhY2UsIHRhYnN0b3AsIGxpbmVmZWVkLCBjYXJyaWFnZS1yZXR1cm4sIGV0Yy5cIiwgY2xhc3M6ICdjaGFyYWN0ZXItY2xhc3Mgd2hpdGVzcGFjZScpXG5cbiAgICB3aGVuIFwibm9uLXdoaXRlLXNwYWNlXCJcbiAgICAgIE5vblRlcm1pbmFsKFwiTk9OLVdTXCIsIHRpdGxlOiBcIk5vdCB3aGl0ZXNwYWNlOiBhbGwgZXhjZXB0IHNwYWNlLCB0YWJzdG9wLCBsaW5lLWZlZWQsIGNhcnJpYWdlLXJldHVybiwgZXRjLlwiLCBjbGFzczogJ2NoYXJhY3Rlci1jbGFzcyBpbnZlcnQnKVxuXG4gICAgd2hlbiBcInJhbmdlXCJcbiAgICAgIE5vblRlcm1pbmFsKG5vZGUudGV4dCwgY2xhc3M6IFwiY2hhcmFjdGVyLWNsYXNzXCIpXG5cbiAgICB3aGVuIFwiY2hhcnNldFwiXG4gICAgICBjaGFyc2V0ID0gKHgudGV4dCBmb3IgeCBpbiBub2RlLmJvZHkpXG5cbiAgICAgIGlmIGNoYXJzZXQubGVuZ3RoID09IDFcbiAgICAgICAgY2hhciA9IGNoYXJzZXRbMF1cblxuICAgICAgICBpZiBjaGFyID09IFwiIFwiXG4gICAgICAgICAgaWYgbm9kZS5pbnZlcnRcbiAgICAgICAgICAgIHJldHVybiBkb1NwYWNlKClcblxuICAgICAgICBpZiBub2RlLmludmVydFxuICAgICAgICAgIHJldHVybiBOb25UZXJtaW5hbChcIm5vdCAje2NoYXJ9XCIsIHRpdGxlOiBcIk1hdGNoIGFsbCBleGNlcHQgI3tjaGFyfVwiLCBjbGFzczogJ2NoYXJhY3Rlci1jbGFzcyBpbnZlcnQnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgY2hhciBpcyBcIlNQXCJcbiAgICAgICAgICAgIHJldHVybiBkb1NwYWNlKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gVGVybWluYWwoY2hhciwgY2xhc3M6IFwibGl0ZXJhbFwiKVxuICAgICAgZWxzZVxuICAgICAgICBsaXN0ID0gY2hhcnNldFswLi4uLTFdLmpvaW4oXCIsIFwiKVxuXG4gICAgICAgIGZvciB4LGkgaW4gbGlzdFxuICAgICAgICAgIGlmIHggPT0gXCIgXCJcbiAgICAgICAgICAgIGxpc3RbaV0gPSBcIlNQXCJcblxuICAgICAgICBpZiBub2RlLmludmVydFxuICAgICAgICAgIHJldHVybiBOb25UZXJtaW5hbChcIm5vdCAje2xpc3R9IGFuZCAje2NoYXJzZXRbLTEuLl19XCIsIGNsYXNzOiAnY2hhcmFjdGVyLWNsYXNzIGludmVydCcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gTm9uVGVybWluYWwoXCIje2xpc3R9IG9yICN7Y2hhcnNldFstMS4uXX1cIiwgY2xhc3M6ICdjaGFyYWN0ZXItY2xhc3MnKVxuXG4gICAgd2hlbiBcImhleFwiLCBcIm9jdGFsXCIsIFwidW5pY29kZVwiXG4gICAgICBUZXJtaW5hbChub2RlLnRleHQsIGNsYXNzOiAnbGl0ZXJhbCBjaGFyYWNodGVyLWNvZGUnKVxuXG4gICAgd2hlbiBcInVuaWNvZGUtY2F0ZWdvcnlcIlxuICAgICAgX3RleHQgPSBub2RlLmNvZGVcbiAgICAgIF9jbGFzcyA9ICd1bmljb2RlLWNhdGVnb3J5IGNoYXJhY3Rlci1jbGFzcydcbiAgICAgIGlmIG5vZGUuaW52ZXJ0XG4gICAgICAgIF9jbGFzcyArPSAnIGludmVydCdcbiAgICAgICAgX3RleHQgPSBcIk5PTi0je190ZXh0fVwiXG5cbiAgICAgIE5vblRlcm1pbmFsKF90ZXh0LCB0aXRsZTogXCJVbmljb2RlIENhdGVnb3J5ICN7bm9kZS5jb2RlfVwiLCBjbGFzczogX2NsYXNzKVxuXG4gICAgd2hlbiBcImFueS1jaGFyYWN0ZXJcIlxuICAgICAgZXh0cmEgPSB1bmxlc3MgaXNTaW5nbGVTdHJpbmcoKSB0aGVuIFwiIGV4Y2VwdCBuZXdsaW5lXCIgZWxzZSBcIlwiXG4gICAgICBOb25UZXJtaW5hbChcIkFOWVwiLCB0aXRsZTogXCJBbnkgY2hhcmFjdGVyI3tleHRyYX1cIiAsIGNsYXNzOiAnY2hhcmFjdGVyLWNsYXNzJylcblxuICAgIHdoZW4gXCJ3b3JkLWJvdW5kYXJ5XCJcbiAgICAgIE5vblRlcm1pbmFsKFwiV0JcIiwgdGl0bGU6IFwiV29yZC1ib3VuZGFyeVwiLCBjbGFzczogJ3plcm8td2lkdGgtYXNzZXJ0aW9uJylcblxuICAgIHdoZW4gXCJub24td29yZC1ib3VuZGFyeVwiXG4gICAgICBOb25UZXJtaW5hbChcIk5PTi1XQlwiLCB0aXRsZTogXCJOb24td29yZC1ib3VuZGFyeSAobWF0Y2ggaWYgaW4gYSB3b3JkKVwiLCBjbGFzczogJ3plcm8td2lkdGgtYXNzZXJ0aW9uIGludmVydCcpXG5cbiAgICBlbHNlXG4gICAgICBOb25UZXJtaW5hbChub2RlLnR5cGUpXG5cbiAgICAgICMgd29yZC1ib3VuZGFyeVxuICAgICAgIyBub24td29yZC1ib3VuZGFyeVxuICAgICAgIyBub24tZGlnaXRcbiAgICAgICMgZm9ybS1mZWVkXG4gICAgICAjIGxpbmUtZmVlZFxuICAgICAgIyBjYXJyaWFnZS1yZXR1cm5cbiAgICAgICMgd2hpdGUtc3BhY2VcbiAgICAgICMgbm9uLXdoaXRlLXNwYWNlXG4gICAgICAjIHRhYlxuICAgICAgIyB2ZXJ0aWNhbC10YWJcbiAgICAgICMgd29yZFxuICAgICAgIyBub24td29yZFxuICAgICAgIyAhIGNvbnRyb2wtY2hhcmFjdGVyIChub3Qgc3VwcG9ydGVkKVxuICAgICAgIyBvY3RhbCBcXDAwMFxuICAgICAgIyBoZXggICBcXHguLi5cbiAgICAgICMgdW5pY29kZSBcXHUuLi5cbiAgICAgICMgbnVsbC1jaGFyYWN0ZXJcblxucXVhbnRpZmllZENvbW1lbnQgPSAoY29tbWVudCwgZ3JlZWR5LCBhdHRycykgLT5cbiAgaWYgY29tbWVudCBhbmQgZ3JlZWR5XG4gICAgYXR0cnMudGl0bGUgKz0gJywgbG9uZ2VzdCBwb3NzaWJsZSBtYXRjaCdcbiAgICBhdHRycy5jbGFzcyA9ICdxdWFudGlmaWVkIGdyZWVkeSdcbiAgICBDb21tZW50KGNvbW1lbnQgKyAnIChncmVlZHkpJywgYXR0cnMpXG4gIGVsc2UgaWYgZ3JlZWR5XG4gICAgYXR0cnMudGl0bGUgPSAnbG9uZ2VzdCBwb3NzaWJsZSBtYXRjaCdcbiAgICBhdHRycy5jbGFzcyA9ICdxdWFudGlmaWVkIGdyZWVkeSdcbiAgICBDb21tZW50KCdncmVlZHknLCBhdHRycylcbiAgZWxzZSBpZiBjb21tZW50XG4gICAgYXR0cnMudGl0bGUgKz0gJywgc2hvcnRlc3QgcG9zc2libGUgbWF0Y2gnXG4gICAgYXR0cnMuY2xhc3MgPSAncXVhbnRpZmllZCBsYXp5J1xuICAgIENvbW1lbnQoY29tbWVudCArICcgKGxhenkpJywgYXR0cnMpXG4gIGVsc2VcbiAgICBhdHRycy50aXRsZSA9ICdzaG9ydGVzdCBwb3NzaWJsZSBtYXRjaCdcbiAgICBhdHRycy5jbGFzcyA9ICdxdWFudGlmaWVkIGxhenknXG4gICAgQ29tbWVudCgnbGF6eScsIGF0dHJzKVxuXG5wYXJzZVJlZ2V4ID0gKHJlZ2V4KSAtPlxuICBpZiByZWdleCBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgIHJlZ2V4ID0gcmVnZXguc291cmNlXG5cbiAgcGFyc2UgcmVnZXhcblxubW9kdWxlLmV4cG9ydHMgPVxuICBSZWdleDJSYWlsUm9hZERpYWdyYW06IChyZWdleCwgcGFyZW50LCBvcHRzKSAtPlxuICAgIERpYWdyYW0ocngycnIocGFyc2VSZWdleChyZWdleCksIG9wdHMpKS5hZGRUbyhwYXJlbnQpXG5cbiAgUGFyc2VSZWdleDogcGFyc2VSZWdleFxuIl19
