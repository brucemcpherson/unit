import { Exports } from './index.mjs';

const tests = () => {

/*

  const unit = Exports.newUnit({
    showErrorsOnly: false,
    codeLocationFormatOptions: {
      brief: true,
    }
  })


  unit.section ('difference between equal and deepequal', t=> {
    const a = {value: 1}
    const b = a
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
  
  unit.cancel()
  */
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
}

tests()