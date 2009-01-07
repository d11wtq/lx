function LxBeginTest() {
  
  this.name = "LxBeginTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testBeginSwitchesToTheNewState = function () {
    lex.addToken("T1");
    lex.addToken("T2");
    
    lex.addExclusiveState("FIND_T2");
    
    lex.addRule("a").action = function() {
      Lx.Begin(Lx.FIND_T2);
      return Lx.T1;
    };
    
    lex.addRule("a", Lx.FIND_T2).action = function() {
      Lx.Begin(Lx.INITIAL);
      return Lx.T2;
    };
    
    lex.In = "aaa";
    
    this.assertEquals(Lx.T1, lex.lex());
    this.assertEquals(Lx.T2, lex.lex());
    this.assertEquals(Lx.T1, lex.lex());
  };
  
};

LxBeginTest.prototype = new TestCase();
LxTestSuite.registerTest(LxBeginTest);
