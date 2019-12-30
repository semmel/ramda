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
	// ap :: Promise (a -> b) -> Promise a -> Promise b
	ap = (fnPromise, aPromise) =>
		fnPromise.then(fn => aPromise.then(fn)),

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
		});

export {
	of, ap, map, chain
};
