function LxUnputTest() {
  
  this.name = "LxUnputTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testUnputPlacesACharacterBackInTheInputStream = function () {
    lex.In = "abcd";
    lex.addRule("ab").action = function() {
      Lx.Echo();
      Lx.Unput('-');
    };
    while (0 != lex.lex()) ;
    this.assertEquals("ab-cd", lex.Out) ;
  };
  
};

LxUnputTest.prototype = new TestCase();
LxTestSuite.registerTest(LxUnputTest);
