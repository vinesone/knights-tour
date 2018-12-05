import React from 'react';
import classnames from 'classnames';

// API to check if a move is valid or not
const baseEndpointURL = 'https://knights-t.herokuapp.com/legalMove';


// Simple random number function
// with max and min values
function generateRandomNumber(min_value , max_value) {
  return Math.floor(Math.random() * (max_value-min_value) + min_value);
} 


// This should actually be a functional component
// Since no internal state updates are needed.
class Square extends React.Component { 

  render() {

    const { rowNum, 
            colNum, 
            hasBeenVisited,
            isOccupied, 
            onClick } = this.props;

    const isEvenCol = rowNum % 2 === 0;
    const isEvenRow = colNum % 2 === 0;
    // Flips the rules for alternating along the Y axis
    let isWhiteSquare = isEvenRow ? isEvenCol : !isEvenCol;
  
    const classes = classnames(`square col--${colNum} row--${rowNum}`, {
      'square--white': isWhiteSquare,
      'square--black': !isWhiteSquare,
      'square--occupied': isOccupied,
      'square--visited': hasBeenVisited
    })

    // Anonymous function set up to pass colNum and rowNum with click
    return (<div className={classes} 
                  onClick={() => onClick(rowNum, colNum)}>
              <span className='square__number-text'>{`[${colNum}-${rowNum}]`}</span>
              {isOccupied && <img className="knight" src='../knight.png'/>}
            </div>);
  }
}


export default class ChessBoard extends React.Component {

  constructor(props) {
    super(props);

    // Generate random location and push it onto 
    // the list of squares we visited
    const currentCol = generateRandomNumber(1, 8);
    const currentRow = generateRandomNumber(1, 8);
    const currentSquare = [currentCol, currentRow];

    this.state = {
      currentRow: currentRow,
      currentCol: currentCol,
      visitedSquares: [currentSquare]
    }
  }

  onMouseClick = (rowNum, colNum) => {

    // Spare API call if we've already 
    // visited the square - "bounce" the move
    // with a null op
    if (this.squareHasBeenVisited(colNum, rowNum)) {
      return;
    }

    const { currentCol, currentRow } = this.state;
    const postObject = { from: [currentCol, currentRow], to: [colNum, rowNum]}

    // This is the fun part that we didn't get to!
    fetch(baseEndpointURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postObject)
    })
    .then(response => response.json())
    .then(data => {
      const nextRow = data.to[1];
      const nextCol = data.to[0];

      if (data.isLegal) {
        const currentSquare = [nextCol, nextRow];
        const { visitedSquares } = this.state;
        visitedSquares.push(currentSquare);
        this.setState({ 
          currentRow: nextRow, 
          currentCol: nextCol,
          visitedSquares: visitedSquares
        });
      }
    })
  }

  // Method that checks through all 
  // visited squares and returns 
  // true if the proposed square 
  // has been visited already
  squareHasBeenVisited(colNum, rowNum) {
    const { visitedSquares } = this.state;

    for(let i = 0; i < visitedSquares.length; ++i) {
      if (colNum === visitedSquares[i][0] 
        && rowNum === visitedSquares[i][1]) {
        return true;
      }
    }

    return false;
  }

  // Subrender method to draw 
  // the tiles on the chessboard
  // passes game state down to the 
  // tiles, so they can render
  // their classnames 
  renderSquares = () => {
    const output = [];
    // --------------------------------------
    // Hi! One of the things that 
    // stuck out with our pairing exercise
    // was the post or pre increment for 
    // a javascript "for" loop!? 
    // (I've always used them interchangeably)
    // It made me curious to look into it more.
    // & What I found was Pre and post 
    // yield the same result because
    // the increments happen at the 
    // end of the loop after the comparison.
    // 
    // Stackoverflow: 
    // https://bit.ly/2FYaQEQ
    // --------------------------------------
    for(let i = 7; i > -1; --i) {
      for(let j = 0; j < 8; ++j) {
        const key = i.toString()+j.toString()
        const isOccupied = (i === this.state.currentRow) && (j === this.state.currentCol);
        const hasBeenVisited = isOccupied || this.squareHasBeenVisited(j,i);
        output.push(<Square 
                    key={key} 
                    rowNum={i} 
                    colNum={j} 
                    hasBeenVisited={hasBeenVisited}
                    onClick={this.onMouseClick}
                    isOccupied={isOccupied}/>);
      }
    }
    return output;
  }

  render() {

    const { visitedSquares } = this.state;
    const moveCount = visitedSquares.length - 1;
    const movesLeft = 63 - moveCount;
    const movesMsg = `Move: ${moveCount} : ${movesLeft} moves left.`;

    return (
      <div>
        <div className="chessboard">
          {this.renderSquares()}
        </div>
        <div className="move-count">{movesMsg}</div>
      </div>
    )
  }
}
