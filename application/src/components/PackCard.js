import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import Colors from '../data/Colors';
import requiredAssets from '../db/requiredAssets';
import ProgressBar from './ProgressBar';

const PackCard = ({packData, openPack}) => {
  return (
    <TouchableOpacity onPress={openPack}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Colors.gray,
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <View style={{flex: 0.65}}>
          <Image
            source={requiredAssets[packData.imgPath]}
            style={{width: '100%', height: '100%', resizeMode: 'center'}}
          />
        </View>
        <View
          style={{
            flex: 0.35,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 5 * global.fontSizeBase,
            }}>
            {packData.name}
          </Text>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 3 * global.fontSizeBase,
            }}>
            {packData.size}x{packData.size}
          </Text>
          <View style={{width: '80%'}}>
            <ProgressBar
              progress={packData.completedPuzzles / packData.totalPuzzles || 0}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PackCard;
