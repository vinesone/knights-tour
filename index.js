
import React from "react";
import ReactDOM from "react-dom";

import ChessBoard from './ChessBoard.js';

import './main.scss';



// class ButtonComponent extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   onButtonClick = (e) => {
//     console.log('click Event', e);
//   }

//   render() {
//     return (<div className="button__component" onClick={this.onButtonClick}>This is a button</div>);
//   }
// }

// const Index = () => {
//   return <div>Hello React!<ButtonComponent/></div>;
// };

ReactDOM.render(<ChessBoard />, document.getElementById("react-root"))