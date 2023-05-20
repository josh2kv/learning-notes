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

// Create and append a DOM element from a react element
const render = (reactElementOrStringOrNumber, container) => {
  // If a react element is a text node, it create a text node instead of the regular element and return
  if (['string', 'number'].includes(typeof reactElementOrStringOrNumber)) {
    const textNode = document.createTextNode(
      String(reactElementOrStringOrNumber),
    );

    return container.appendChild(textNode);
  }

  // Create a real DOM element to append
  const actualDomElement = document.createElement(
    reactElementOrStringOrNumber.teg,
  );

  // Add the properties from the react element except `children`
  if (reactElementOrStringOrNumber.props) {
    Object.keys(reactElementOrStringOrNumber.props)
      .filter(p => p !== 'children')
      .forEach(p => {
        actualDomElement[p] = reactElementOrStringOrNumber.props[p];
      });
  }

  // Render the children of the elements recursively
  if (reactElementOrStringOrNumber.props.children) {
    reactElementOrStringOrNumber.props.children.forEach(child => {
      render(child, actualDomElement);
    });
  }

  container.appendChild(actualDomElement);
};

const App = () => (
  <div className="react-2020">
    <h1>Hello, people!</h1>
    <input type="text" placeholder="name" />
    <p>nothing</p>
  </div>
);

render(<App />, document.getElementById('app'));
// App();
