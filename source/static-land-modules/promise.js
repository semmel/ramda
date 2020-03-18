/**
 * consider-static-land: promise.js
 *
 * see https://medium.com/@JosephJnk/an-introduction-to-applicative-functors-aea966799b1d
 * https://funfix.org/api/exec/classes/future.html
 */

const
	// Applicative
	// of :: a -> Promise a
	of = value => Promise.resolve(value),

	ap_ = (fnPromise, aPromise) => fnPromise.then(fn => aPromise.then(fn)),
  // this implementation avoids the UnhandledPromiseRejection error
  // when Promise a fails
  // ap :: Promise (a -> b) -> Promise a -> Promise b
  ap = (fnPromise, aPromise) => {
    if (typeof Promise.allSettled === 'function') {
      return Promise.allSettled([fnPromise, aPromise])
      .then(([fnOutcome, anOutcome]) => {
        if ((fnOutcome.status === 'fulfilled') && (anOutcome.status === 'fulfilled')) {
          return fnOutcome.value(anOutcome.value);
        }
        else if (fnOutcome.status === 'fulfilled') {
          return Promise.reject(anOutcome.reason);
        }
        else if (anOutcome.status === 'fulfilled') {
          return Promise.reject(fnOutcome.reason);
        }
        else if (anOutcome.reason === fnOutcome.reason) {
          return Promise.reject(fnOutcome.reason);
        }
        else {
          const
            aggregateError = new Error(`${fnOutcome.reason.message},\n${anOutcome.reason.message}`);

          aggregateError.name = "AggregateError";

          if (anOutcome.reason.name === "AggregateError") {
            aggregateError.errors = anOutcome.reason.errors.concat([fnOutcome.reason]);
          }
          else if (fnOutcome.reason.name === "AggregateError") {
            aggregateError.errors = fnOutcome.reason.errors.concat([anOutcome.reason]);
          }
          else {
            aggregateError.errors = [fnOutcome.reason, anOutcome.reason];
          }

          return Promise.reject(aggregateError);
        }
      });
    }
    else {
      return ap_(fnPromise, aPromise);
    }
  },

	// map :: (a -> b) -> Promise a -> Promise b
	map = (fn, aPromise) => aPromise.then(fn),

	chain_ = (fn, value) => value.then(fn),
	// this implementation enforces fn to return a promise
	// chain :: (a -> Promise<b>) -> Promise a -> Promise b
	chain = (fn, aPromise) =>
		new Promise((resolve, reject) => {
			aPromise
			.then(a =>
				fn(a).then(resolve)
			)
			.catch(reject);
		}),

  // In this implementation an exception in the side-effect rubs off to the Promise
  // tap :: (a -> *) -> Promise a -> Promise a
  tap_ = (fn, p) =>
    p.then(x => {
      fn(x);
      return x;
    }),

  /**
	 * Execute a synchronous side effect.
   * In this implementation an exception in the side-effect is ignored.
	 * <pre>
	 * promise X ---------> X --->
	 *          \
	 *           - fn(X) -> Y
	 * </pre>
	 *
	 * @aka forEach
   */
  // tap :: (a -> *) -> Promise a -> Promise a
  tap = (fn, p) => {
    p.then(fn).catch(x => x);

    return p;
  };

export {
	of, ap, map, chain, tap
};
