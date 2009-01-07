function LxInputTest() {
  
  this.name = "LxInputTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testInputReadsACharacterFromTheInputStream = function () {
    lex.In = "abcd";
    lex.addRule("ab").action = function() {
      var c = Lx.Input();
      Lx.Unput('-');
      Lx.Unput(c);
    };
    while (0 != lex.lex()) ;
    this.assertEquals("c-d", lex.Out) ;
  };
  
};

LxInputTest.prototype = new TestCase();
LxTestSuite.registerTest(LxInputTest);
