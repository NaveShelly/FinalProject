import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function SenderMessage({ message }) {
  return (
    <View style={styles.messageWrapper}>
      <Text style={styles.message}>{message.message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
   messageWrapper: { 
     paddingHorizontal: '5%', 
     paddingVertical: '3%', 
     backgroundColor: '#000000', 
     borderTopLeftRadius: 10,
     borderTopRightRadius: 0,
     borderBottomLeftRadius: 10,
     borderBottomRightRadius: 10, 
     alignItems: 'center', 
     justifyContent: 'center', 
     alignSelf: 'flex-end',
     marginBottom: '3%',
   },
   message: {
     color: '#228B22',
     fontSize: 16
   } 
})