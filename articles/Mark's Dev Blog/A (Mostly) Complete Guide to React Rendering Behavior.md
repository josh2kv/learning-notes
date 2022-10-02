# Blogged Answers: A (Mostly) Complete Guide to React Rendering Behavior

https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/

-   What is "Rendering"?
    -   Rendering Process Overview
    -   Render and Commit Phases
-   How Does React Handle Renders?
    -   Queuing Renders
    -   Standard Render Behavior
    -   Rules of React Rendering
    -   Component Metadata and Fibers
    -   Component Types and Reconciliation
    -   Keys and Reconciliation
    -   Render Batching and Timing
    -   Render Behavior Edge Cases
-   Improving Rendering Performance
    -   Component Render Optimization Techniques
    -   How New Props References Affect Render Optimizations
    -   Optimizing Props References
    -   Memoize Everything?
    -   Immutability and Rerendering
    -   Measuring React Component Rendering Performance
-   Context and Rendering Behavior
    -   Context Basics
    -   Updating Context Values
    -   State Updates, Context, and Re-Renders
    -   Context Updates and Render Optimizations
-   React-Redux and Rendering Behavior
    -   React-Redux Subscriptions
    -   Differences between connect and useSelector
-   Summary
-   Final Thoughts
-   Further Information

## What is "Rendering"?

-   **Rendering**: React가 component들에게 현재 props와 state의 조합을 토대로 자신들의 공간속 UI를 어떻게 나타내고 싶은지 묘사해달라고 요청하는 (일련의) 과정

### Rendering Process Overview

1. rendering process 동안 React는 root component에서 시작하여 component tree를 아래로 돌며 업데이트가 필요하다고 표시된 모든 component들을 찾음
2. React는 찾은 각 component에 대해 render function을 call하고 그 render out을 저장
    - class components: `classComponentInstance.render()`
    - function components: `FunctionComponent()` - function components 그 자체
3. **render output**

    - 보통 JSX로 작성됨
    - JS가 compile되고 deployment를 위해 준비될 때 `React.createElement()` calls로 변환됨
    - `React.createElement()`는 React *elements*를 return함
    - **React Elements**: 성취하고자 하는(intended) UI의 구조를 묘사하는 **plain JS objects**

        ```javascript
        // This JSX syntax:
        return <SomeComponent a={42} b="testing">Text here</SomeComponent>

        // is converted to this call:
        return React.createElement(SomeComponent, {a: 42, b: "testing"}, "Text Here")

        // and that becomes this element object:
        {type: SomeComponent, props: {a: 42, b: "testing"}, children: ["Text Here"]}
        ```

4. component tree를 전부 돌아 render output를 모두 모으면 그 새로운 object tree(virtual DOM)로 diff 작업을 함. 그 후 실제 DOM에 적용되어야 할 모든 변경사항을 계산하여 리스트를 만듬 -> **reconciliation**: this diffing and calculation process
5. 그 변경사항을 하나의 동기적 시퀀스(one synchronous sequence)로 DOM에 적용함

    > **Note**: React team은 최근 몇 년간 "virtual DOM"이라는 용어를 가볍게 사용해왔다. - Dan Abramov
    >
    > 이제는 "virtual DOM"이라는 용어를 폐기하길 바란다. 2013년에는 괜찮았다. 그런 용어를 사용하지 않으면 사람들이 React가 rendering할 때마다 DOM nodes를 만든다고 추측했기 때문에. 그러나 이제는 그렇게 생각하는 사람들이 거의 없다.
    >
    > "virtual DOM"은 일부 DOM issue를 위한 (완벽하지 않지만) 해결책인 것처럼 들린다. 그러나 React는 그런 것이 아니다. React는 "value UI"이다. React의 핵심원칙은 UI가 string이나 array와 같은 값(value)이라는 것이다. 당신은 그 것을 variable에 저장할 수 있고 전달할 수 있으며 JS control flow에 함께 사용할 수도 있다. 이렇게 표현함(expressiveness)이 요점이다. - DOM에 변경사항을 적용하는 것을 막기위한 어떤 diffing이 아니고
    >
    > 심지어 "virtual DOM"이 항상 DOM을 나타내는 것도 아니다. 예를 들어
    > `<Message recipientID={10}>`는 DOM이 아니다. 개념적으로 이 것은 lazy function calls을 나타낸다. `Message.bind(null, { recipientId: 10 })`

### Render and Commit Phases

-   React team은 rendering process를 개념적으로 두 단계로 분류함
    -   Render phase: component를 rendering하고 변경사항을 계산하는 모든 작업을 포함
    -   Commit phase: 그 변경사항을 DOM에 적용하는 과정
-   React는 commit phase에서 DOM을 업데이트한 뒤 모든 ref가 그에 맞게 requested DOM nodes와 component instances를 가리키도록 업데이트함
-   그리고 동기적으로 `componentDidMount`, `componentDidUpdate` class lifecycle methods 와 `useLayoutEffect` hooks를 실행함
-   그 후 짧은 timeout을 주고 모든 `useEffect` hooks를 실행함 - Passive Effects phase
-   [React lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

> [React's upcoming Concurrent Mode](https://17.reactjs.org/docs/concurrent-mode-intro.html)
>
> 브라우저가 event를 처리할 수 있도록 rendering phase에서 작업을 일시정지할 수 있음<br/>
> 그리고 적절하게 그 작업을 재개하거나 버리거나 나중에 다시 계산할 수 있음  
> render pass가 마무리되면 여전히 commit phase를 하나의 동기적으로 하나의 스텝에서 실행함

-   **rendering !== updating the DOM** -> component는 시각적으로 바뀌는 것 없이 rendering될 수 있음
    -   component는 이전과 같은 render output을 return할 수 있고 그러면 변경 필요없음
    -   Concurrent Mode에서는 component가 여러번 rendering될 수도 있고 다른 업데이트가 현재 완료한 작업을 무효화하면 각 render output들은 버려질 수도 있음

## How Does React Handle Renders?

### Queuing Renders

초기 rendering이 끝난 뒤 re-render를 예약(queue)할 수 있는 방법

-   Class components:
    -   `this.setState()`
    -   `this.forceUpdate()`
-   Function components:
    -   `useState`의 setters
    -   `useReducer`의 dispatches
-   Other:
    -   `ReactDOM.render(<App>)`를 다시 call === root component에서 `forceUpdate()` call

### Standard Render Behavior

-   **기본적으로 어떤 component(parent)의 rendering은 그 안의 모든 component(children)의 rendering을 유발한다.**
    -   component A > B > C > D 가 있고 B에서 `setState()`를 call한 경우 1. B의 re-render를 queue 2. component tree의 root에서 render pass 시작 3. A는 flag as needing updates되어 있지 않음을 확인, 지나쳐 내려감 4. B는 flag as needing updates되어 있으므로 내려가서 rendering, return `<C/>` 5. C는 flag as needing updates되어 있지 않지만 부모 component(B)가 rendering되었으므로 내려가서 C도 rendering. return `<D/>` 6. D는 flag as needing updates되어 있지 않지만 부모 component(C)가 rendering되었으므로 내려가서 D도 rendering
-   기본적으로 React는 부모 component가 rendering되었다면 **"props가 바뀌었는지 상관없이"** 자식 component도 rendering
-   즉, `<App/>`에서 `setState()` call하면 모든 component가 rendering됨
-   ["act like we're redrawing the entire app on every update"](https://www.slideshare.net/floydophone/react-preso-v2)(React의 초기 영업멘트(sales pitch) 중 하나)
-   **rendering은 나쁜 게 아니다. - React가 DOM을 변경해야하는지 아는 방법일 뿐**
    -   대부분의 component는 이전과 같은 render out을 return할 가능성이 높아서 React는 DOM을 변경할 필요가 없을 것임
    -   하지만 React는 여전히 component에게 rendering 해야하는지 물어봐야하고 render out을 diffing해야함. 둘다 시간과 노력이 들지만

### Rules of React Rendering

-   React의 주요 규칙 중 하나는 **Rendering은 "pure"해야하고 side effect가 존재해선 안된다**는 것
-   [The Rules of React](https://gist.github.com/sebmarkbage/75f0838967cd003cd7f9ab938eb1958f) - Sebastian Markbage
-   **Pure function**: 같은 input을 넣었을 때 항상 같은 값을 return하는 함수(idempotent, 아이듐포'우튼트).

    -   side effect가 없는 함수
    -   pure하지 않다고 항상 side effect를 가지는 것은 아님
    -   test하기 쉽고 추론하기 쉬우며 최적화나 리팩토링에 관한 모든 종류의 유용한 속성들을 가짐

        > [What does Side effects mean in React?](https://www.reddit.com/r/reactjs/comments/8avfej/what_does_side_effects_mean_in_react/)
        >
        > : 현재 실행되고 있는 함수의 scope 바깥에 영향을 미치는 모든 것<br/>
        > : 연산이 끝났을 때 연산자체의 return value외에 관측가능한 변화를 초래하는 모든 것
        >
        > -   closure-scoped variable을 수정하는 것
        > -   argument로 받은 array에 새로운 아이템을 추가하는 것
        > -   console.log()를 실행하는 것
        > -   `props`를 mutate하는 것
        > -   AJAX call 등등
        >
        > 예를 들어, side effect free function은 머리 속으로 혼자 생각하는 것과 같다. side effect는 생각한 것을 종이에 적거나 전화를 걸거나 구글링하는 것같은 행위와 같다.<br/>
        > 혼자서만 생각한다면 누구도 내가 무슨 생각을 하는 지 알 수 없고, 생각하다가 아무일도 없는 것처럼 생각을 멈출 수도 있다.<br/>
        > 하지만 내가 side effect를 갖는다면 필기된 종이, 전화를 받는 상대 또는 브라우저 방문기록을 가진다. 중간에 그 행위를 그만두더라도 나는 이미 더러워진 종이와 브라우저 방문기록은 가지게 된다. 그리고 내가 전화하는데 너무 오래걸린다면 상대는 전화를 받지 않을 수도 있다.(전화를 걸어도 상대가 받을지말지 나는 알수가 없다.)

-   React에서 pure해야하는 함수들: `constructor`, `setState`의 첫번째 인수, **`render`** 등

    -   Render logic _must not_:
        -   mutate 기존 variables and objects
        -   create random values ex) `Math.random()` or `Date.now()`
        -   make network request
        -   queue state updates
    -   Render logic _may_:
        -   mutate rendering 중 새로 만들어진 objects
        -   throw error
        -   "Lazy initialize" data(캐시된 value처럼 아직 만들어지지 않은 data)

-   React는 어플리케이션내에 모든 component instance를 추적하는 내부데이터구조를 저장함
-   이 데이터구조의 핵심부분은 "fiber"(퐈'이부어ㄹ)이라는 object이며 다음을 묘사하는 metadata field를 포함

    -   component tree내 어떤 지점에서 rendering되어야 할 component type
    -   해당 component와 연결된 현재 props와 state
    -   parent, sibling and child component를 가리키는 pointers
    -   rendering process를 추적하기 위해 React가 사용하는 기타 내부 metadata

-   [the definition of the Fiber type as of React 17](https://github.com/facebook/react/blob/v17.0.0/packages/react-reconciler/src/ReactFiber.new.js#L47-L174)
-   rendering pass 동안 React는 이 fiber object들을 가진 tree를 iterate하고 새로운 rendering 결과를 계산함에 따라 업데이트된 tree를 만듬
-   **이 "fiber" object들은 component의 실제 props와 state 값을 저장하고 있음**
    -   어떤 component에서 `props`와 `state`를 사용할 때 React는 그 fiber objects에 저장되어 있는 값에 대한 접근을 제공함
    -   class component에서 React는 어떤 component를 rendering하기 직전에 [새로운 props 값을 그 component로 복사함](https://github.com/facebook/react/blob/v17.0.0/packages/react-reconciler/src/ReactFiberClassComponent.new.js#L1038-L1042)
        -   `this.props`는 React가 자신 내부 데이터구조에서 reference를 복사해왔기 때문에 존재하는 것
        -   그런면에서 component는 일종의 facade(푸ㅎ싸'아드) over React's fiber objects
    -   React hooks도 비슷하게 동작.
        -   [React는 어떤 component를 위한 모든 hooks를 그 component의 fiber object에 linked list로 붙혀놓기 때문에](https://www.swyx.io/hooks/)
        -   React는 function component를 rendering 할 때, fiber에서 그 linked list of hook description entries를 가져옴
        -   그리고 another hook을 call 할 때마다 [hook description object에 저장된 그에 맞는 값들을 return(like `useReducer`를 위한 `state`와 `dispatch` 값)](https://github.com/facebook/react/blob/v17.0.0/packages/react-reconciler/src/ReactFiberHooks.new.js#L795)
    -   parent component가 child component를 최초로 rendering 할 때, React는 component의 instance를 추적하기 위한 fiber object를 만듬
        -   for class components, [`const instance = new YourComponentType(props)`](https://github.com/facebook/react/blob/v17.0.0/packages/react-reconciler/src/ReactFiberClassComponent.new.js#L653)
        -   for function components, [`YourComponentType(props)`](https://github.com/facebook/react/blob/v17.0.0/packages/react-reconciler/src/ReactFiberHooks.new.js#L405)

### Component Types and Reconciliation

### Keys and Reconciliation

### Render Batching and Timing

-   기본적으로 Raact는 `setState()`를 call을 할 때마다 새로운 render pass를 시작하며 그 것을 동기적으로 실행하고 return함
-   그와 더불어 React는 자동으로 *render batching*형태의 일종의 최적화를 적용
-   render batching: 여러 `setState()` call이 있을때 약간의 딜레이와 함께 하나의 render pass만을 queue에 넣고 실행하여 rendering을 일괄처리하는 것
-   [State Updates May Be Asynchronous](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous)
-   특히, React는 React event handler에서 발생하는 state update들을 자동으로 일괄처리함
    -   보통 React app에서 React event handler가 차지하는 비중이 매우 크기 때문에 대부분의 state update들은 일괄처리된다고 볼 수 있음
-   React는 event handler에 대한 render batching을 `unstable_batchedUpdates`라는 내부함수로 감싸는 방식으로 수행함

    -   React는 `unstable_batchedUpdates`가 실행되고 있는 동안 queue에 들어간 모든 state update들을 추적하여 나중에 그들을 하나의 render pass에 적용함
    -   React는 이미 주어진 event에 대하여 어떤 handler가 call되어야하는지 이미 알고 있기 때문에 이 것은 아주 잘 작동함

        ```javascript
        // PSEUDOCODE Not real, but kinda-sorta gives the idea
        function internalHandleEvent(e) {
            const userProvidedEventHandler = findEventHandler(e);

            let batchedUpdates = [];

            unstable_batchedUpdates(() => {
                // any updates queued inside of here will be pushed into batchedUpdates
                userProvidedEventHandler(e);
            });

            renderWithQueuedStateUpdates(batchedUpdates);
        }
        ```
