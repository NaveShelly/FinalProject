import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function ReceiverMessage({ message }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Image source={{ uri: message.photoURL }} style={styles.image} />
      <View style={styles.messageWrapper}>
        <Text style={styles.message}>{message.message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    messageWrapper: { 
      paddingHorizontal: '5%', 
      paddingVertical: '3%', 
      backgroundColor: '#000000', 
      borderTopLeftRadius: 0,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8, 
      alignItems: 'center', 
      justifyContent: 'center', 
      alignSelf: 'flex-start',
      marginBottom: '3%'
    },
    message: {
      color: '#228B22',
      fontSize: 16
    },
    image: {
      width: 44,
      height: 100,
      borderRadius: 44/2,
      marginRight: '2%'
    }
 })