# Unit - Code test runner - works on both Apps Script and Node

This Unit tester was originally an Apps Script thing, but is also now available on Node to make developing and testing Apps Script projects on Node with [clasp](https://developers.google.com/apps-script/guides/clasp) a little more practical. The same code runs on both.

It uses [code-locator](https://ramblings.mcpher.com/report-current-running-node-and-apps-script-code/) to report the actual code in test pass/fail reports.

You can also use it as a simple test runner for exclusively Node projects, although [ava](https://github.com/avajs/ava) is more comprehensive for that.

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

A test series is structured like this

- Instanciate a Unit with optional [TestOptions](#testoptions)
- create sections of related tests in a function with [TestOptions](#testoptions) that will be merged with any unit level options.
- create individual tests with [TestOptions](#testoptions) that will be merged with the section and unit level options.

All options arguments are optional.

Each individual test compares actual with expect and returns a [TestResult](#testresult). A passing or failing test will casue things to happen according to the test options. At the end of each section a summary is shown, with an overall summary at the end of the unit.

### example test function

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

### Exports.newUnit (TestOptions)

Create a unit test instance

| parameter | type                        | default                              | description                              |
| --------- | --------------------------- | ------------------------------------ | ---------------------------------------- |
| options   | [TestOptions](#testoptions) | [test option defaults](#testoptions) | default options to apply to all sections |

#### returns

Instance of Unit

### unit.section (description, tests , options )

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
| options     | [TestOptions]{} | [test option defaults](#testoptions) | options to apply to all tests in this section merged with default options                     |

### t.is (actual, expect, options)

Compare actual to expect and registers a failure if they are not equal. By default the compare function is [equal](#equal). If you prefer you can set the default compare of t.is to deepEqual.

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

#### returns

[UnitResult](#UnitResult)

For example

```
const {actual} = t.is (x*2, y)
// actual will contain x*2
```

### t.not (actual, expect, options)

Inverse of t.is - see t.is for explanations

### t.deepEqual (actual, expect, options)

The default compare function here deepEqual. This will treat objects with the same content as equal and return a pass if they are. See t.is for details.

### t.notDeepEqual (actual, expect, options)

The default compare function here deepEqual. This will treat objects with the same content as equal and return a pass if they are not. See t.is for details.

### t.equal (actual, expect, options)

This is the default comparison function for t.is, and will return a pass only if the objects are 'JavaScript' equal. See t.is for default

### t.notEqual (actual, expect, options)

See t.equal for details. This its inverse.

### t.true (actual, options)

This will do a strict Boolean test on actual and treat as a pass if it is true.

### t.false (actual, options)

The inverse of t.true

### t.truthy (actual, options)

The will do a Boolean conversion on actual and treat as a pass if the result is true.

### t.falsey (actual, options)

The inverse of t.truthy

### t.hasWildCards (actual, options)

Unit can support wildcards * and ? as well as globs (for example **/node_modules). This test will return true if actual contains any wildcards. For example
````
  t.hasWildCards("f*")
````

### t.notHasWildCards (actual, options)

The inverse of t.hasWildCards. For example
````
  t.notHasWildCards("foo")
````
### t.wildCardMatch (text, wildcardText) 

This will pass if text matches the a potentially wildcardText spec - for example
````
    t.wildCardMatch("/a/b/x.pdf", "**/*.pdf")
    t.wildCardMatch ("foo", "foo")
````

### t.notWildCardMatch (text, wildcardText) 

The inverse of t.wildCardMatch

### t.rxMatch (text, regexp) 

This will pass if text matches the regular expression
````
    t.rxMatch("foo", /^F/i)
````


### t.notRxMatch (text, wildcardText) 

The inverse of t.rxMatch

### t.compares

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


### whoCalled ([depth, options])

This is the same as [CodeLocator.getCode()](#getcode) except it also logs the result to console.info

| parameter | type                                                   | default                                          | description                                  |
| --------- | ------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------- |
| depth     | number                                                 | 1                                                | the stack depth to report at.                |
| options   | [CodeLocationFormatOptions](CodeLocationFormatOptions) | [formatting defaults](CodeLocationFormatOptions) | how to format the code locator report string |

#### returns

[CodeReport](#codereport)

### setFormatOptions ([options])

You can temporarily reset some of the [default options](#codelocationformatoptions).

| parameter | type                                                   | default                                          | description                                  |
| --------- | ------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------- |
| options   | [CodeLocationFormatOptions](CodeLocationFormatOptions) | [formatting defaults](CodeLocationFormatOptions) | how to format the code locator report string |

#### returns

[CodeLocationFormatOptions](CodeLocationFormatOptions)

### getCodeContent (fileName)

It uses a cache to store the code from files. This function will retrieve the code either from cache if it can, or will read from a file. It'll automatically adjust its fetch technique according to whether we're using Gas or Node. You don't normally need to call this unless you want to do something special with all the code content.

| parameter | type   | default | description                         |
| --------- | ------ | ------- | ----------------------------------- |
| filename  | string |         | the filename to get the content for |

#### returns

[CodeContent](#codecontent) []

## Additional methods to handle Google Apps Script ScriptApp

This only applies to Apps Script. Ignored in Node.

### setGetResource (ScriptApp.getResource)

To retrieve the code for a script file, we use the (undocumented) ScriptApp.getResource function, which can only access code in its own project script. Since CodeLocator is implemented as a library, you need to pass a function it can use to retrieve code from your script.

After importing CodeLocator, but before doing anything else, you'll need to do this if you want to return the code associated with a line in your own script. This is optional - without it will still report the line number and file name info, but won't be able to reproduce the underlying code.

```
CodeLocator.setGetResource (getResourceFunction)
```

| parameter           | type     | default | description                                                                      |
| ------------------- | -------- | ------- | -------------------------------------------------------------------------------- |
| getResourceFunction | function |         | Mandatory in Apps Script if you want code displayed - pass ScriptApp.getScriptId |

#### returns

function - the function you set

### getGetResource (id)

This only applies to Apps Script. Ignored in Node.

#### returns

function - the function you set

### setScriptId (id)

Only required for the edge case described below:

In the unlikely event you are using multiple libraries and want to report on them too, AND those libraries happen to have scripts with the same name, you'll need to provide a scriptId as well as a getResource function so that the caching algorithm can distingush between them

Remember also, the ScriptApp should belong to the script containing the code (which won't be yours if you are trying to extract code from a library so may not be available anyway)

As follows - this is optional and to handle a very specific edge case.

```
CodeLocator.setScriptId (ScriptApp.getScriptId())
```

| parameter | type   | default   | description                                                              |
| --------- | ------ | --------- | ------------------------------------------------------------------------ |
| id        | string | 'default' | A unique id, preferably the scriptId returned by ScriptApp.getScriptId() |

#### returns

string - the scriptId you set

### getScriptId (id)

Only required for the edge case described at the beginning of these docs

#### returns

string - the scriptId you set with setScriptId

### Types

#### TestOptions

Any of these options can be passed at constructor, section or individual test level. They merged and applied to each individual test

/\*\*

- @typedef {Object} TestOptions
- @property {function} [compare = this.defaultCompare] - function to compare expect to actual
- @property {boolean} [invert = false] - whether success is that expect !== actual
- @property {string} [description = ''] - The test description
- @property {boolean} [neverUndefined = true] - if actual is ever undefined it's a failure
- @property {boolean} [neverNull = false] - if actual is ever null it's a failure
- @property {boolean} [showErrorsOnly = false] - only verbose if there's an error
- @property {number} [maxLog = Infinity] - max number of chars to log in report
- @property {boolean} [showValues = true] - show values in reports
- @property {CodeLocationFormatOptions} [codeLocationFormatOptions] - how to report code content
  \*/

#### UnitResult

Each individual test returns this in case you want to reuse or investigate the result

/\*\*

- UnitResult
- @typedef {Object} UnitResult
- @property {TestOptions} options - the test options
- @property {UnitSection} section - The section this result belongs to
- @property {number} testNumber - Serial number within the section
- @property {boolean} eql - whether actual equals expect using the compare function (default deep equality)
- @property {boolean} failed - whether the test failed
- @property {boolean} jsEqual whether expect === actual (vanilla javascript equality)
- @property {\*} expect - the expect value
- @property {\*} actual - the actual value
- @property {CodeReport} codeReport = the location of the calling test
  \*/

#### CodeLocation

Describes a line extracted from the stack

```
/**
 * CodeLocation
 * @typedef CodeLocation
 * @property {number} depth the stack depth this came from
 * @property {string} file the file name the error was at
 * @property {number} line the line number it occurred at
 */
```

#### CodeLocationFormatOptions

Controls formatting of code reporting

```/**
 * CodeLocationFormatOptions
 * @typedef CodeLocationFormatOptions
 * @property {number} [lineOffset=0] offset from line - to point at for example the line before use -1
 * @property {number} [surroundBefore=2] how many lines to show before the target line
 * @property {number} [surroundAfter=2] how many lines to show after the target line
 * @property {boolean} [showFileName=true] whether to show the filename
 * @property {boolean} [showLineNumber=true] whether to show line numbers
 * @property {boolean} [brief=false] brief only prints the target line and igmores sourround params and uses a concise format
 * @property {number}  [lineNumberWidth=4] width of line number space
 * @property {string} [pointer='-->'] point at target line
 * @property {number} [defaultDepth=1] depth to report at if non specified
 */

```

#### CodeReport

A printable report on the selected code

```
/**
 * CodeReport
 * @typedef CodeReport
 * @property {CodeLocation} location report was created from
 * @property {string} formatted a printable string constructed according to the CodeLocationFormatOptions
 */
```

#### CodeContent

A line of code from a given filename

```
/**
 * CodeContent
 * @typedef CodeContent
 * @property {number} lineNumber 1 based line number in file
 * @property {string} text the code text
 */
```

## Examples

My original motivation for this was for enhancing my [unit tester](https://github.com/brucemcpherson/unit), but you can also use it anywhere you want to report which line of code made a call. Let's look at this example. I want to report on which line(s) of code make invalid calls to the math funcion.

```

const test3 = () => {

  const math = (prop, ...args) => {
    if (!Reflect.has(Math,prop)) {
      CodeLocator.whoCalled()
    }
    else {
      return Math[prop] (...args)
    }
  }

  math ("sqrt", 2)
  math ("rubbish", 0)
  math ("pow", 2, 3)
  math ("nonsense")
  math ("round", 1.3)

}

```

We get this result

```
/home/bruce/bm/code-locator/test/test.js
  13:
  14:      math ("sqrt", 2)
  15:-->   math ("rubbish", 0)
  16:      math ("pow", 2, 3)
  17:      math ("nonsense")
/home/bruce/bm/code-locator/test/test.js
  15:      math ("rubbish", 0)
  16:      math ("pow", 2, 3)
  17:-->   math ("nonsense")
  18:      math ("round", 1.3)
  19:
```

Here's the same thing but with the 'brief' option.

```
      CodeLocator.whoCalled(1, {
        brief: true
      })
```

gives

```
  36:[/home/bruce/bm/code-locator/test/test.js]-->   math ("rubbish", 0)
  38:[/home/bruce/bm/code-locator/test/test.js]-->   math ("nonsense")
```

Using depth 2 gives one level higher - so not so useful in this case.

```
      CodeLocator.whoCalled(2, {
        brief: true
      })
```

gives

```
  61:[/home/bruce/bm/code-locator/test/test.js]--> if (!CodeLocator.isGas) test4()
  61:[/home/bruce/bm/code-locator/test/test.js]--> if (!CodeLocator.isGas) test4()
```

Depth 0 shows the line that's actually calling for the reports, so again not usually very useful

```
      CodeLocator.whoCalled(0, {
        brief: true
      })
```

gives

```
  26:[/home/bruce/bm/code-locator/test/test.js]-->       CodeLocator.whoCalled(0, {
  26:[/home/bruce/bm/code-locator/test/test.js]-->       CodeLocator.whoCalled(0, {
```

#### setting temporary default options

As well as passing formatting options to the getCode() or whoCalled() functions, you can reset the default ones. See the example below.

```
const test5 = () => {

  // set some temporary default options
  CodeLocator.setFormatOptions ({
    brief: false,
    surroundAfter: 3,
    surroundBefore: 4,
    showFileName: true,
    lineNumberWidth: 2,
    pointer: 'wtf?? =>'
  })

  const bar='foo'

  if (bar !== 'bar') {
    CodeLocator.whoCalled (0)
  } else {
    CodeLocator.whoCalled (0)
  }

  // reset the default
  CodeLocator.setFormatOptions()

  if (bar !== 'bar') {
    CodeLocator.whoCalled (0)
  } else {
    CodeLocator.whoCalled (0)
  }
}

```

result

```
/home/bruce/bm/code-locator/code/test/test.js
15:
16:          const bar='foo'
17:
18:          if (bar !== 'bar') {
19:wtf?? =>    CodeLocator.whoCalled (0)
20:          } else {
21:            CodeLocator.whoCalled (0)
22:          }
/home/bruce/bm/code-locator/code/test/test.js
  26:
  27:     if (bar !== 'bar') {
  28:-->    CodeLocator.whoCalled (0)
  29:     } else {
  30:       CodeLocator.whoCalled (0)
```

#### wrapping

Instead of (or as well as) using setFormatOptions(), you can set the options argument to whoCalled to modify the options for a single call. If you have many of these, it might be worthwhile to create a wrapper function. However, remember that the stack depth will now need to be 1 more to account for your wrapper function.

```

const test6 = () => {

  const myLocator = (depth) => {
    // because we're wrapping this in another function,
    // we'll need a depth of 2 ro mimic the usual behavior
    CodeLocator.whoCalled (depth , {
      brief: true,
      defaultDepth: 2
    })
  }

  const adder = (a,b) => {
    if (a>b) {
      myLocator ()
    }
    return a+b
  }

  adder (1.2)
  adder (2,1)


}
```

result

```
  22:[/home/bruce/bm/code-locator/code/test/test.js]-->  adder (2,1)
```

#### lineOffset

This can be handy for reporting code inline.

```
const test7 = () => {
  const foo ='bar'
  if (foo !== 'foo') {
    CodeLocator.whoCalled(0, { lineOffset: -1, brief: true })
    return null
  }
  return foo
}
```

result

```
[/home/bruce/bm/code-locator/code/test/test.js]-->  if (foo !== 'foo') {
```

## Apps Script oddity

As previously mentioned, if you want to show code, you need to provide a way for this Apps Script project to retrieve it from its calling project.This little function is a good initializer to put in code that needs to run in both Apps Script and Node, and can be used unaltered in both.

```
const setFetcher = () => {
  // because a GAS library cant get its caller's code
  CodeLocator.setGetResource(ScriptApp.getResource)
  // optional - generally not needed - only necessary if you are using multiple libraries and some file sahre the same ID
  CodeLocator.setScriptId(ScriptApp.getScriptId())
}
```

It can be used at the beginning of your script like this

```
if (CodeLocator.isGas) setFetcher()
/// ... your code
```

If you choose not to enable this, you'll get an initial report like this

```
...cant get code from an apps script library
...from your main script,call CodeLocator.setGetResource(ScriptApp.getResource)
```

and code reports will still work, but look like this

```
code/test/test   81: --> No code available
```

#### Acknowledgements

The inspiration for following the stack came from https://github.com/hapijs/pinpoint, and for showing the surrounding lines of code https://github.com/avajs/ava

# Test runner for apps script

This is a test runner along the lines of ava (but more primitive),for Apps Script but ported to Node. If you are developing Apps Script on Node with clasp, you can write tests using this and push the same code with (almost) no changes on Apps Script.

Apps script library id is
''''
1zOlHMOpO89vqLPe5XpC-wzA9r5yaBkWt_qFjKqFNsIZtNJ-iUjBYDt-x
''''

## install

```
npm i @mcpher/unit
```

## use

The usage is the same as in Apps Script - with the addition of the import (which doesn't exist an Apps Script). Documentation below, and there are some examples in test.mjs - as below.

```
import {Exports} from '@mcpher/unit';
const testTester = () => {

  const unit = Exports.newUnit({
    showErrorsOnly: true,
  })

  const fix = {
    ob: { a: 1, b: 2 },
    nob: { a: 1, b: 2, c: 3 }
  }

  const u = Exports.Utils

  unit.section(async (t) => {

    unit.is('foo', 'foo')
    unit.not('foo', 'bar')
    t.is('foo', 'foo')
    t.not('foo', 'bar')
    const ob2 = fix.ob

    unit.is(fix.ob, ob2, { description: "unit does deepequal" })
    unit.is(fix.ob, { ...ob2 })
    t.is(fix.ob, fix.ob, { description: "t does js compare" })
    t.not(fix.ob, { ...ob2 })

    t.deepEqual([fix.ob], [{ ...ob2 }], 'deep equal tests same for both')
    t.notDeepEqual(fix.ob, fix.nob)
    unit.deepEqual([fix.ob], [{ ...ob2 }])
    unit.notDeepEqual(fix.ob, fix.nob)

  }, {
    description: 'some basics'
  })

  unit.section('try description as argument', t => {
    t.truthy(1)
    t.falsey(0)
  })

  unit.section('try description as argument', t => {
    unit.truthy('foo', { description: 'this is a test' })
    t.is('foo', 'foo', 'trying description ava style')
  }, {
    description: 'override text by description property',
    showErrorsOnly: false,
  })

  unit.section('wildcard stuff', t => {
    t.hasWildCards("f*")
    unit.notHasWildCards("foo")
    unit.hasWildCards("f?")
    unit.hasWildCards("f**")

    t.wildCardMatch("foo", "f*", { description: "for ava order tests wildcard is the expect" })
    unit.wildCardMatch("f*", "foo", { description: "for original order tests wildcard is the expect" })

    t.wildCardMatch ("foo","f*o")
    t.wildCardMatch ("foo","f?o")

    t.wildCardMatch ("/a/b/x.pdf", "**/*.pdf")
    t.notWildCardMatch ("/a/b/x.pdf", "*/*.pdf")
  })

  unit.section('rx stuff', t => {
    t.rxMatch("foo", /^F/i,  "for ava order rx is the expect" )
    unit.rxMatch(/.*O$/i, "foo",  "for original order rx wildcard is the actual" )
  })

  unit.report()
}

( async () => {
  await testTester ()
})();
```

## Related

- [Report current running Node and Apps Script code](https://ramblings.mcpher.com/report-current-running-node-and-apps-script-code/#google_vignette)
- [Apps Script Unit tester now with ava style option](https://ramblings.mcpher.com/apps-script-unit-tester-now-with-ava-style-option/)
- [Apps Script Unit tester now supports promises](https://ramblings.mcpher.com/apps-script-unit-tester-now-supports-promises/)
- [An event emitter for Apps Script](https://ramblings.mcpher.com/an-event-emitter-for-apps-script/)
- [Simple but powerful Apps Script Unit Test library](https://ramblings.mcpher.com/gassnippets2/simple-unit-test-library/)
- [Paging large data sets and how to make Apps Script understand generators](https://ramblings.mcpher.com/
  paging-large-data-sets-and-how-to-make-apps-script-understand-generators/)
