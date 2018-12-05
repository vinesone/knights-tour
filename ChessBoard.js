import React from 'react';
import classnames from 'classnames';

const baseEndpointURL = 'https://knights-t.herokuapp.com/legalMove';

function generateRandomNumber(min_value , max_value) 
{
  return Math.floor(Math.random() * (max_value-min_value) + min_value);
} 


class Square extends React.Component { 

  render() {

    const { rowNum, 
            colNum, 
            hasBeenVisited,
            isOccupied, 
            onClick } = this.props;

    const isEvenCol = rowNum % 2 === 0;
    const isEvenRow = colNum % 2 === 0;
  
    let isWhiteSquare = isEvenRow ? isEvenCol : !isEvenCol;
  
    const classes = classnames(`square col--${colNum} row--${rowNum}`, {
      'square--white': isWhiteSquare,
      'square--black': !isWhiteSquare,
      'square--occupied': isOccupied,
      'square--visited': hasBeenVisited
    })

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

    const { currentCol, currentRow } = this.state;
    const postObject = { from: [currentCol, currentRow], to: [colNum, rowNum]}

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

      if (this.squareHasBeenVisited(nextCol, nextRow)) {
        return;
      }

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

  renderSquares = () => {
    const output = [];
  
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

    return (
      <div>
        <div className="chessboard">
          {this.renderSquares()}
        </div>
        <div className="move-count">{`Move: ${moveCount} : ${movesLeft} moves left.`}</div>
      </div>
    )
  }
}
