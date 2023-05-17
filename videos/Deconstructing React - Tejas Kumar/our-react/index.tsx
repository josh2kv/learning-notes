let React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === 'function') {
      return tag(props);
    }

    const element = {
      tag,
      props: {
        ...props,
        children,
      },
    };
    console.log('element:', element);
    return element;
  },
};

const App = () => (
  <div className="react-2020">
    <h1>Hello, people!</h1>
    <input type="text" placeholder="name" />
    <p>nothing</p>
  </div>
);

App();
