import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Loader() {
    return (
        <View style = {styles.container}>
            <ActivityIndicator size = "large" color = "#228B22" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
        position: 'absolute',
        backgroundColor: '#228B22',
        opacity: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    } 
})