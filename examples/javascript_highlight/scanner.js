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

//Add states for strings and comments
Lx.addExclusiveState("S_STRING");
Lx.addExclusiveState("S_LITERAL");
Lx.addExclusiveState("S_DOC");
Lx.addExclusiveState("S_COMMENT");

//Copy Whitespace Verbatim
Lx.addRule(/^\s+/, Lx.INITIAL).action = function() {
  Lx.Echo();
};

//Anything that looks like a "term"
Lx.addRule(/^[\$a-zA-Z_][\$0-9a-zA-Z_]+/, Lx.INITIAL).action = function() {
  if (isKeyword(Lx.Text)) {
    Lx.Text = colorize(Lx.Text, "#ffaa44");
  } else if (isControl(Lx.Text)) {
    Lx.Text = colorize(Lx.Text, "#ffff00");
  } else if (isObject(Lx.Text)) {
    Lx.Text = colorize(Lx.Text, "#ff5588");
  }
  Lx.Echo();
};

//Anything that looks like a number
Lx.addRule(/^(0x)?\d+(\.\d+)?/, Lx.INITIAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#7777ff");
  Lx.Echo();
};

//Operators
Lx.addRule(/^[\+\-=\/&\^~%\?\*!\|:<>]/, Lx.INITIAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#dddd44");
  Lx.Echo();
};

//Begin Double String rule
Lx.addRule('"', Lx.INITIAL).action = function() {
  Lx.PushState(Lx.S_STRING);
  Lx.More();
};

Lx.addRule('"', Lx.S_STRING).action = function() {
  Lx.Text = colorize(Lx.Text, "#22dd22");
  Lx.Echo();
  Lx.PopState();
};

Lx.addRule(/^(\\?[^"\n\\]|\\\\|\\")+/, Lx.S_STRING).action = function() {
  Lx.More();
};
//End Double String rule

//Begin Single String rule
Lx.addRule('\'', Lx.INITIAL).action = function() {
  Lx.PushState(Lx.S_LITERAL);
  Lx.More();
};

Lx.addRule('\'', Lx.S_LITERAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#22dd22");
  Lx.Echo();
  Lx.PopState();
};

Lx.addRule(/^(\\?[^'\n\\]|\\\\|\\')+/, Lx.S_LITERAL).action = function() {
  Lx.More();
};
//End Single String rule

//Begin Multi-line comments
Lx.addRule("/*", Lx.INITIAL).action = function() {
  Lx.PushState(Lx.S_COMMENT);
  Lx.More();
};

Lx.addRule(/^([^\*]|(\*(?!\/)))+/, Lx.S_COMMENT).action = function() {
  Lx.More();
};

Lx.addRule("*/", Lx.S_COMMENT).action = function() {
  Lx.Text = colorize(Lx.Text, "#aaaaaa");
  Lx.Echo();
  Lx.PopState();
};
//End multi-line comments

//C style comments
Lx.addRule(/^\/\/.+/, Lx.INITIAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#aaaaaa");
  Lx.Echo();
};

//Regex literal (can be done with a new state, though this seemed more optimal)
Lx.addRule(/^\/(?!\*)(\\?[^\/\n\\]|\\\/|\\\\)+\//, Lx.INITIAL).action = function() {
  Lx.Text = colorize(Lx.Text, "#66ff88");
  Lx.Echo();
};

//Scan the source then write the output to the element
for (var i = 0; i < sources.length; ++i) {
  var sDate = new Date();
  var start = sDate.getTime();
  var source = sources[i];
  Lx.Reset();
  Lx.In = source.textContent;
  while (0 != Lx.lex()) ;
  source.innerHTML = Lx.Out;
  var eDate = new Date();
  var end = eDate.getTime();
  var dur = end - start;
  alert("Parsed Block [" + (i + 1) + "] in " + dur + "ms");
}
