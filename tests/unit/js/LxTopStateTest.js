function LxTopStateTest() {
  
  this.name = "LxTopStateTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testTopStateReturnsTheStateOnTheTopOfTheStateStack = function () {
    var topState;
    
    lex.addExclusiveState("A");
    lex.addExclusiveState("B");
    
    lex.addRule("a").action = function() {
      Lx.PushState(Lx.A);
    };
    
    lex.addRule("b", Lx.A).action = function() {
      Lx.PushState(Lx.B);
    };
    
    lex.addRule("c", Lx.B).action = function() {
      topState = Lx.TopState();
    };
    
    lex.In = "abc";
    
    lex.lex(); // INITIAL*, A
    lex.lex(); // INITIAL, A*, B
    lex.lex(); // INITIAL, A*, B
    
    this.assertEquals(Lx.A, topState, "Lx.TopState() should have returned " + Lx.A);
  };
  
};

LxTopStateTest.prototype = new TestCase();
LxTestSuite.registerTest(LxTopStateTest);
