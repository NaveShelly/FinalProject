import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { destroySibling } from '../helpers';

export default function AndroidModal({ title, option1, option2, onOption1Press, onOption2Press }) {
  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{title}</Text> 

        <View style={styles.optionsWrapper}>
           <Text onPress={onOption1Press} style={styles.optionTxt}>{option1}</Text>
           <Text onPress={onOption2Press} style={[styles.optionTxt, { borderTopWidth: 0 }]}>{option2}</Text>
           <Text onPress={() => destroySibling()} style={styles.backBtn}>back</Text> 
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
        position: 'absolute',
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionsWrapper: { 
        marginTop: '10%', 
        width: '100%' 
    },
    modalContainer: { 
        width: '90%', 
        height: '40%', 
        backgroundColor: '#228B22', 
        borderRadius: 10, 
        alignItems: 'center', 
        paddingTop: '8%' 
    },
    optionTxt: { 
        borderWidth: 1, 
        borderColor: 'gray', 
        textAlign: 'center', 
        height: '35%',
        fontSize: 18, 
        paddingTop: '8%' 
    },
    title: { 
        fontSize: 20, 
        fontWeight: '600', 
    },
    backBtn: { 
        color: 'red', 
        alignSelf: 'center', 
        fontSize: 18, 
        paddingTop: '5%' 
    }  
})