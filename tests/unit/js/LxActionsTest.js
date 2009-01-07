function LxActionsTest() {
  
  this.name = "LxActionsTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testEofOrZeroIsReturnedForAnEmptyString = function () {
    lex.In = "";
    this.assertEquals(0, lex.lex()) ;
  };
  
  this.testDefaultReturnValueIsAsciiCharacterCode = function () {
    lex.In = "/abc";
    this.assertEquals(0x2F, lex.lex());
  };
  
  this.testTestEachCallReturnsTheNextDefaultToken = function () {
    lex.In = "123";
    this.assertEquals(0x31, lex.lex());
    this.assertEquals(0x32, lex.lex());
    this.assertEquals(0x33, lex.lex());
  };
  
  this.testEmptyActionsCauseLexingToSkipToNextToken = function () {
    lex.addRule('/');
    lex.In = "1/2///3";
    this.assertEquals(0x31, lex.lex());
    this.assertEquals(0x32, lex.lex());
    this.assertEquals(0x33, lex.lex());
  };
  
  this.testValuesCanBeReturnedByActions = function () {
    lex.addRule('/').action = function() {
      return 0x70; //Not 2F
    };
    lex.In = "1/2///3";
    this.assertEquals(0x31, lex.lex());
    this.assertEquals(0x70, lex.lex());
  };
  
  this.testEofOrZeroIsReturnedAtEndOfString = function () {
    lex.In = "...";
    lex.lex();
    lex.lex();
    lex.lex();
    this.assertEquals(0, lex.lex());
  };
  
};

LxActionsTest.prototype = new TestCase();
LxTestSuite.registerTest(LxActionsTest);
