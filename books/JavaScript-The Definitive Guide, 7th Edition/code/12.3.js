// 한자리 소수들을 yield하는 A generator function
function* oneDigitPrimes() {
    yield 2;
    yield 3;
    yield 5;
    yield 7;
}

let primes = oneDigitPrimes();

primes.next(); // {value: 2, done: false}
primes.next(); // {value: 3, done: false}
primes.next(); // {value: 5, done: false}
primes.next(); // {value: 7, done: false}
primes.next(); // {value: undefined, done: true}
primes.next(); // {value: undefined, done: true}

// generators는 자신을 iterable하게 만들기 위해 Symbol.iterator method를 가지고 있음
primes[Symbol.iterator](); // primes

// generators는 다른 iterable처럼 사용할 수 있음
[...oneDigitPrimes()]; // [2, 3, 5, 7]

let sum = 0;
for (let prime of oneDigitPrimes()) sum += prime;
sum; // 17

// regular function뿐만 아니라 expression form으로도 사용 가능
const seq = function* (from, to) {
    for (let i = from; i <= to; i++) yield i;
};
[...seq(3, 5)]; // [3, 4, 5]

// class나 object literal에서는 function keyword를 생략하여 사용할 수도 있음
let o = {
    x: 1,
    y: 2,
    z: 3,
    *g() {
        for (let key of Object.keys(this)) yield key;
    },
};
[...o.g()]; //  ['x', 'y', 'z', 'g']

// iterable class를 만들 때도 사용하면 편함
// *[Symbol.iterator]() {
//   for(let i = Math.ceil(this.from); i <= this.to; i++)  return i
// }

// [Symbol.iterator]() {
//   let next = Math.ceil(this.from);
//   let last = this.to;

//   return {
//       next() {
//           return next <= last ? { value: next++ } : { done: true };
//       },

//       [Symbol.iterator]() {
//           return this;
//       },
//   };
// }

// Fibonacci sequence infinite loop
function* fibonacciSequence() {
    let x = 0,
        y = 1;
    // = while(true) = infinite loop
    for (;;) {
        yield y;
        // const newX = y
        // const newY = x + y
        // x = newX
        // y = newY
        [x, y] = [y, x + y]; // Note: destructuring assignment
    }
}

// Return the nth Fibonacci number
function fib(n) {
    for (let f of fibonacciSequence()) {
        if (n-- <= 0) return f;
    }
}

// Yield the first n elements of the specified iterable object
function* take(n, iterable) {
    let it = iterable[Symbol.iterator]();

    while (n-- > 0) {
        let next = it.next();

        if (next.done) return;
        else yield next.value;
    }
    // while (n > 0) {
    //     yield it.next().value;
    //     n--;
    // }
}

[...take(5, fibonacciSequence())];

// Given an array of iterables, yield their elements in interleaved(끼워넣다) order
function* zip(...iterables) {
    // Get an iterator for each iterable
    let iterators = iterables.map((i) => i[Symbol.iterator]());
    let index = 0;

    while (iterators.length > 0) {
        // If we reached the last iterator, go back to the first one
        if (index >= iterators.length) index = 0;

        let item = iterators[index].next();

        // If that iterator is done, then remove it from the array
        // Array.splice(교체시작index, 교체시작index부터 지울 element 개수)
        if (item.done) {
            iterators.splice(index, 1);
        } else {
            yield item.value;
            index++;
        }
    }
}

[...zip(oneDigitPrimes(), "ab", [0])]; //  [2, 'a', 0, 3, 'b', 5, 7]

function* sequence(...iterables) {
    for (let iterable of iterables) {
        for (let item of iterable) {
            yield item;
        }
    }
}

[...sequence("abc", oneDigitPrimes())]; //  ['a', 'b', 'c', 2, 3, 5, 7]

function* sequenceV2(...iterables) {
    for (let iterable of iterables) {
        yield* iterable;
    }
}

[...sequenceV2("abc", oneDigitPrimes())]; //  ['a', 'b', 'c', 2, 3, 5, 7]

// Error
function* sequenceV3(...iterables) {
    iterables.forEach((iterable) => yield * iterable);
}

[...sequenceV3("abc", oneDigitPrimes())]; //  ['a', 'b', 'c', 2, 3, 5, 7]
console.log("🚀", [...sequenceV3("abc", oneDigitPrimes())]);
