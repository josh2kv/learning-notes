# André Staltz (@andrestaltz): You will learn RxJS at ng-europe 2016

### RxJS의 작동원리를 observable을 직접 만들어보며 설명함

![thumbnail](https://img.youtube.com/vi/uQ1zhJHclvs/maxresdefault.jpg)

- Creator: André Staltz
- Published : 2016
- Platform: YouTube
- [Video Link](https://youtu.be/uQ1zhJHclvs)

---

- RxJS는 다양한 callback function듣의 collection

## Callback Functions

- callback function은 asynchronous programming이 아님(callback은 sync or async 둘다 가능)

  ```js
  // cb function은 synchronous로 작동함
  const arr = [10, 20,30,40,50,60]

  console.log('before');
  arr.forEach(function cb(x) {
    console.log(x);
  })
  console.log('after');
  ```

- 여러개의 callback을 등록할 수 있음

  ```js
  // 2개의 callback을 등록함
  // data fetching은 여러 이유로 실패할 수도 있으므로 그 때를 위한 error callback
  const res = fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json())

  function successCallback(value) {
    console.log(`We got back ${value}`)
  }

  function failureCallback(value) {
    console.log(`:( ${err}`)
  }

  res.then(successCallback, failureCallback)
  ```

  ```js
  // nodejs에서는 3개의 callback을 등록하기도 함
  // stream data을 받을 때 그 크기가 얼마나 큰지 모르기 때문에 언제 끝날지 모름
  // 따라서 끝날 때를 위한 done callback 필요
  const readable = getReadableStreamSomehow()

  function nextDataCallback(chunk) {
    console.log(`Received ${chunk.length} bytes of data.`)
  }

  function errorCallback(err) {
    console.log(`Bad stuff happened: ${err}.`)
  }

  function doneCallback() {
    console.log('There will be no more data.')
  }

  readable.on('data', nextDataCallback)
  readable.on('error', errorCallback)
  readable.on('end', doneCallback)
  ```

## The Most Generic API For All Kinds Of Callbacks

- 그렇다면 callback function을 위한 범용적인 API을 만들어보면 어떨까?

  ```js
  function nextCallback(data) {
    console.log(data);
  }
  function errorCallback(err) {
    console.log(err);
  }
  function completeCallback() {
    console.log('done');
  }

  function giveMeSomeData(nextCB, errorCB, completeCB) {
    // 3가지 케이스 모두 사용가능
    // document.addEventListener('click', nextCB);
    // fetch(url).then(nextCB, errorCB);
    [10, 20, 30].forEach(nextCB);
  }

  // const data = giveMeSomeData() // synchronous로 데이터 받기
  // asynchronous로 데이터를 받을 때는 callback을 사용함
  // 데이터를 nextCallback으로 넘겨주세요~
  giveMeSomeData(nextCallback, errorCallback, completeCallback);
  ```

- 각각 3개의 callback 대신 그 callback들의 bundle인 하나의 object(`observer`)를 넘기면 어떨까?

  ```js
  function giveMeSomeData(ob) {
    [10, 20, 30].forEach(ob.next);
    ob.complete();
  }

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

  giveMeSomeData(observer);
  ```

- 데이터를 가져오는 함수의 이름을 바꾸고(`subscribe`) 그 것을 다른 object(`observable`)의 method로 넣는다면?

  ```js
  const observable = {
    // subscribe: 데이터를 주세요. 내가 받은 callback함수 bundle로 처리해줄게요.
    subscribe: function subscribe(ob) {
      [10, 20, 30].forEach(ob.next);
      ob.complete();
    },
  };

  // const clickObservable = {
  //   subscribe: function subscribe(ob) {
  //     document.addEventListener('click', ob.next)
  //     ob.complete();
  //   },
  // };

  // const arrayObservable = {
  //   subscribe: function subscribe(ob) {
  //     [10, 20, 30].forEach(ob.next);
  //     ob.complete();
  //   },
  // };

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

  observable.subscribe(observer);
  ```

- 여러 케이스에 맞게 `observable`을 만들 수 있는 helper function(`createObservable`)을 추가해볼 수도 있음

  ```js
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

  arrayObservable.subscribe(observer); // output: 10 20 30 done
  ```

- input으로 array를 가지기도 하니까 `observable`에 input observable을 새로운 output observable로 바꿔주는 `map`과 `filter` method를 추가해볼 수도 있음

  ```js
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

  function createObservable(subscribe) {
    return {
      subscribe: subscribe,
      map: map,
      filter: filter,
    };
  }

  // ~~~

  arrayObservable
    .map(x => x / 10)
    .filter(x => x !== 2)
    .subscribe(observer);   // output: 1 2 done
  ```

- `subscribe(observer)`를 주석처리하면 어떻게 될까?
  - 아무 일도 일어나지 않음
  - `arrayObservable`을 만들 때 `subscribe`를 `createObservable`의 argument로 넘겨줬지만 호출하지 않았으므로 object를 return하고 또다른 object를 return 할 뿐
  - method chaining을 통해 마지막에 return된 `outputObservable`의 `subscribe`를 `observer` argument와 함께 호출함

  ```js
  function map(transformFn) {
    console.log('map method is being executing...');
   
    // ~~~

    return outputObservable;

  }

  function filter(conditionFn) {
    console.log('filter method is being executing...');
   
    // ~~~

    return outputObservable;
  }

  // ~~~

  const arrayObservable = createObservable(function subscribe(ob) {
    console.log(`I didn't execute subscribe method!`);
    [10, 20, 30].forEach(ob.next);
    ob.complete();
  });

  // ~~~

  arrayObservable
  .map(x => x / 10)
  .filter(x => x !== 2)
  // .subscribe(observer);
  // output: map method is being executing...
  //         filter method is being executing...
  ```

- callback을 사용하는 events, promises, streams에 대해서도 모두 같은 방식으로 사용할 수 있음

  ```js
  // ~~~

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

  // ~~~

  clickObservable
    .map(ev => ev.clientX)
    .filter(x => x < 200)
    .delay(2000)
    .subscribe(observer);
  ```
