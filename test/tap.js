var R = require('../source');
var eq = require('./shared/eq');
var listXf = require('./helpers/listXf');
var _curry2 = require('../source/internal/_curry2').default;
var assert = require('chai').assert;

describe('tap', function() {
  var pushToList = _curry2(function(lst, x) { lst.push(x); });

  it('returns a function that always returns its argument', function() {
    var f = R.tap(R.identity);
    eq(typeof f, 'function');
    eq(f(100), 100);
    eq(f(undefined), undefined);
    eq(f(null), null);
  });

  it("may take a function as the first argument that executes with tap's argument", function() {
    var sideEffect = 0;
    eq(sideEffect, 0);
    var rv = R.tap(function(x) { sideEffect = 'string ' + x; }, 200);
    eq(rv, 200);
    eq(sideEffect, 'string 200');
  });

  it('can act as a transducer', function() {
    var sideEffect = [];
    var numbers = [1,2,3,4,5];

    var xf = R.compose(R.map(R.identity), R.tap(pushToList(sideEffect)));

    eq(R.into([], xf, numbers), numbers);
    eq(sideEffect, numbers);
  });

  it('dispatches to transformer objects', function() {
    var sideEffect = [];
    var pushToSideEffect = pushToList(sideEffect);

    eq(R.tap(pushToSideEffect, listXf), {
      f: pushToSideEffect,
      xf: listXf
    });
  });

  it('dispatches to objects that implement `tap`', function() {
    var variableToSet;
    var sideEffect = x => { variableToSet = x + 1; };
    var obj = {x: 100, tap: function(f) { f(this.x); return this; }};
    assert.strictEqual(R.tap(sideEffect, obj), obj);
    assert.strictEqual(variableToSet, 101);
  });

  describe('into Promises', function() {
    const
      laterSucceed = (dt, value) => new Promise(resolve => setTimeout(resolve, dt, value)),
	    laterFail = (dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value));

    it("should execute the side effect in the success case", () => {
			var valueToSet;
			const begin = Date.now();

			return R.tap(x => {
				valueToSet = `${x}-bar`;
			})(laterSucceed(20, "foo"))
			.then(result => {
				assert.strictEqual(result, "foo");
				assert.strictEqual(valueToSet, "foo-bar");
				assert.approximately(Date.now() - begin, 20, 10);
			});
		});

		it("should not execute the side effect in failure", () => {
			var valueToRemain = "bar";
			const begin = Date.now();

			return R.tap(x => {
				valueToRemain = `unexpected value ${x}`;
			})(laterFail(20, "foo"))
			.then(
				() => assert.fail("should not succeed"),
				error => {
					assert.approximately(Date.now() - begin, 20, 10);
					assert.strictEqual(error, "foo");
					assert.strictEqual(valueToRemain, "bar");
				}
			);
		});

		it("should ignore exceptions in the side-effect", () =>
		  R.tap(_ => { throw new Error("side-effect exception"); }, Promise.resolve("foo"))
      .then(
        val => assert.strictEqual(val, "foo"),
        e => assert.fail(`Should not reject with ${e}`)
      )
    );
  });
});
