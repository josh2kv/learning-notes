function createObservable(subscribe) {
  return {
    subscribe: subscribe,
  };
}

const clickObservable = createObservable(function subscribe(ob) {
  document.addEventListener('click', ob.next);
  ob.complete();
});

const arrayObservable = createObservable(function subscribe(ob) {
  [10, 20, 30].forEach(ob.next);
  ob.complete();
});

const observer = {
  next: function nextCallback(data) {
    console.log(data);
  },
  error: function errorCallback(err) {
    console.log(err);
  },
  complete: function completeCallback() {
    console.log('done');
  },
};

arrayObservable.subscribe(observer);
