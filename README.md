# Test runner for apps script

This is a test runner along the lines of ava (but more primitive),for Apps Script but ported to Node. If you are developing Apps Script on Node with clasp, you can write tests using this and push the same code with (almost) no changes on Apps Script.

Apps script library id is
''''
1zOlHMOpO89vqLPe5XpC-wzA9r5yaBkWt_qFjKqFNsIZtNJ-iUjBYDt-x
''''

## install

````
npm i @brucemcpherson/unit
````

## use

The usage is the same as in Apps Script - with the addition of the import (which doesn't exist an Apps Script). Documentation below, and there are some examples in test.mjs - as below.

````
import {Exports} from '@brucemcpherson/unit';
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

    t.wildCardMatch("foo", "f*", { description: "for ava order tests wildcard is the expected" })
    unit.wildCardMatch("f*", "foo", { description: "for original order tests wildcard is the expected" })

    t.wildCardMatch ("foo","f*o")
    t.wildCardMatch ("foo","f?o")

    t.wildCardMatch ("/a/b/x.pdf", "**/*.pdf")
    t.notWildCardMatch ("/a/b/x.pdf", "*/*.pdf")
  })

  unit.section('rx stuff', t => {
    t.rxMatch("foo", /^F/i,  "for ava order rx is the expected" )
    unit.rxMatch(/.*O$/i, "foo",  "for original order rx wildcard is the actual" )
  })

  unit.report()
}

( async () => {
  await testTester ()
})();
````
## Related
- [Apps Script Unit tester now with ava style option](https://ramblings.mcpher.com/apps-script-unit-tester-now-with-ava-style-option/)
- [Apps Script Unit tester now supports promises](https://ramblings.mcpher.com/apps-script-unit-tester-now-supports-promises/)
- [An event emitter for Apps Script](https://ramblings.mcpher.com/an-event-emitter-for-apps-script/)
- [Simple but powerful Apps Script Unit Test library](https://ramblings.mcpher.com/gassnippets2/simple-unit-test-library/)
- [Paging large data sets and how to make Apps Script understand generators](https://ramblings.mcpher.com/paging-large-data-sets-and-how-to-make-apps-script-understand-generators/)
