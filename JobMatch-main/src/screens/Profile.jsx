import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground, Platform, ActionSheetIOS } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Input, Button, Breaker, AndroidModal, Loader } from '../components';
import React, { useState } from 'react';
import { Permissions, Storage } from '../services';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { updateUser, setUser } from '../store/user';
import { EvilIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { showToast, addSibling, destroySibling } from '../helpers';

export default function ProfileScreen() {

  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { photoUrl, email, displayName, aboutMe,type } = user;

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const applyHandler = async () => {
    if (newUsername) {
      try {
       await firebase.auth().currentUser.updateProfile({
         displayName: newUsername
       })
       dispatch(updateUser({
         property: 'displayName',
         value: newUsername
       }))
       setNewUsername('');
       Alert.alert('Username sucessfully updated')
      } catch (err) {
        showToast(err.message);
      } 
    } else if (newEmail) {
      try {
        await firebase.auth().currentUser.updateEmail(newEmail);
        dispatch(updateUser({
          property: 'email',
          value: newEmail
        }))
        setNewEmail('');
        Alert.alert('Email sucessfully updated')
      } catch (err) {
        showToast(err.message); 
      }
    } else if (newDescription) {
       try {
         await firebase.firestore().collection('users').doc(user.uid).update({
           aboutMe: newDescription
         });
         dispatch(updateUser({
          property: 'aboutMe',
          value: newDescription
        }))
        setNewDescription('');
        Alert.alert('Description sucessfully updated')
       } catch (err) {
        showToast(err.message);
       }
    } else if (newPassword) {
      try {
        await firebase.auth().currentUser.updatePassword(newPassword);
        setNewPassword('');
        Alert.alert('Password sucessfully updated') 
      } catch (err) {
        showToast(err.message);
      }
    } else {
      showToast('No changes have been made.');
      return
    }
  }

  const chooseImageAsync = async () => {

    if (Platform.OS === 'android') destroySibling();

    addSibling(<Loader />); 
    try { 

     const isGranted = await Permissions.requestMediaLibraryPermissions();
     console.log(isGranted)

     if (isGranted) {

     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       aspect: [4, 3],
       quality: 1,
       allowsEditing: true
     });

     if (result.cancelled) {
       destroySibling();
       return;
     }

     const localUri = result.uri;

     const remoteUrl = await Storage.saveFileToStorage(localUri, user.uid, 'profilePictures');

     if (remoteUrl) {

      await firebase.auth().currentUser.updateProfile({
        photoURL: remoteUrl
      });

       await firebase.firestore().collection('users').doc(user.uid).update({
          photoUrl: remoteUrl
       }); 

       dispatch(updateUser({
          property: 'photoUrl',
          value: remoteUrl
       }))
    }
    }
    } catch (err) {
       console.log(err); 
       showToast('Something went wrong.');
    } 

    destroySibling();
  };

  const takePhotoAsync = async () => {

    if (Platform.OS === 'android') destroySibling();

    addSibling(<Loader />)

    try { 
     const isGranted = await Permissions.requestCameraPermissions();
     console.log(isGranted)

     if (isGranted) {

    const result = await ImagePicker.launchCameraAsync({
       allowsEditing: true,
       aspect: [1, 1]
    }); 

    if (result.cancelled) {
       destroySibling();
       return;
    }

    const localUri = result.uri;

    const remoteUrl = await Storage.saveFileToStorage(localUri, user.uid, 'profilePictures');

    if (remoteUrl) {

      await firebase.auth().currentUser.updateProfile({
        photoURL: remoteUrl
      });

       await firebase.firestore().collection('users').doc(user.uid).update({
          photoUrl: remoteUrl
       }); 

       dispatch(updateUser({
          property: 'photoUrl',
          value: remoteUrl
       }))
    }
    }
    } catch (err) {
       console.log(err.message)
       showToast('Something went wrong.')
    }

    destroySibling();
  };

  const onEditIconPress = () => {
      if (Platform.OS === 'ios') {
          ActionSheetIOS.showActionSheetWithOptions({
            title: 'Change profile picture',
            options: ['Take from Camera', 'Choose from Gallery', 'Cancel'],
            cancelButtonIndex: 2,
         }, (i) => {
            if (i === 0) {
               takePhotoAsync();
            } else if (i === 1) {
               chooseImageAsync();
            }
         })
         } else {
            addSibling(<AndroidModal onOption1Press={takePhotoAsync} onOption2Press={chooseImageAsync} title="Change profile picture" option1="Take from Camera" option2="Choose from Gallery"  />);
         } 
  }

  const AddJob = async () => {
    let random = Math.floor(Math.random() * 999999 + 1);
    var ProfileIds = await firebase.firestore().collection('users').doc(user.uid).get('ProfileIds');
    var temp1=ProfileIds["_delegate"]["_document"]["data"]["value"]["mapValue"]["fields"]["ProfileIds"]["arrayValue"];
    var temp = []
    if(temp1["values"]!=undefined){
    for (let item of temp1["values"])
      {
        console.log("*****************************************************1"); 
        temp.push(item.stringValue);
      } 
    }
    temp.push(user.uid + random)
    console.log(temp);
     await firebase.firestore().collection('users').doc(user.uid).update({
         ProfileIds: temp
     });
    try {  
        var ProfileIds=[];
        ProfileIds.push(user.uid);
        var ExitsphotoURL= 'https://firebasestorage.googleapis.com/v0/b/jobmatch-b6a04.appspot.com/o/profileimage.png?alt=media&token=dc8cfa16-bcc0-444f-98b8-f1eaa4a980e5';
        await firebase.firestore().collection('users').doc(user.uid + random).set({
          photoUrl: ExitsphotoURL,
          username: user.displayName,
            id: user.uid + random,
            type: "employer",
            ProfileIds: ProfileIds
        });
        dispatch(setUser({
          uid: user.uid + random,
          displayName: user.displayName,
          email: user.email,
          photoUrl: ExitsphotoURL,
          jobTitle: '',
          resumeUrl: '',
          location: {
              longitude: null,
              latitude: null
          },
            type: "employer",
            ProfileIds: temp
        }));
        destroySibling();
        navigation.navigate('SetProfile');
    } catch (err) {
        showToast(err.message);
        destroySibling();
    }
}

  const logout = async () => {
    await firebase.auth().signOut(); 
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Login' },
        ],
      })
    );
    dispatch(setUser({}));
  }

  return (
    <View style={styles.container}>
      <ImageBackground imageStyle={{ borderRadius: 150/2 }} style={styles.avatar} source={{ uri: photoUrl }} >
         <TouchableOpacity onPress={onEditIconPress} style={styles.iconWrapper}>
            <EvilIcons name="pencil" size={35} color="black" />
         </TouchableOpacity> 
      </ImageBackground>
      <Text style={styles.email}>{user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1)} ({user.type.charAt(0).toUpperCase() + user.type.slice(1)})</Text>

      <View style = {styles.inputsWrapper}>
        <Text style={styles.infoTxt}>Edit Personal Info:</Text>
        <Input 
          value={newUsername} 
          onChange={(u) => setNewUsername(u)} 
          placeholder={displayName} 
        />
        <Input 
          value={newEmail} 
          onChange={(e) => setNewEmail(e)}  
          placeholder={email} 
        />
        <Input 
          value={newDescription} 
          onChange={(d) => setNewDescription(d)}  
          placeholder={`${aboutMe} (description)`} 
        />
        <Input 
          secureTextEntry
          value={newPassword} 
          onChange={(p) => setNewPassword(p)}  
          placeholder='••••••' 
        />

        <Breaker />
        
        <Button text='Apply Changes' onPress={applyHandler} />
        { type!='employer'&&
        <Button text='View Resume' onPress={() => navigation.navigate('Resume')} />
        }
        { type=='employer'&&
        <Button text='Add Job' onPress={AddJob}/>
        }
        <Text onPress={logout} style={styles.logoutTxt}>Logout</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor:'#000000'
  },
  inputsWrapper: {
    marginTop: '6%',
    padding: '4%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#228b22',
    alignSelf: 'flex-end',
    borderRadius: 20
  },
  avatar: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: isIphoneX() ? hp('7%') : hp('5%')
  },
  email: {
    textAlign: 'center',
    marginTop: '5%',
    fontSize: hp('2.2%'),
    fontWeight:'bold',
    color: '#228b22'
  },
  logoutTxt: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: hp('2%'),
    textAlign: 'center',
    marginTop: '3%'
  },
  infoTxt: { 
    fontWeight:'bold', 
    color: '#228b22', 
    fontSize: hp('2.2%'), 
    textDecorationLine: 'underline',
    marginBottom: '3%' 
  }
})