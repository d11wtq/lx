function LxAddStateTest() {
  
  this.name = "LxAddStateTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testAddStateCreatesAPropertyInLx = function () {
    lex.addExclusiveState("STRING");
    this.assertTrue(typeof Lx.STRING != "undefined", "State STRING should be defined");
  };
  
  this.testAddedStatesHaveValuesHigherThanZero = function () {
    lex.addExclusiveState("STRING");
    this.assertTrue(0 < Lx.STRING, "State STRING should be higher than zero");
  };
  
  this.testEachAddedStateIsHigherThanThePrevious = function () {
    lex.addExclusiveState("STRING");
    lex.addExclusiveState("QUOTE");
    this.assertTrue(Lx.STRING < Lx.QUOTE, "State STRING should be less than state QUOTE");
  };
  
  this.testInitialStateHasZeroValue = function () {
    this.assertEquals(0, Lx.INITIAL, "State INITIAL should be zero");
  };
  
};

LxAddStateTest.prototype = new TestCase();
LxTestSuite.registerTest(LxAddStateTest);
