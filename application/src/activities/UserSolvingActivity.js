import React, {useState} from 'react';
import {View} from 'react-native';
import Board from '../components/Board';
import Modes from '../enums/SolveModes';
import ModeSwitch from '../components/ModeSwitch';

const UserSolvingActivity = () => {
  const [mode, setMode] = useState(Modes.UNCOVER);

  return (
    <View style={{alignItems: 'center'}}>
      <Board
        boardData={{
          width: 5,
          height: 5,
          fields: [
            [
              {hasPixel: false},
              {hasPixel: true, color: '#f0f0f0'},
              {hasPixel: false},
              {hasPixel: true, color: '#f0f0f0'},
              {hasPixel: false},
            ],
            [
              {hasPixel: false},
              {hasPixel: true, color: '#080808'},
              {hasPixel: false},
              {hasPixel: true, color: '#080808'},
              {hasPixel: false},
            ],
            [
              {hasPixel: false},
              {hasPixel: false},
              {hasPixel: false},
              {hasPixel: false},
              {hasPixel: false},
            ],
            [
              {hasPixel: true, color: '#d02020'},
              {hasPixel: false},
              {hasPixel: false},
              {hasPixel: false},
              {hasPixel: true, color: '#d02020'},
            ],
            [
              {hasPixel: false},
              {hasPixel: true, color: '#d02020'},
              {hasPixel: true, color: '#d02020'},
              {hasPixel: true, color: '#d02020'},
              {hasPixel: false},
            ],
          ],
        }}
        mode={mode}
      />
      <ModeSwitch mode={mode} setMode={setMode} />
    </View>
  );
};

export default UserSolvingActivity;
