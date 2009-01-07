/*****************************************************************************
 *
 * Copyright (c) 2003-2004 EcmaUnit Contributors. All rights reserved.
 *
 * This software is distributed under the terms of the EcmaUnit
 * License. See LICENSE.txt for license text. For a list of EcmaUnit
 * Contributors see CREDITS.txt.
 *
 *****************************************************************************/

// $Id: runtests.js 4680 2004-05-27 12:47:05Z philikon $

/*
  Test runner for command-line environments, such as spidermonkey
*/

function runTests() {
    reporter = new StdoutReporter();
    var testcase = new TestTestCase();
    testcase.initialize(reporter);
    testcase.runTests();

    var testcase2 = new TestTestCase2();
    testcase2.initialize(reporter);
    testcase2.runTests();

    var testsuite = new TestSuite(reporter);
    testsuite.registerTest(TestTestCase);
    testsuite.registerTest(TestTestCase2);
    testsuite.runSuite();
};

runTests();
