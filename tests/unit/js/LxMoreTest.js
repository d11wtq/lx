function LxMoreTest() {
  
  this.name = "LxMoreTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testUsingMoreCausesTextToBeRetained = function () {
    lex.In = "abcd";
    lex.addRule("abc").action = function() {
      Lx.Echo();
      Lx.More();
    };
    while (0 != lex.lex()) ;
    this.assertEquals("abcabcd", lex.Out) ;
  };
  
};

LxMoreTest.prototype = new TestCase();
LxTestSuite.registerTest(LxMoreTest);
