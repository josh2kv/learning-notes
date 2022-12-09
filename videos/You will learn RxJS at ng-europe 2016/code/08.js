function map(transformFn) {
  console.log('map method is being executing...');
  const inputObservable = this;
  const outputObservable = createObservable(function subscribe(outputObserver) {
    inputObservable.subscribe({
      next: function (x) {
        const y = transformFn(x);
        outputObserver.next(y);
      },
      error: e => outputObserver.error(e),
      complete: () => outputObserver.complete(),
    });
  });

  return outputObservable;
}

function filter(conditionFn) {
  console.log('filter method is being executing...');
  const inputObservable = this;
  const outputObservable = createObservable(function subscribe(outputObserver) {
    inputObservable.subscribe({
      next: function (x) {
        if (conditionFn(x)) {
          outputObserver.next(x);
        }
      },
      error: e => outputObserver.error(e),
      complete: () => outputObserver.complete(),
    });
  });

  return outputObservable;
}

function createObservable(subscribe) {
  return {
    subscribe: subscribe,
    map: map,
    filter: filter,
  };
}

const clickObservable = createObservable(function subscribe(ob) {
  document.addEventListener('click', ob.next);
  ob.complete();
});

const arrayObservable = createObservable(function subscribe(ob) {
  console.log(`I didn't execute subscribe method!`);
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

arrayObservable
  .map(x => x / 10)
  .filter(x => x !== 2)
  .subscribe(observer);
