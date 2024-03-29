function map(transformFn) {
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

function delay(period) {
  const inputObservable = this;
  const outputObservable = createObservable(function subscribe(outputObserver) {
    inputObservable.subscribe({
      next: function (x) {
        setTimeout(function () {
          outputObserver.next(x);
        }, period);
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
    delay: delay,
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

clickObservable
  .map(ev => ev.clientX)
  .filter(x => x < 200)
  .delay(2000)
  .subscribe(observer);
