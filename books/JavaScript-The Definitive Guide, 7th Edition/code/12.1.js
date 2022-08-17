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
    let iterator /*2️⃣*/ = iterable[Symbol.iterator](); /*1️⃣*/
    /*3️⃣*/
    return {
        // This object is both iterator and iterable
        [Symbol.iterator]() {
            /*4️⃣*/
            return this;
        },

        next() {
            /*5️⃣*/ /* 5️⃣ ~ 6️⃣ 반복 */
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

const range1to4 = new Range(1, 4);
const mapResult = [...map(range1to4, /*6️⃣*/ (x) => x * x)]; // => [1, 4, 9, 16]
console.log(mapResult);

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

const range1to10 = new Range(1, 10);
const filterResult = [...filter(range1to10, (x) => x % 2 === 0)]; // => [2,4,6,8,10]
console.log("🚀 ~ filterResult", filterResult);

function words(s) {
    var r = /\s+|$/g; // 하나 이상의 공백이나 스트링의 끝
    r.lastIndex = s.match(/[^ ]/).index; // 공백이 아닌 첫번째 위치(시작위치)
    return {
        // Return an iterable iterator object
        [Symbol.iterator]() {
            // This makes us iterable
            return this;
        },
        next() {
            // This makes us an iterator
            let start = r.lastIndex; // Resume where the last match ended
            if (start < s.length) {
                // If we're not done
                let match = r.exec(s); // Match the next word boundary
                if (match) {
                    // If we found one, return the word
                    return { value: s.substring(start, match.index) };
                }
            }
            return { done: true }; // Otherwise, say that we're done
        },
    };
}
[...words(" abc def ghi! ")]; // => ["abc", "def", "ghi!"]
