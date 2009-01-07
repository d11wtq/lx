function LxAddTokenTest() {
  
  this.name = "LxAddTokenTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testAddTokenCreatesAPropertyInLx = function () {
    lex.addToken("T_FOO");
    this.assertTrue(typeof Lx.T_FOO != "undefined", "Token T_FOO should be defined");
  };
  
  this.testAddTokenGeneratesTokenValueHigherThan256 = function () {
    lex.addToken("T_FOO");
    this.assertTrue(Lx.T_FOO > 256, "Token value should be more than 256");
  };
  
  this.testEachSubsequentTokenHasAHigherValue = function () {
    lex.addToken("T1");
    lex.addToken("T2");
    this.assertTrue(Lx.T1 < Lx.T2, "T2 should be higher than T1");
  };
  
};

LxAddTokenTest.prototype = new TestCase();
LxTestSuite.registerTest(LxAddTokenTest);
