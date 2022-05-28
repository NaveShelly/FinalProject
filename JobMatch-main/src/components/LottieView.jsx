import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Lottie from 'lottie-react-native';

export default function LottieView(props) {

  const lottieRef = useRef(null); 

  useEffect(() => {
     lottieRef.current.play();
  })

  const { source } = props;

  return (
     <Lottie 
       resizeMode='cover'
       source = {source}
       ref = {lottieRef}
       style = {styles.lottie}
     />
  );
}

const styles = StyleSheet.create({
   lottie: {
      alignSelf: 'center',
      height: hp('31%'),
   } 
})