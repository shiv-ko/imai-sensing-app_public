import React, { useState } from 'react';

const Bingo: React.FC = () => {
  // 5x5のビンゴボードを作成するためのステート (boolean型の2次元配列)
  const [bingoBoard, setBingoBoard] = useState<boolean[][]>(Array(5).fill(Array(5).fill(false)));

  // ビンゴセルをクリックしたときのハンドラー
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newBoard = bingoBoard.map((row, rIdx) => 
      row.map((cell: boolean, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
    );
    setBingoBoard(newBoard);
  };

  return (
    <div>
      <h2>ビンゴボード</h2>
      <table>
        <tbody>
          {bingoBoard.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell: boolean, colIndex) => (
                <td
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '1px solid black',
                    backgroundColor: cell ? 'green' : 'white',
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bingo;
