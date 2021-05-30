import React from "react";
import "./App.css";
import Child from "./Child";
import ErrorComp from "./ErrorComp";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      b: 2,
      posts: [],
      showChild: false,
      errorMsg: "",
    };
    this.listRef = React.createRef();
  }

  componentDidCatch(error, errorInfo) {
    console.log("componentDidCatch", error, errorInfo);
    this.setState({errorMsg: "Error"});
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps", props, state);
    return props;
  }

  render() {
    if (this.state.errorMsg) {
      return <h1>Ошибка</h1>;
    }
    return (
      <div className="App">
        {this.state.a > 2 && <ErrorComp />}
        <button
          onClick={() => this.setState({ showChild: !this.state.showChild })}
        >
          Show Child
        </button>
        {this.state.showChild && <Child />}
        <p>{this.state.a}</p>
        <p>{this.state.b}</p>
        <button
          onClick={() => {
            console.log(this.state);
          }}
        >
          Просмотреть состояние
        </button>
        <ul ref={this.listRef}>
          {this.state.posts.map((post) => {
            return <li key={post.id}>{post.title}</li>;
          })}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    console.log("componentDidMount()");
    fetch("https://jsonplaceholder.typicode.com/posts/" + this.props.a)
      .then((response) => response.json())
      .then((json) => {
        const { posts } = this.state;
        posts.push(json);
        this.setState({ posts });
      });
    this.setState({ postIndex: ++this.postIndex });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate()");
    return nextProps.a === nextState.a;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate()");
    if (prevState.posts.length !== this.state.posts.length && this.listRef.current) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return prevState.a % 2 === 0 ? prevState : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate()");
    if (prevProps.a !== this.props.a) {
      fetch("https://jsonplaceholder.typicode.com/posts/" + this.props.a)
        .then((response) => response.json())
        .then((json) => {
          const { posts } = this.state;
          posts.push(json);
          this.setState({ posts });
        });
      this.setState({ postIndex: ++this.postIndex });
    }

    if (snapshot !== undefined && this.listRef.current !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
}

export default App;
