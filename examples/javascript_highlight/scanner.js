var _keywords = {
  "var" : 1,
  "function" : 1,
  "return" : 1,
  "break" : 1,
  "continue" : 1,
  "throw" : 1,
  "typeof" : 1,
  "delete" : 1,
  "true" : 1,
  "false" : 1,
  "null": 1,
  "NaN" : 1,
  "in" : 1,
  "new" : 1,
  "instanceof" : 1,
  "prototype" : 1
};

var _controls = {
  "for" : 1,
  "while" : 1,
  "do" : 1,
  "if" : 1,
  "else" : 1,
  "try" : 1,
  "catch" : 1
};

var _objects = {
  "this" : 1,
  "window" : 1,
  "document" : 1,
  "console" : 1,
  "prototype" : 1,
  "constructor" : 1,
  "parent" : 1
};

//Hack, but hey I'm rushing
function colorize(text, color) {
  var d = document.createElement("div");
  var s = document.createElement("span");
  var t = document.createTextNode(text);
  s.appendChild(t);
  d.appendChild(s);
  s.style.color = color;
  return d.innerHTML;
}

function isKeyword(text) {
  return typeof _keywords[text] != "undefined";
}

function isControl(text) {
  return typeof _controls[text] != "undefined";
}

function isObject(text) {
  return typeof _objects[text] != "undefined";
}

//Grab all target elements
var sources = document.getElementsByClassName("js");

//Create an analyzer (creates global Lx)
var jsLang = new LxAnalyzer();

Lx.rule = Lx.addRule;
Lx.state = Lx.addExclusiveState;

var regexAllowed = true;

//Add states for strings and comments
Lx.state("S_STRING");
Lx.state("S_LITERAL");
Lx.state("S_DOC");
Lx.state("S_COMMENT");
Lx.state("S_REGEX_LITERAL");

//Copy Whitespace Verbatim
Lx.rule(/\s\s*/, Lx.INITIAL).action = function() {
  Lx.Echo();
};

//Anything that looks like a "term"
Lx.rule(/[\$a-zA-Z_][\$0-9a-zA-Z_]*/, Lx.INITIAL).action = function() {
  if (isKeyword(Lx.Text)) {
    Lx.Text = colorize(Lx.Text, "#ffaa44");
  } else if (isControl(Lx.Text)) {
    Lx.Text = colorize(Lx.Text, "#ffff00");
  } else if (isObject(Lx.Text)) {
    Lx.Text = colorize(Lx.Text, "#ff5588");
  }
  Lx.Echo();
  regexAllowed = false;
};

//Anything that looks like a number
Lx.rule(/(?:0x)?\d+(?:\.(?:0x)?\d+)?/, Lx.INITIAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#7777ff");
  Lx.Echo();
  regexAllowed = false;
};

//Operators
Lx.rule(/[\+\-=\/&\^~%\?\*!\|:<>]/, Lx.INITIAL).action = function() {
  //Hack proof of concept for regex literal detection
  if (Lx.Text == '/' && regexAllowed) {
    /*Lx.Unput('/');
    var matches = /\/(?!\*)(\\?[^\/\n\\]|\\\/|\\\\)+\//.exec(Lx.In);
    if (matches) {
      Lx.Text = '';
      for (var i = 0; i < matches[0].length; ++i) {
        Lx.Text += Lx.Input();
      }
      
      Lx.Text = colorize(Lx.Text, "#66ff88");
      Lx.Echo();
      
      regexAllowed = false;
      
      return;
    } else {
      Lx.Text = Lx.Input();
    }*/
    Lx.Text = colorize(Lx.Text, "#66ff88");
    Lx.Echo();
    Lx.PushState(Lx.S_REGEX_LITERAL);
    
    regexAllowed = false;
    
    return;
  }
    
  Lx.Text = colorize(Lx.Text, "#dddd44");
  Lx.Echo();
  regexAllowed = true;
};

Lx.rule(/(?:\\?[^\/\n\\]|\\\/|\\\\)+/, Lx.S_REGEX_LITERAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#66ff88");
  Lx.Echo();
};

Lx.rule('/', Lx.S_REGEX_LITERAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#66ff88");
  Lx.Echo();
  Lx.PopState();
};

//Begin Double String rule
Lx.rule('"', Lx.INITIAL).action = function() {
  Lx.PushState(Lx.S_STRING);
  Lx.More();
  regexAllowed = false;
};

Lx.rule('"', Lx.S_STRING).action = function() {
  Lx.Text = colorize(Lx.Text, "#22dd22");
  Lx.Echo();
  Lx.PopState();
};

Lx.rule(/(?:\\?[^"\n\\]|\\\\|\\")+/, Lx.S_STRING).action = function() {
  Lx.More();
};
//End Double String rule

//Begin Single String rule
Lx.rule('\'', Lx.INITIAL).action = function() {
  Lx.PushState(Lx.S_LITERAL);
  Lx.More();
  regexAllowed = false;
};

Lx.rule('\'', Lx.S_LITERAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#22dd22");
  Lx.Echo();
  Lx.PopState();
};

Lx.rule(/(?:\\?[^'\n\\]|\\\\|\\')+/, Lx.S_LITERAL).action = function() {
  Lx.More();
};
//End Single String rule

//Begin Multi-line comments
Lx.rule("/*", Lx.INITIAL).action = function() {
  Lx.PushState(Lx.S_COMMENT);
  Lx.More();
};

Lx.rule(/(?:[^\*]|(?:\*(?!\/)))+/, Lx.S_COMMENT).action = function() {
  Lx.More();
};

Lx.rule("*/", Lx.S_COMMENT).action = function() {
  Lx.Text = colorize(Lx.Text, "#aaaaaa");
  Lx.Echo();
  Lx.PopState();
};
//End multi-line comments

//C style comments
Lx.rule(/\/\/.+/, Lx.INITIAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#aaaaaa");
  Lx.Echo();
};

//Scan the source then write the output to the element
for (var i = 0; i < sources.length; ++i) {
  var start = new Date();
  var source = sources[i];
  Lx.Reset();
  Lx.In = new String(source.textContent);
  while (0 != Lx.lex()) ;
  source.innerHTML = Lx.Out;
  var end = new Date();
  var dur = end.getTime() - start.getTime();
  alert("Parsed Block [" + (i + 1) + "] in " + dur + "ms");
}
