function nextCallback(data) {
  console.log(data);
}
function errorCallback(err) {
  console.log(err);
}
function completeCallback() {
  console.log('done');
}

function subscribe(nextCB, errorCB, completeCB) {
  // document.addEventListener('click', nextCB);

  // fetch(url).then(nextCB, errorCB);

  [10, 20, 30].forEach(nextCB);
}

subscribe(nextCallback, errorCallback, completeCallback);
