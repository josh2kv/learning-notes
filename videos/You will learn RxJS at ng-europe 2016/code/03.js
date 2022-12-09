const res = fetch("https://jsonplaceholder.typicode.com/users/1").then((r) => r.json());

function successCallback(value) {
    console.log(`We got back ${value}`);
}

function failureCallback(value) {
    console.log(`:( ${err}`);
}

res.then(successCallback, failureCallback);
