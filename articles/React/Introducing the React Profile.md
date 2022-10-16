# Introducing the React Profiler

September 10, 2018 by Brian Vaughn

https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data

---

## Profiling an application

> **Note:**
> development(`react-dom` 16.5+)와 production(`react-dom/profiling`)에서 모두 profiling 가능
> [profiling in production mode](https://fb.me/react-profiling)

-   recording 중 DevTools는 app이 rendering할 때마다 performance 정보를 모은다.

## Reading performance data

### Browsing commits

-   개념적으로 React는 2 phase로 동작
    -   the **render** phase: DOM에 어떤 변화를 적용해야할 지 정하는 단계. `render` function을 call하고 그 결과를 이전 render와 비교
    -   the **commit** phase: 그 변화를 실제로 DOM에 적용하는 단계. `componentDidMount`와 `componentDidUpdate` call
-   profiler는 commit별로 performance 정보를 그룹화하여 bar chart로 표시
    ![commits in a bar chart](https://reactjs.org/static/bd72dec045515d59be51c944e902d263/d8f62/commit-selector.png)
    -   black: 현재 선택된 commit (blue로 바뀐 듯?)
-   막대의 길이가 길수록, 색이 노란색일수록 rendering이 오래 걸린 commit

### Filtering commits

-   특정 시간보다 적게 걸린 commit을 숨길 수 있음
-   ![filtering commits by time](https://reactjs.org/683b9d860ef722e1505e5e629df7ef7e/filtering-commits.gif)

### Flame chart

-   특정 commit에 대한 app의 상태를 나타냄
-   a bar: a React component
-   the width of a bar(_when the component last rendered_)
    -   해당 component(와 그 children)가 최근 rendering됐을 때 rendering에 소요된 시간
    -   길수록 rendering에 오래 걸린 것
    -   해당 component가 해당 commit의 일부로 re-rendering되지 않았다면 이전 rendering에 소요된 시간을 나타냄
-   the color of a bar(_as part of the current commit_)
    -   해당 component(와 그 children)가 해당 commit에서 rendering하는데 소요된 시간
    -   노란색일수록 오래걸림, 청록색일수록 덜 걸림, 회색: 렌더링 안했음
-   ![example](https://reactjs.org/static/3046f500b9bfc052bde8b7b3b3cfc243/ad997/flame-chart.png)
    -   해당 commit은 rendering에 총 18.4ms가 걸렸음
    -   `Router`가 가장 오래 걸림(18.4ms)
    -   그 시간을 대부분의 두 children이 소비함(`Nav`: 8.4ms, `Route`: 7.9ms)
    -   나머지 시간은 남은 children 또는 그 component의 render method에서 소비됨
-   어떤 경우는 commit들을 차례로 보는 것으로 왜 그 component가 rendering 됐는지 알수 있음
    -   ![stepping between commits](https://reactjs.org/cc2a8b37bbce52c49a11c2f8e55dccbc/see-which-props-changed.gif)
    -   예시에서 `state.scrollOffset`이 변했고 이 것이 `List` component의 re-render를 유발했다고 추측할 수 있음

### Ranked chart

-   rendering 시간별로 component들이 내림차순으로 정렬됨
-   해당 component와 그 children의 rendering 시간도 포함되므로 보통 tree의 상단 component가 가장 위에 있음

### Component chart
