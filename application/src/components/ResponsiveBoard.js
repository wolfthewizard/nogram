import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import Canvas, {Image} from 'react-native-canvas';
import Icon from 'react-native-vector-icons/FontAwesome';

const sizeX = 4;
const sizeY = 4;

const ResponsiveBoard = () => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [tiles, setTiles] = useState(
    [...Array(sizeY).keys()].map((rowN) =>
      [...Array(sizeX).keys()].map((colN) => ({
        triggered: false,
        pending: true,
      })),
    ),
  );
  const [ctx, setCtx] = useState(null);

  const tileDimensions = useMemo(
    () => ({x: dimensions.width / sizeX, y: dimensions.height / sizeY}),
    [dimensions],
  );

  useEffect(() => {
    if (tileDimensions && ctx) {
      tiles.forEach((row, rowN) =>
        row.forEach((tile, colN) => {
          if (tile.pending) {
            ctx.fillStyle = tile.triggered ? 'red' : 'gray';
            ctx.fillRect(
              tileDimensions.x * colN,
              tileDimensions.y * rowN,
              tileDimensions.x,
              tileDimensions.y,
            );
            setTiles((prevTiles) =>
              prevTiles.map((row, rowN2) =>
                row.map((tile, colN2) =>
                  colN2 === colN && rowN2 === rowN
                    ? {...tile, pending: false}
                    : tile,
                ),
              ),
            );
          }
        }),
      );
    }
  }, [tiles]);

  const handleCanvas = (canvas) => {
    if (canvas && dimensions.width !== 0 && !ctx) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      setCtx(ctx);

      ctx.font = '30px Arial';
      ctx.fillText('Hello World', 0, 10);

      const im = new Image(canvas);
      im.addEventListener('load', () => {
        console.log('henlo');
      });
      im.onload = () => {
        console.log('henlo');
        ctx.drawImage(im, 100, 100);
      };
      im.src = Icon.getImageSourceSync('close', 50).uri;
      console.log(Icon.getImageSourceSync('close', 50).uri);
    }
  };

  return (
    <View
      onLayout={(evt) => {
        const {x, y, width, height} = evt.nativeEvent.layout;
        setDimensions({width, height});
      }}
      style={{
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#d0d020',
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderStart={(evt) => {
        const x = evt.nativeEvent.pageX;
        const y = evt.nativeEvent.pageY;
        // console.log(`s x=${x}, y=${y}`);
        setTiles((prevTiles) =>
          prevTiles.map((row, rowN) =>
            row.map((tile, colN) =>
              Math.floor(x / tileDimensions.x) === colN &&
              Math.floor(y / tileDimensions.y) === rowN
                ? {...tile, triggered: true, pending: true}
                : {...tile, triggered: false},
            ),
          ),
        );
      }}
      onResponderMove={(evt) => {
        const x = evt.nativeEvent.pageX;
        const y = evt.nativeEvent.pageY;
        // console.log(`m x=${x}, y=${y}`);
        setTiles((prevTiles) =>
          prevTiles.map((row, rowN) =>
            row.map((tile, colN) =>
              Math.floor(x / tileDimensions.x) === colN &&
              Math.floor(y / tileDimensions.y) === rowN
                ? {...tile, triggered: true, pending: true}
                : {...tile, triggered: false},
            ),
          ),
        );
      }}
      //   onResponderEnd={(evt) => {
      //     setTiles((prevTiles) =>
      //       prevTiles.map((row) =>
      //         row.map((tile) => ({...tile, triggered: false, pending: true})),
      //       ),
      //     );
      //   }}
    >
      <Canvas ref={handleCanvas} style={{backgroundColor: 'purple'}} />
      {/* {tiles.map((row, i) => (
        <View style={{flexDirection: 'row'}} key={i}>
          {row.map((tile, j) => (
            <View
              style={{
                flex: 1,
                aspectRatio: 1,
                backgroundColor: tile.triggered ? 'red' : 'gray',
                margin: 1,
              }}
              key={j}></View>
          ))}
        </View>
      ))} */}
    </View>
  );
};

export default ResponsiveBoard;
