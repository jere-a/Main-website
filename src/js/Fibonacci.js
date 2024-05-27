/** Fibonacci 0.0.1 */
/**
 * Fibonacci 
 * 
 * @author Ryan Jones <rjchicago@gmail.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 RJChicago <rjchicago@gmail.com>
 */

// Fibonacci sequence = 0, 1, 1, 2, 3, 5, 8, 13, 21...
// See Wikipedia for information about the Fibonacci number:
// http://en.wikipedia.org/wiki/Fibonacci_number
/* const Fibonacci = {

    // Returns the Fibonacci value at the Nth index position.
    GetAt: function (n) {
        if (n < 2)
            return n;
        const nm1 = this.GetAt(n - 1);
        const nm2 = this.GetAt(n - 2);
        return nm1 + nm2;
    },

}
 */

const cache = {};

function fib(n) {
    if (n < 2) return n;
    
    if (!cache[n]) {
        const prevFib = fib(Math.floor(n - 1));
        const prevPrevFib = fib(Math.floor(n - 2));
        cache[n] = prevFib + prevPrevFib;
    }
    
    return cache[n];
}

export default fib;