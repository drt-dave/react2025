/**
 * A Promise in TypeScript represents an operation that will finish
 * in the future: it can either succeed (resolve) or fail (reject).
 * 
 * - resolve(value): the operation finished successfully, returns a value.
 * - reject(reason): the operation failed, returns an error or reason.
 * - .then(): runs if the promise was resolved successfully.
 * - .catch(): runs if the promise was rejected.
 * - .finally(): runs always, no matter if it resolved or rejected.
 * 
 * In this example, we simulate waiting 2 seconds (2000 ms)
 * before deciding if we get "money" or an "error".
 */
const myPromise = new Promise<number>((resolve, reject) => {
    // setTimeout simulates an asynchronous task that takes 2 seconds
    setTimeout(() => {
        // If we want to simulate success, we can use:
        // resolve(100); // means "I got 100 units of money"
        
        // But here we simulate failure:
        reject('Mi amigo se perdió'); 
    }, 2000); // time in milliseconds = 2 seconds
});

/**
 * Handling the promise:
 * 
 * - .then() gets the value if the promise resolves successfully.
 * - .catch() captures the reason if the promise rejects (fails).
 * - .finally() runs always, used for cleanup or final actions.
 */
myPromise
    .then((myMoney) => {
        // This will run if resolve() was called
        console.log(`Tengo mi dinero ${myMoney}`);
    })
    .catch((reason) => {
        // This will run if reject() was called
        console.warn(reason);
    })
    .finally(() => {
        // This will always run, regardless of success or failure
        console.log('Pues será seguir con mi vida');
    });
