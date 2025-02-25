import { Exports } from './index.mjs';

const tests = () => {



  const unit = Exports.newUnit({
    showErrorsOnly: false,
    codeLocationFormatOptions: {
      brief: true,
    }
  })




  console.log(unit.section ('difference between equal and deepequal', t=> {
    const a = {value: 1}
    const b = a
    const c = {...a}
    
    t.is (a,b)
    t.not (a,c,'because t.is uses equal by default')
    unit.cancel()
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

  }))
  


  unit.section('some tests', t => {
    t.not('bar', 'foo')
    t.true(1 === 1)
  })

  unit.cancel ()
  unit.section ('this section should be cancelled', t=> {
    t.is ('foo','bar')
  })

  unit.unCancel () 
  unit.section ('uncancelled again', t=> {
    const {eql} = t.is ('foo','bar')
    if (!eql) {
      t.cancel ()
    }
    t.is ('foo','bar','this one should be skipped')
  })

  unit.section('some more tests', t => {
    t.is('bar', 'bar')
    t.false(1 === 2)
  })
    
  unit.section('rx stuff', t => {
    t.rxMatch("foo", /^F/i,  "for ava order rx is the expected" )
    unit.rxMatch(/.*O$/i, "foo",  "for original order rx wildcard is the actual" )
  })

  unit.report()
}

tests()