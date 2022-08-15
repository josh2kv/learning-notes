class Range {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    has(x) {
        return typeof x === "number" && this.from <= x && x <= this.to;
    }

    toString() {
        return `{x | ${this.from} ≤ x ≤ ${this.to}}`;
    }

    // Make a Range iterable by returning an iterator object.
    // Note that the name of this method is a special symbol, not a string.
    [Symbol.iterator]() {
        // Each iterator instance must iterate the range independently of others.
        // So we need a state variable to track our location in the iteration.
        // We start at the first integer >= from.
        let next = Math.ceil(this.from); // This is the next value we return
        let last = this.to; // We won't return anything > this

        return {
            // This is the iterator object.
            // This next() method is what makes this an iterator object.
            // It must return an iterator result object.
            next() {
                // If we haven't returned last value yet
                // return next value and increment it
                // otherwise indicate that we're done.
                return next <= last ? { value: next++ } : { done: true };
            },

            // As a convenience, we make the iterator itself iterable.
            [Symbol.iterator]() {
                return this;
            },
        };
    }
}

for (let x of new Range(1, 10)) {
    console.log(x); // Logs numbers 1 to 10
}
[...new Range(-2, 2)]; // => [-2, -1, 0, 1, 2]

function map(iterable, f) {
    let iterator = iterable[Symbol.iterator]();

    return {
        // This object is both iterator and iterable
        [Symbol.iterator]() {
            return this;
        },

        next() {
            let v = iterator.next();
            if (v.done) {
                return v;
            } else {
                return {
                    value: f(v.value),
                };
            }
        },
    };
}

[...map(new Range(1, 4), (x) => x * x)]; // => [1, 4, 9, 16]

function filter(iterable, predicate) {
    let iterator = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            for (;;) {
                let v = iterator.next();
                if (v.done || predicate(v.value)) {
                    return v;
                }
            }
        },
    };
}

[...filter(new Range(1, 10), (x) => x % 2 === 0)]; // => [2,4,6,8,10]
