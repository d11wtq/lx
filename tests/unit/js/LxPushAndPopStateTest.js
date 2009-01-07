function LxPushAndPopStateTest() {
  
  this.name = "LxPushAndPopStateTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testPushStateSwitchesToTheNewState = function () {
    lex.addToken("T1");
    lex.addToken("T2");
    
    lex.addExclusiveState("FIND_T2");
    
    lex.addRule("a").action = function() {
      Lx.PushState(Lx.FIND_T2);
      return Lx.T1;
    };
    
    lex.addRule("a", Lx.FIND_T2).action = function() {
      return Lx.T2;
    };
    
    lex.In = "aaa";
    
    this.assertEquals(Lx.T1, lex.lex());
    this.assertEquals(Lx.T2, lex.lex());
    this.assertEquals(Lx.T2, lex.lex());
  };
  
  this.testPopStateSwitchesToTheTopStateAndPopsTheStateStack = function() {
    lex.addToken("T1");
    lex.addToken("T2");
    
    lex.addExclusiveState("FIND_T2");
    
    lex.addRule("a").action = function() {
      Lx.PushState(Lx.FIND_T2);
      return Lx.T1;
    };
    
    lex.addRule("a", Lx.FIND_T2).action = function() {
      Lx.PopState();
      return Lx.T2;
    };
    
    lex.In = "aaa";
    
    this.assertEquals(Lx.T1, lex.lex());
    this.assertEquals(Lx.T2, lex.lex());
    this.assertEquals(Lx.T1, lex.lex());
  };
  
  this.testStackCanGrowAndShrinkMultipleLevels = function() {
    lex.addToken("OPEN_PAREN");
    lex.addToken("CLOSE_PAREN");
    lex.addToken("A");
    lex.addToken("A_IN_PAREN");
    
    lex.addExclusiveState("IN_PAREN");
    
    lex.addRule("a").action = function() {
      return Lx.A;
    };
    
    lex.addRule("a", Lx.IN_PAREN).action = function() {
      return Lx.A_IN_PAREN;
    };
    
    lex.addRule("(", [Lx.INITIAL, Lx.IN_PAREN]).action = function() {
      Lx.PushState(Lx.IN_PAREN);
      return Lx.OPEN_PAREN;
    };
    
    lex.addRule(")", Lx.IN_PAREN).action = function() {
      Lx.PopState();
      return Lx.CLOSE_PAREN;
    };
    
    lex.In = "a(((a)))a";
    
    this.assertEquals(Lx.A, lex.lex());
    this.assertEquals(Lx.OPEN_PAREN, lex.lex());
    this.assertEquals(Lx.OPEN_PAREN, lex.lex());
    this.assertEquals(Lx.OPEN_PAREN, lex.lex());
    this.assertEquals(Lx.A_IN_PAREN, lex.lex());
    this.assertEquals(Lx.CLOSE_PAREN, lex.lex());
    this.assertEquals(Lx.CLOSE_PAREN, lex.lex());
    this.assertEquals(Lx.CLOSE_PAREN, lex.lex());
    this.assertEquals(Lx.A, lex.lex());
  };
  
};

LxPushAndPopStateTest.prototype = new TestCase();
LxTestSuite.registerTest(LxPushAndPopStateTest);
