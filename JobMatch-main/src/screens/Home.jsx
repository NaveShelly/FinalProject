import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {View, StyleSheet, SafeAreaView,Text} from 'react-native';
import { AnimatedCard, Card ,Button} from '../components';
import { gererateId } from '../helpers';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateUser, setUser } from '../store/user';

//import users from '../../src/data/users';

import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default function HomeScreen() {

  const [users, setUsers] = useState([]);

  const { user } = useSelector((state) => state.user);

  const navigation = useNavigation();

  const dispatch = useDispatch();


  const onSwipeLeft = async (userSwiped) => {
    console.log(`you swiped PASS on ${userSwiped.username}`);
    await firebase.firestore().collection('users').doc(user.uid).collection('passes').doc(userSwiped.id).set(userSwiped);
  };

  const onSwipeRight = async (userSwiped) => {
    console.log(`You swiped on ${userSwiped.username}`);

    firebase.firestore().collection('users').doc(userSwiped.id).collection('swipes').doc(user.uid).get().then(async(snap) => {
      if (snap.exists) {
        //user has matched with you before you matched with them...
        console.log(`Hooray, you matched with ${userSwiped.username}`);
        await firebase.firestore().collection('users').doc(user.uid).collection('swipes').doc(userSwiped.id).set(userSwiped);
        //create a Match!
        await firebase.firestore().collection('matches').doc(gererateId(user.uid, userSwiped.id)).set({
          users: {
            [user.uid]: user,
            [userSwiped.id]: userSwiped
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        alert(`You and ${userSwiped.username} are matched`)

        navigation.navigate('Match', { loggedInProfile: user, userSwiped })
      } else {
        // User has swiped as first interaction between the two or didnt get swiped on...
        console.log(`You swiped on ${userSwiped.username}`)
        await firebase.firestore().collection('users').doc(user.uid).collection('swipes').doc(userSwiped.id).set(userSwiped);
      }
    })
  };

  const onClickOnCard = async (userSwiped) => {
    if(user.type=='employer'){
      navigation.navigate('ShowResume',{resume:`${userSwiped.resumeUrl}`} )
    }
    else{
    navigation.navigate('Home')
    }
  };

  useEffect(() => {

    const fetchCards = async () => {

    let data = [];

    const snapshotPasses = await firebase.firestore().collection('users').doc(user.uid).collection('passes').get();
    const passes = snapshotPasses.docs.map((doc) => doc.id);

    const snapshotSwipes = await firebase.firestore().collection('users').doc(user.uid).collection('swipes').get();
    const swipes = snapshotSwipes.docs.map((doc) => doc.id);

    const passedUserIds = passes.length > 0 ? passes : ["test"];
    const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
    

    firebase.firestore().collection('users').where("id", "not-in", [...passedUserIds, ...swipedUserIds]).get().then((snap) => {
      for (const doc of snap.docs) {

        if (doc.id === user.uid) continue; 

        if (doc.data()?.type === user.type) continue;
        
        if(doc.data()?.jobTitle !== user.jobTitle) continue;
        
        
        data.push({
          username: doc.data()?.username,
          uri: doc.data()?.photoUrl,
          jobTitle: doc.data()?.jobTitle,
          type: doc.data()?.type,
          id: doc.id,
          resumeUrl: doc.data()?.resumeUrl,
          aboutMe: doc.data()?.aboutMe
        })
      }
      
       setUsers(data);
    })
  }

  fetchCards()  

  }, [])
  const getUsers = async () => {
    var arrBut=[];
    var Check=await firebase.firestore().collection('users').where("username", "==", user.displayName).get()
    for (let item of Check["_delegate"]["_snapshot"]["docChanges"])
      {
        if(item["doc"]["data"]["value"]["mapValue"]["fields"].jobTitle["stringValue"] != undefined && item["doc"]["data"]["value"]["mapValue"]["fields"].aboutMe["stringValue"]!=undefined){
        arrBut.push( <Button 
          text={"Title: "+item["doc"]["data"]["value"]["mapValue"]["fields"].jobTitle["stringValue"]  +" " + " Description: " + item["doc"]["data"]["value"]["mapValue"]["fields"].aboutMe["stringValue"] } 
          onPress={()  => setChoosenUser(item["doc"]["data"]["value"]["mapValue"]["fields"].jobTitle["stringValue"],item["doc"]["data"]["value"]["mapValue"]["fields"].aboutMe["stringValue"],item["doc"]["data"]["value"]["mapValue"]["fields"].id["stringValue"]) }
          />)
        }
      }  
    navigation.navigate('SwitchEmployerCard',{arrBut} )
  }

  const setChoosenUser = async (x,y,z) => {
    var SwitchUser=await firebase.firestore().collection('users').where("jobTitle", "==", x).where("aboutMe", "==", y).where("id", "==", z).get();
    for(let item of SwitchUser["_delegate"]["_snapshot"]["docChanges"])
    {  
    if(item["doc"]["data"]["value"]["mapValue"]["fields"].id["stringValue"]==undefined)
    {
      item["doc"]["data"]["value"]["mapValue"]["fields"].id["stringValue"]='';
    } 
    if(item["doc"]["data"]["value"]["mapValue"]["fields"].username["stringValue"]==undefined)
    {
      item["doc"]["data"]["value"]["mapValue"]["fields"].username["stringValue"]='';
    } 
    if(item["doc"]["data"]["value"]["mapValue"]["fields"].photoUrl["stringValue"]==undefined)
    {
      item["doc"]["data"]["value"]["mapValue"]["fields"].photoUrl["stringValue"]='';
    } 
    if(item["doc"]["data"]["value"]["mapValue"]["fields"].jobTitle["stringValue"]==undefined)
    {
      item["doc"]["data"]["value"]["mapValue"]["fields"].jobTitle["stringValue"]='';
    } 
    if(item["doc"]["data"]["value"]["mapValue"]["fields"].resumeUrl["stringValue"]==undefined)
    {
      item["doc"]["data"]["value"]["mapValue"]["fields"].resumeUrl["stringValue"]='';
    } 
    if(item["doc"]["data"]["value"]["mapValue"]["fields"].aboutMe["stringValue"]==undefined)
    {
      item["doc"]["data"]["value"]["mapValue"]["fields"].aboutMe["stringValue"]='';
    } 
    dispatch(setUser({
      uid: item["doc"]["data"]["value"]["mapValue"]["fields"].id["stringValue"],
      displayName: item["doc"]["data"]["value"]["mapValue"]["fields"].username["stringValue"],
      email: user.email,
      photoUrl: item["doc"]["data"]["value"]["mapValue"]["fields"].photoUrl["stringValue"],
      jobTitle: item["doc"]["data"]["value"]["mapValue"]["fields"].jobTitle["stringValue"],
      resumeUrl: item["doc"]["data"]["value"]["mapValue"]["fields"].resumeUrl["stringValue"],
      location: {
        longitude: null,
        latitude: null  
      },
      type: "employer", 
      aboutMe: item["doc"]["data"]["value"]["mapValue"]["fields"].aboutMe["stringValue"],
      ProfileIds: []
    }));
    }
    navigation.navigate('Profile');
} 

  return (
    <SafeAreaView style={styles.pageContainer}>
      <AnimatedCard  onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} onClickOnCard={onClickOnCard} users = {users}/>
      {users.length==0 &&
      <Text style={styles.noMatchText}> {"There no match available \n    please try again later \n\n                     😔"} </Text>
      }
      {user.type=='employer'&&
      <Ionicons onPress={() => navigation.navigate('Chat')} style={styles.chatIcon} name="chatbox-sharp" size={30} />}
      {user.type=='employee'&&
      <Ionicons onPress={() => navigation.navigate('Chat')} style={styles.chatIconEmployee} name="chatbox-sharp" size={30} />}
      {user.type=='employer'&&
      <Ionicons onPress={getUsers} style={styles.bagIcon} name="hammer-sharp" size={30} />}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000'
  },
  noMatchText:{
     color: '#228B22',
     alignSelf: 'flex-end',
     fontSize: 26, 
     bottom:300,
     right:50
  },
  chatIcon: { 
    color:'#228B22',
    alignSelf: 'flex-end', 
    marginRight: '5%',
    marginTop: isIphoneX() ? '4%' : '10%' ,
    bottom : -50
  },chatIconEmployee: { 
    color:'#228B22',
    alignSelf: 'flex-end', 
    marginRight: '5%',
    marginTop: isIphoneX() ? '4%' : '10%' ,
    bottom : 30,
  },
  bagIcon: { 
    color:'#228B22',
    alignSelf: 'flex-end', 
    marginRight: '5%',
    marginTop: isIphoneX() ? '4%' : '10%',
    right:330,
    bottom:25
  },
  resumeIcon: { 
    color:'#228B22',
    alignSelf: 'flex-end', 
    marginRight: '5%',
    marginTop: isIphoneX() ? '4%' : '10%',
    right:165,
    bottom : 50
  }
});