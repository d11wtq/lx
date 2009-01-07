function LxLessTest() {
  
  this.name = "LxLessTest";
  
  var lex;
  
  this.setUp = function () {
    lex = new LxAnalyzer();
  };
  
  this.testUsingLessPutsSpecifiedCharactersBackInInput = function () {
    lex.In = "abcd";
    lex.addRule(/[a-z]+/).action = function() {
      Lx.Echo();
      Lx.Less(1);
    };
    while (0 != lex.lex()) ;
    this.assertEquals("abcdbcdcdd", lex.Out) ;
  };
  
};

LxLessTest.prototype = new TestCase();
LxTestSuite.registerTest(LxLessTest);
