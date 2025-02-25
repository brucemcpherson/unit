# Unit - Code test runner - works on both Apps Script and Node

This Unit tester was originally an Apps Script thing, but is also now available on Node to make developing and testing Apps Script projects on Node with [clasp](https://developers.google.com/apps-script/guides/clasp) a little more practical. The same code runs on both.

It uses [code-locator](https://ramblings.mcpher.com/report-current-running-node-and-apps-script-code/) to report the actual code in test pass/fail reports.

You can also use it as a simple test runner for exclusively Node projects, or you may want to consider the very comprehensive [ava](https://github.com/avajs/ava) for exclusively Node projects.

## Installation

### Node

```
npm i @mcpher/unit
import {Exports} from '@mcpher/unit'
```

### Google Apps Script

Include this library - bmUnitTester

```
1zOlHMOpO89vqLPe5XpC-wzA9r5yaBkWt_qFjKqFNsIZtNJ-iUjBYDt-x
const {Exports} = bmCodeLocator
```

## API

### Structure

A test series is structured like this:

- Instanciate a Unit with optional [TestOptions](#testoptions)
- Create sections of related tests in a function with [TestOptions](#testoptions) that will be merged with any unit level options.
- Create individual tests with [TestOptions](#testoptions) that will be merged with the section and unit level options.

All options arguments are optional.

Each individual test compares actual with expect and returns a [TestResult](#testresult). A passing or failing test will casue things to happen according to the test options. At the end of each section a summary is shown, with an overall summary at the end of the unit.

### Example test function

A test function will look like this.

```
const tests = () => {
  const unit = Exports.newUnit ([unitOptions])
  unit.section ('some tests', t=> {
    t.not ('bar','foo'[,testOptions])
    t.true(1===1)
  }[, sectionOptions])

  unit.section ('some more tests', t=> {
    t.is ('bar','bar'[,testOptions])
    t.false(1===2)
  }[, sectionOptions])

  unit.report()
}
```

With no options specified, these tests 
````
  const unit = Exports.newUnit()
  unit.section('some tests', t => {
    t.not('bar', 'foo')
    t.true(1 === 1)
  })

  unit.section('some more tests', t => {
    t.is('bar', 'bar')
    t.false(1 === 2)
  })
    
  unit.report()
```` 

will give this verbose output

```
Starting section some tests
 0.0  test: 0 - passed
   Actual: bar
/home/bruce/bm/Unit/t.mjs
   4:     const unit = Exports.newUnit()
   5:     unit.section('some tests', t => {
   6:-->    t.not('bar', 'foo')
   7:       t.true(1 === 1)
   8:     })
 0.1  test: 1 - passed
   Actual: true
/home/bruce/bm/Unit/t.mjs
   5:     unit.section('some tests', t => {
   6:       t.not('bar', 'foo')
   7:-->    t.true(1 === 1)
   8:     })
   9:
Finished section some tests passes: 2 failures: 0 elapsed ms 8
Starting section some more tests
 1.0  test: 0 - passed
   Actual: bar
/home/bruce/bm/Unit/t.mjs
   9:
  10:     unit.section('some more tests', t => {
  11:-->    t.is('bar', 'bar')
  12:       t.false(1 === 2)
  13:     })
   1.1  test: 1 - passed (true test)
   Actual: false
/home/bruce/bm/Unit/t.mjs
  10:     unit.section('some more tests', t => {
  11:       t.is('bar', 'bar')
  12:-->    t.false(1 === 2)
  13:     })
  14:     unit.report()
Finished section some more tests passes: 2 failures: 0 elapsed ms 0
Section summary
 0: some tests passes:2 failures:0
 1: some more tests passes:2 failures:0
Total passes 4 (100.0%) Total failures 0 (0.0%)
ALL TESTS PASSED
Total elapsed ms 10
```

#### showing failures only

This is probably too verbose for most purposes, as you likely only really want to see tests that failed - like this.

```
  const unit = Exports.newUnit({
    showErrorsOnly: true,
  })
```

will produce this

```
Starting section some tests
Finished section some tests passes: 2 failures: 0 elapsed ms 5
Starting section some more tests
Finished section some more tests passes: 2 failures: 0 elapsed ms 0
Section summary
 0: some tests passes:2 failures:0
 1: some more tests passes:2 failures:0
Total passes 4 (100.0%) Total failures 0 (0.0%)
ALL TESTS PASSED
Total elapsed ms 6
```

#### using code locator formatting options

You can also adjust the verbosity and structure of the code reports with the options available in [code-locator](https://github.com/brucemcpherson/code-locator) like this

```
  const unit = Exports.newUnit({
    showErrorsOnly: false,
    codeLocationFormatOptions: {
      brief: true
    }
  })
```

Which will give this

```
Starting section some tests
 0.0   12:[/home/bruce/bm/Unit/t.mjs]-->    t.not('bar', 'foo') test: 0 - passed
   Actual: bar
 0.1   13:[/home/bruce/bm/Unit/t.mjs]-->    t.true(1 === 1) test: 1 - passed
   Actual: true
Finished section some tests passes: 2 failures: 0 elapsed ms 19
Starting section some more tests
 1.0   17:[/home/bruce/bm/Unit/t.mjs]-->    t.is('bar', 'bar') test: 0 - passed
   Actual: bar
 1.1   18:[/home/bruce/bm/Unit/t.mjs]-->    t.false(1 === 2) test: 1 - passed
   Actual: false
Finished section some more tests passes: 2 failures: 0 elapsed ms 0
Section summary
 0: some tests passes:2 failures:0
 1: some more tests passes:2 failures:0
Total passes 4 (100.0%) Total failures 0 (0.0%)
ALL TESTS PASSED
Total elapsed ms 20

```

### Methods and properties

#### Exports.newUnit (TestOptions)

Create a unit test instance

| parameter | type                        | default                              | description                              |
| --------- | --------------------------- | ------------------------------------ | ---------------------------------------- |
| options   | [TestOptions](#testoptions) | [test option defaults](#testoptions) | default options to apply to all sections |

##### returns

Instance of Unit

#### unit.section (description, tests , options )

Introduce a section, containing a series of tests. For example

```
unit.section ('a bunch of tests', t=> {
  t.is (foo, 'foo')
  t.not(foo, 'bar')
} , options)
```

If you prefer to specify the description in the section options, this is equivalent.

```
unit.section (t=> {
  t.is (foo, 'foo')
  t.not(foo, 'bar')
} , {
  descripton: 'a bunch of tests'
})
```

| parameter   | type            | default                              | description                                                                                   |
| ----------- | --------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| description | string          | the section number                   | options to apply to the test                                                                  |
| tests       | function        | t=> {}                               | a function that runs a collection of tests - t is an instance of Unit private to this section |
| options     | [TestOptions](#testoptions) | [test option defaults](#testoptions) | options to apply to all tests in this section merged with default options                     |

#### t.is (actual, expect, options)

Compare actual to expect and registers a failure if they are not equal. By default the compare function is [equal](#equal). If you prefer you can set the  compare of t.is to deepEqual, or indeed any compare function that returns true or false.

```
    t.is (a,c, {
      compare:  t.compares.deepEqual,
    })
```

Here's some examples to illustrate the difference between is/equal/DeepEqual and not/notEqual/notDeepEqual, as well as how to use custom comparison functions. Each of these tests would pass.

```
   unit.section ('difference between equal and deepequal', t=> {
    const a = {value: 1}
    
    // a and b are .equal
    const b = a
    
    // a and c are .notEqual but are .deepEqual
    const c = {...a}

    t.is (a,b)
    t.not (a,c,'because t.is uses equal by default')

    t.deepEqual (a,b)
    t.deepEqual (a,c)

    t.equal (a,b)
    t.notEqual (a,c)

    t.is (a,c, {
      compare:  t.compares.deepEqual,
      description: 'use deepequal for t.is and t.not'
    })

    t.is ('a','A', {
      compare: (a,b) => a.toLowerCase() === b.toLowerCase(),
      description: 'provide any comparison function'
    })

    t.is ('a','A', {
      compare: (a,b) => t.compares.rxMatch (a, new RegExp(b,"i"))
    })

  })
```

gives this result

```
Starting section difference between equal and deepequal
Finished section difference between equal and deepequal passes: 9 failures: 0 elapsed ms 5
Section summary
 0: difference between equal and deepequal passes:9 failures:0
Total passes 9 (100.0%) Total failures 0 (0.0%)
ALL TESTS PASSED
Total elapsed ms 5
```

| parameter | type            | default                              | description                                                                                   |
| --------- | --------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| actual    | \*      |           | the actual value to test                                                                |
| expect    | *       |           | the value to test against |
| options   | [TestOptions](#testoptions) | [test option defaults](#testoptions) | options to apply to this test merged with section and default options                     |

##### returns

[TestResult](#TestResult)

For example

```
const {actual} = t.is (x*2, y)
// actual will contain x*2
```

#### t.not (actual, expect, options)

Inverse of t.is - see t.is for explanations

#### t.deepEqual (actual, expect, options)

The default compare function here deepEqual. This will treat objects with the same content as equal and return a pass if they are. See t.is for details.

#### t.notDeepEqual (actual, expect, options)

The default compare function here deepEqual. This will treat objects with the same content as equal and return a pass if they are not. See t.is for details.

#### t.equal (actual, expect, options)

This is the default comparison function for t.is, and will return a pass only if the objects are 'JavaScript' equal. See t.is for default

#### t.notEqual (actual, expect, options)

See t.equal for details. This its inverse.

#### t.true (actual, options)

This will do a strict Boolean test on actual and treat as a pass if it is true.

#### t.false (actual, options)

The inverse of t.true

#### t.truthy (actual, options)

The will do a Boolean conversion on actual and treat as a pass if the result is true.

#### t.falsey (actual, options)

The inverse of t.truthy

#### t.hasWildCards (actual, options)

Unit can support wildcards * and ? as well as globs (for example **/node_modules). This test will return true if actual contains any wildcards. For example
````
  t.hasWildCards("f*")
````

#### t.notHasWildCards (actual, options)

The inverse of t.hasWildCards. For example
````
  t.notHasWildCards("foo")
````
#### t.wildCardMatch (text, wildcardText) 

This will pass if text matches the a potentially wildcardText spec - for example
````
    t.wildCardMatch("/a/b/x.pdf", "**/*.pdf")
    t.wildCardMatch ("foo", "foo")
````

#### t.notWildCardMatch (text, wildcardText) 

The inverse of t.wildCardMatch

#### t.rxMatch (text, regexp) 

This will pass if text matches the regular expression
````
    t.rxMatch("foo", /^F/i)
````

#### t.notRxMatch (text, wildcardText) 

The inverse of t.rxMatch

#### unit.cancel()

All tests and sections after this point will be skipped. You might want to use this is if there are any failures in a critical section. For example.
````
unit.section ('critical section', t=> {
  if (!t.is (foo, 'foo').eql) unit.cancel ()
  t.is ('bar', 'foo', 'this will be skipped')
})

unit.section ('these and subsequent sections will be skipped if it was cancelled in previous section', t=> {
  ...tests
})
````

#### t.cancel()

All remaining tests in this section will be cancelled. You might want to use this if other tests in the same section should be skipped on a failure of a preceding test - for example

````
unit.section ('using cancel in a section', t=> {
  const {eql} = t.is (foo, 'foo')
  if (!eql) {
    t.cancel ()
  }
  t.not (bar, foo, 'this will be skipped along with all the text tests in this section')
})
````
#### unit.unCancel () 

Reverses the effect of unit.cancel (). All remaining tests in this section and all remaining sections will be executed.

#### t.unCancel () 

Reverses the effect of t.cancel (). All remaining tests in this section will be executed.

#### t.compares

You can access some of the internal function so that you can alter the behavior of .is or .not. For example
````
  t.is ('foo', 'f*o', {
    compare: t.compares.deepEqual  
  })
````
Here are the exposed comparison functions
````
    this.compares = Object.freeze({
      equal: (actual, expect) => actual === expect,
      deepEqual: Exports.deepEquals,
      truthy: (actual) => !!actual, 
      true: (actual) => actual === true,
      // the util expects wildcard, text
      wildCardMatch: (a,b) => Exports.Utils.isMatch(b,a),
      hasWildCards: Exports.Utils.hasWildCards,
      rxMatch: (actual, expect) => {
        if (!Exports.Utils.isRx(expect)) {
          throw 'expect argument should be a regex'
        }
        return expect.test(actual)
      }
    })
````

### Async

Async/await syntax is supported on both Node and Apps Script. Apps Script supports Promises/await/async syntac but doesn't behave asynchronously. In order to avoid weirdness when running on Apps Script, you can still use await/async as normal but await each section - like this
````
await ('await async stuff on apps script', async t=> {
  t.is ('foo','bar')
})
````

### types

#### CodeReport

The code snippet applicable to this test. See [code-locator](https://github.com/brucemcpherson/code-locator) for details.

````
/**
 * CodeReport
 * @typedef {object} CodeReport
 * @property {CodeLocation} location report was created from
 * @property {string} formatted a printable string constructed according to the CodeLocationFormatOptions
 */
````

#### SectionData

The cumulative results for all the tests in a section.
````
/**
 * SectionData
 * @typedef {object} SectionData
 * @property {function} test the collection of tests to run on this section
 * @property {TestResult[]} results all the results for each individual test so far
 * @property {number} number the section index starting at 0
 * @property {TestOptions} options the options for thos section
 * @property {number} startTime timestamp for when this section started
 * @property {boolean} isAsync whether this is an async section
 */
````

#### TestResult

The result of an individual test.
````
/**
 * TestResult
 * @typedef {Object} TestResult
 * @property {TestOptions} options - the test options
 * @property {SectionData} section - The section this result belongs to
 * @property {number} testNumber - Serial number within the section
 * @property {boolean} eql - whether actual equals expect using the compare function (default deep equality)
 * @property {boolean} failed - whether the test failed
 * @property {boolean} jsEqual whether expect === actual (vanilla javascript equality)
 * @property {*} expect - the expect value
 * @property {*} actual - the actual value
 * @property {CodeReport} codeReport = the location of the calling test
 */
````

#### CodeLocationFormatOptions
The code snippet formatting options. Can be appkied at Unit, Section or Test level via the .codeLocationFormatOptions property of TestOptions.  See [code-locator](https://github.com/brucemcpherson/code-locator) for details.
````
/**
 * @typedef CodeLocationFormatOptions
 * @property {number} [lineOffset=0] offset from line - to point at for example the line before use -1
 * @property {number} [surroundBefore=2] how many lines to show before the target line
 * @property {number} [surroundAfter=2] how many lines to show after the target line
 * @property {boolean} [showFileName=true] whether to show the filename
 * @property {boolean} [showLineNumber=true] whether to show line numbers
 * @property {boolean} [brief=false] brief only prints the target line and igmores sourround params and uses a concise format
 * @property {number}  [lineNumberWidth=4] width of line number space
 * @property {string} [pointer='--> '] point at target line
 */

````
#### TestOptions
The test formatting options. Can be appkied at Unit, Section or Test level.
````
/**
 * @typedef {Object} TestOptions
 * @property {function} [compare = this.defaultCompare] - function to compare expect to actual
 * @property {boolean} [invert = false] - whether success is that expect !== actual
 * @property {string} [description = ''] - The test description
 * @property {boolean} [neverUndefined = true]  - if actual is ever undefined it's a failure
 * @property {boolean} [neverNull = false]  - if actual is ever null it's a failure
 * @property {boolean} [showErrorsOnly = false]  - only verbose if there's an error
 * @property {number} [maxLog = Infinity]  - max number of chars to log in report
 * @property {boolean} [showValues = true] - show values in reports
 * @property {CodeLocationFormatOptions} [codeLocationFormatOptions] - how to report code content
 */
````

## Related

- [Report current running Node and Apps Script code](https://ramblings.mcpher.com/report-current-running-node-and-apps-script-code/#google_vignette)
- [Apps Script Unit tester now with ava style option](https://ramblings.mcpher.com/apps-script-unit-tester-now-with-ava-style-option/)
- [Apps Script Unit tester now supports promises](https://ramblings.mcpher.com/apps-script-unit-tester-now-supports-promises/)
- [An event emitter for Apps Script](https://ramblings.mcpher.com/an-event-emitter-for-apps-script/)
- [Simple but powerful Apps Script Unit Test library](https://ramblings.mcpher.com/gassnippets2/simple-unit-test-library/)
- [Paging large data sets and how to make Apps Script understand generators](https://ramblings.mcpher.com/\
paging-large-data-sets-and-how-to-make-apps-script-understand-generators/)
- [A POC implementation of Apps Script Environment on Node](https://ramblings.mcpher.com/a-proof-of-concept-implementation-of-apps-script-environment-on-node/)

