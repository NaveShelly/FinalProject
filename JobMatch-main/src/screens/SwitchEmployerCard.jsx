import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import {View, StyleSheet, SafeAreaView,Text} from 'react-native';
import { Breaker, Button } from '../components';
export default function SwitchEmployerCard({ navigation, route }) {

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);  
  const { user } = useSelector((state) => state.user); 
  

  return (
      
    <SafeAreaView style={styles.pageContainer}>
        <Feather onPress={() => navigation.navigate('Home')} style={{right:350,top:25}} name="chevron-left" size={35} color="#228B22" />
        <Text style={styles.JobsPickTitle}> {"Open Jobs : "} </Text>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <View>{Object.values(route.params)}</View>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
        <Breaker/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: '#000000'
    },
    JobsPickTitle:{
        color: '#228B22',
        alignSelf: 'flex-end',
        fontSize: 26,
        top:100, 
        right:120
     },
  });