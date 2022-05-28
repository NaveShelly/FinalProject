import { Platform, ActionSheetIOS, View, Image, Text } from 'react-native';
import React, { useState } from 'react';
import { Button, AndroidModal, Loader, Breaker } from '../components';
import { addSibling, destroySibling, showToast } from '../helpers';
import { Permissions, Storage } from '../services';
import ImageView from "react-native-image-viewing";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateUser } from '../store/user';

import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

export default function Resume() {

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation(); 
  const [visible, setIsVisible] = useState(true);

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

    const remoteUrl = await Storage.saveFileToStorage(localUri, user.uid, 'job_resume');

    if (remoteUrl) {

       await firebase.firestore().collection('users').doc(user.uid).update({
          resumeUrl: remoteUrl
       }); 

       dispatch(updateUser({
          property: 'resumeUrl',
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

     const remoteUrl = await Storage.saveFileToStorage(localUri, user.uid, 'job_resume');

     if (remoteUrl) {

       await firebase.firestore().collection('users').doc(user.uid).update({
          resumeUrl: remoteUrl
       }); 

       dispatch(updateUser({
          property: 'resumeUrl',
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

  const onEditPress = () => {
    if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions({
          title: 'Edit my resume',
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
          addSibling(<AndroidModal onOption1Press={takePhotoAsync} onOption2Press={chooseImageAsync} title="Edit my resume" option1="Take from Camera" option2="Choose from Gallery" />);
       } 
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000', paddingTop: '40%' }}>
      <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 25, fontWeight: 'bold', marginBottom: '5%' }}>Resume Preview</Text>  
      <Image
       source={{ uri: user.resumeUrl }}  
       style={{ width: '100%', height: '40%', alignSelf: 'center' }} />

       <Breaker />

       <Button text={"Edit Resume"} onPress={onEditPress} />
       <Text onPress={() => navigation.goBack()} style={{ marginTop: '5%', color: 'red', fontWeight: 'bold', alignSelf: 'center', fontSize: 17 }}>back</Text>
    </View>
  )
};