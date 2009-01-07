function LxLexTest() {
  
  this.name = "LxLexTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testCopyingAllInputToOutputByDefault = function () {
    lex.In = "abcd";
    while (0 != lex.lex()) ;
    this.assertEquals("abcd", lex.Out);
  };
  
  this.testTokensAreSkippedIfActionIsLeftBlank = function () {
    lex.addRule(/^\s+/);
    lex.In = "function foo(x) { return 42; }";
    while (0 != lex.lex()) ;
    this.assertEquals("functionfoo(x){return42;}", lex.Out);
  };
  
  this.testScanningStopsToReturnFromTheDefaultAction = function () {
    lex.addRule(/^\s+/);
    lex.In = "a b c";
    lex.lex();
    this.assertEquals("a", lex.Out);
    lex.lex();
    this.assertEquals("ab", lex.Out);
    lex.lex();
    this.assertEquals("abc", lex.Out);
  };
  
  this.testScanningStopsToReturnValuesFromUserActions = function () {
    lex.addToken("T_WORD1");
    lex.addToken("T_WORD2");
    lex.addRule("word1").action = function() {
      Lx.Echo();
      return Lx.T_WORD1;
    };
    lex.addRule("word2").action = function() {
      Lx.Echo();
      return Lx.T_WORD2;
    };
    lex.addRule(/^\s+/);
    lex.In = "word1 word2 word1";
    lex.lex();
    this.assertEquals("word1", lex.Out);
    lex.lex();
    this.assertEquals("word1word2", lex.Out);
    lex.lex();
    this.assertEquals("word1word2word1", lex.Out);
  };
  
};

LxLexTest.prototype = new TestCase();
LxTestSuite.registerTest(LxLexTest);
