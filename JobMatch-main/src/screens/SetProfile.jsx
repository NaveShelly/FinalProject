import React, { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, ActionSheetIOS, Platform,FlatList } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Breaker, Button, Input, LottieView, Loader, AndroidModal } from '../components';
import { showToast, addSibling, destroySibling } from '../helpers';
import { Storage, Permissions } from '../services';
import { updateUser } from '../store/user';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';

const slides = [
  {
    key: 1,
    title: 'Tell us about your \n job expertise fields',
    animSourcePath: require('../../assets/animations/search.json')
  },
  {
    key: 2,
    title: 'Tell us more about yourself',
    animSourcePath: require('../../assets/animations/aboutme.json')
  },
  {
    key: 3,
    title: 'Send us your job resume or if you are Employer press IM employer for next page',
    animSourcePath: require('../../assets/animations/resume.json')
  },
  {
    key: 4,
    title: 'Enable location access to match with people nearby',
    animSourcePath: require('../../assets/animations/location.json')
  }
];
 
export default function SetProfileScreen({ navigation }) {

  const [jobTitle, setJobTitle] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const sliderRef = useRef();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
        {  label:  'Account Collector' , value:  'Account Collector'}, {  label:  'Account Executive' , value:  'Account Executive'}, {  label:  'Account Representative' , value:  'Account Representative'}, {  label:  'Accountant' , value:  'Accountant'}, {  label:  'Accounting Analyst' , value:  'Accounting Analyst'}, {  label:  'Accounting Director' , value:  'Accounting Director'}, {  label:  'Accounting Staff' , value:  'Accounting Staff'}, {  label:  'Accounts Payable/Receivable Clerk' , value:  'Accounts Payable/Receivable Clerk'}, {  label:  'Administrative Analyst' , value:  'Administrative Analyst'}, {  label:  'Administrative Assistant' , value:  'Administrative Assistant'}, {  label:  'Administrative Manager' , value:  'Administrative Manager'}, {  label:  'Administrative Specialist' , value:  'Administrative Specialist'}, {  label:  'Assistant Engineer' , value:  'Assistant Engineer'}, {  label:  'Assistant Professor' , value:  'Assistant Professor'}, {  label:  'Auditing Clerk' , value:  'Auditing Clerk'}, {  label:  'Auditor' , value:  'Auditor'}, {  label:  'Benefits Manager' , value:  'Benefits Manager'}, {  label:  'Biological Engineer' , value:  'Biological Engineer'}, {  label:  'Biostatistician' , value:  'Biostatistician'}, {  label:  'Board of Directors' , value:  'Board of Directors'},  {  label:  'Branch Manager' , value:  'Branch Manager'}, {  label:  'Brand Manager' , value:  'Brand Manager'}, {  label:  'Brand Strategist' , value:  'Brand Strategist'}, {  label:  'Budget Analyst' , value:  'Budget Analyst'}, {  label:  'Business Analyst' , value:  'Business Analyst'}, {  label:  'Business Manager' , value:  'Business Manager'}, {  label:  'C-Level or C-Suite.' , value:  'C-Level or C-Suite.'}, {  label:  'Chef' , value:  'Chef'}, {  label:  'Chemical Engineer' , value:  'Chemical Engineer'}, {  label:  'Chief Engineer' , value:  'Chief Engineer'}, {  label:  'Chief Executive Officer' , value:  'Chief Executive Officer'}, {  label:  'Chief People Officer' , value:  'Chief People Officer'}, {  label:  'Chief Robot Whisperer' , value:  'Chief Robot Whisperer'}, {  label:  'Civil Engineer' , value:  'Civil Engineer'}, {  label:  'Client Service Specialist' , value:  'Client Service Specialist'}, {  label:  'Commercial Loan Officer' , value:  'Commercial Loan Officer'}, {  label:  'Concierge' , value:  'Concierge'}, {  label:  'Content Marketing Manager' , value:  'Content Marketing Manager'}, {  label:  'Continuous Improvement Consultant' , value:  'Continuous Improvement Consultant'}, {  label:  'Continuous Improvement Lead' , value:  'Continuous Improvement Lead'}, {  label:  'Controller' , value:  'Controller'}, {  label:  'Copywriter' , value:  'Copywriter'}, {  label:  'Credit Authorizer' , value:  'Credit Authorizer'}, {  label:  'Credit Counselor' , value:  'Credit Counselor'}, {  label:  'Culture Operations Manager' , value:  'Culture Operations Manager'}, {  label:  'Customer Care Associate' , value:  'Customer Care Associate'}, {  label:  'Customer Service' , value:  'Customer Service'}, {  label:  'Customer Service Manager' , value:  'Customer Service Manager'}, {  label:  'Customer Support' , value:  'Customer Support'}, {  label:  'Data Analyst' , value:  'Data Analyst'}, {  label:  'Data Entry' , value:  'Data Entry'}, {  label:  'Developer' , value:  'Developer'}, {  label:  'Digital Marketing Manager' , value:  'Digital Marketing Manager'}, {  label:  'Digital Overlord' , value:  'Digital Overlord'}, {  label:  'Director of Bean Counting' , value:  'Director of Bean Counting'}, {  label:  'Director of Ethical Hacking' , value:  'Director of Ethical Hacking'}, {  label:  'Director of First Impressions' , value:  'Director of First Impressions'}, {  label:  'Director of Storytelling' , value:  'Director of Storytelling'}, {  label:  'Drafter' , value:  'Drafter'}, {  label:  'Economist' , value:  'Economist'}, {  label:  'Electrical Engineer' , value:  'Electrical Engineer'}, {  label:  'Engineer' , value:  'Engineer'}, {  label:  'Engineering Technician' , value:  'Engineering Technician'}, {  label:  'Executive Assistant' , value:  'Executive Assistant'}, {  label:  'File Clerk' , value:  'File Clerk'}, {  label:  'Finance Director' , value:  'Finance Director'}, {  label:  'Finance Manager' , value:  'Finance Manager'}, {  label:  'Financial Analyst' , value:  'Financial Analyst'}, {  label:  'Financial Planner' , value:  'Financial Planner'}, {  label:  'Financial Services Representative' , value:  'Financial Services Representative'}, {  label:  'Front-Line Employees' , value:  'Front-Line Employees'}, {  label:  'Geological Engineer' , value:  'Geological Engineer'}, {  label:  'Graphic Designer' , value:  'Graphic Designer'}, {  label:  'HR' , value:  'HR'}, {  label:  'Help Desk' , value:  'Help Desk'}, {  label:  'Human Resources' , value:  'Human Resources'}, {  label:  'Human Resources' , value:  'Human Resources'}, {  label:  'Maintenance Engineer' , value:  'Maintenance Engineer'}, {  label:  'Managers' , value:  'Managers'}, {  label:  'Market Researcher' , value:  'Market Researcher'}, {  label:  'Marketing Communications Manager' , value:  'Marketing Communications Manager'}, {  label:  'Marketing Consultant' , value:  'Marketing Consultant'}, {  label:  'Marketing Director' , value:  'Marketing Director'}, {  label:  'Marketing Manager' , value:  'Marketing Manager'}, {  label:  'Marketing Research Analyst' , value:  'Marketing Research Analyst'}, {  label:  'Marketing Specialist' , value:  'Marketing Specialist'}, {  label:  'Marketing Staff' , value:  'Marketing Staff'}, {  label:  'Mechanical Engineer' , value:  'Mechanical Engineer'}, {  label:  'Media Buyer' , value:  'Media Buyer'}, {  label:  'Media Relations Coordinator' , value:  'Media Relations Coordinator'}, {  label:  'Medical Researcher' , value:  'Medical Researcher'}, {  label:  'Mentor' , value:  'Mentor'}, {  label:  'Mining Engineer' , value:  'Mining Engineer'}, {  label:  'Nuclear Engineer' , value:  'Nuclear Engineer'}, {  label:  'Office Assistant' , value:  'Office Assistant'}, {  label:  'Office Clerk' , value:  'Office Clerk'}, {  label:  'Office Manager' , value:  'Office Manager'}, {  label:  'Online ESL Instructor' , value:  'Online ESL Instructor'}, {  label:  'Operations Analyst' , value:  'Operations Analyst'}, {  label:  'Operations Assistant' , value:  'Operations Assistant'}, {  label:  'Operations Coordinator' , value:  'Operations Coordinator'}, {  label:  'Operations Director' , value:  'Operations Director'}, {  label:  'Operations Manager' , value:  'Operations Manager'}, {  label:  'Operations Professional' , value:  'Operations Professional'}, {  label:  'Payroll Clerk' , value:  'Payroll Clerk'}, {  label:  'Payroll Manager' , value:  'Payroll Manager'}, {  label:  'Petroleum Engineer' , value:  'Petroleum Engineer'}, {  label:  'Plant Engineer' , value:  'Plant Engineer'}, {  label:  'Preschool Teacher' , value:  'Preschool Teacher'}, {  label:  'Product Manager' , value:  'Product Manager'}, {  label:  'Production Engineer' , value:  'Production Engineer'}, {  label:  'Professor' , value:  'Professor'}, {  label:  'Program Administrator' , value:  'Program Administrator'}, {  label:  'Program Manager' , value:  'Program Manager'}, {  label:  'Public Relations' , value:  'Public Relations'}, {  label:  'Purchasing Staff' , value:  'Purchasing Staff'}, {  label:  'Quality Control' , value:  'Quality Control'}, {  label:  'Quality Control Coordinator' , value:  'Quality Control Coordinator'}, {  label:  'Quality Engineer' , value:  'Quality Engineer'}, {  label:  'Receptionist' , value:  'Receptionist'}, {  label:  'Receptionist' , value:  'Receptionist'}, {  label:  'Research Assistant' , value:  'Research Assistant'}, {  label:  'Researcher' , value:  'Researcher'}, {  label:  'Risk Manager' , value:  'Risk Manager'}, {  label:  'SEO Manager' , value:  'SEO Manager'}, {  label:  'Safety Engineer' , value:  'Safety Engineer'}, {  label:  'Sales Engineer' , value:  'Sales Engineer'}, {  label:  'Scrum Master' , value:  'Scrum Master'}, {  label:  'Secretary' , value:  'Secretary'}, {  label:  'Shareholders' , value:  'Shareholders'}, {  label:  'Shipping and Receiving Staff' , value:  'Shipping and Receiving Staff'}, {  label:  'Social Media Assistant' , value:  'Social Media Assistant'}, {  label:  'Software Ninjaneer' , value:  'Software Ninjaneer'}, {  label:  'Substitute Teacher' , value:  'Substitute Teacher'}, {  label:  'Supervisors' , value:  'Supervisors'}, {  label:  'Teacher' , value:  'Teacher'}, {  label:  'Teaching Assistant' , value:  'Teaching Assistant'}, {  label:  'Technical Support Specialist' , value:  'Technical Support Specialist'}, {  label:  'Test Scorer' , value:  'Test Scorer'}, {  label:  'Title Analyst' , value:  'Title Analyst'}, {  label:  'Title Researcher' , value:  'Title Researcher'}, {  label:  'Tutor/Online Tutor' , value:  'Tutor/Online Tutor'}, {  label:  'VP of Miscellaneous Stuff' , value:  'VP of Miscellaneous Stuff'}, {  label:  'Vice President of Marketing' , value:  'Vice President of Marketing'}, {  label:  'Vice President of Operations' , value:  'Vice President of Operations'}, {  label:  'Virtual Assistant' , value:  'Virtual Assistant'}, {  label:  'eCommerce Marketing Specialist' , value:  'eCommerce Marketing Specialist'}
  ])

  console.log('user >>>>>', user);

  const enableLocationAccess = async () => {
    try {
    let { status } = await Location.requestForegroundPermissionsAsync();
  
    if (status !== 'granted') {
      showToast('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync();

    console.log(location);

    await firebase.firestore().collection('users').doc(user.uid).update({
       location
    });

    navigation.navigate('Tab');
    } catch (err) {
      showToast(err.message);
    }
  }

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

       sliderRef.current.goToSlide(4);
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

       sliderRef.current.goToSlide(4);
    }
    }
    } catch (err) {
       showToast('Something went wrong.');
    } 

    destroySibling();
  };

  const onAttachmentPress = () => {
    if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Add a resume file',
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
      addSibling(<AndroidModal onOption1Press={takePhotoAsync} onOption2Press={chooseImageAsync} title="Add a resume file" option1="Take from Camera" option2="Choose from Gallery" />);
   }
  }

  const employerNext = async () => {
    try { 
 
      const localUri = 'https://firebasestorage.googleapis.com/v0/b/jobmatch-b6a04.appspot.com/o/Blank.jpg?alt=media&token=fe9c4057-dab8-4fd7-84ce-f8bb9671db33'
 
      const remoteUrl = await Storage.saveFileToStorage(localUri, user.uid, 'job_resume');
 
      if (remoteUrl) {
 
        await firebase.firestore().collection('users').doc(user.uid).update({
           resumeUrl: remoteUrl
        }); 
 
        dispatch(updateUser({
           property: 'resumeUrl',
           value: remoteUrl
        }))
 
        sliderRef.current.goToSlide(4);
     }
     }
      catch (err) {
        showToast('Something went wrong.');
     } 
 
     destroySibling();
   }


  const renderItem = ({ item }) => {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={-150} enabled behavior='position' style = {{ flex: 1, backgroundColor: '#000000', paddingHorizontal: '5%', paddingTop: '30%' }}>
        <Text style = {{ textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: 27, marginBottom: '10%' }}>{item.title}</Text>
        <LottieView source = {item.animSourcePath} />
        {
          item.key === 1
            ? (
             <>
               <Breaker />
               <DropDownPicker 
                open={open} 
                items={items}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select a job Title"
                />
               <Text>{'Enter your Job Title'}</Text>
               <Breaker />
               <Breaker />
               <Button onPress={async () => {
                  if (!value) {
                     showToast('Please enter a job title');
                     return;
                  } 
                  try {

                    await firebase.firestore().collection('users').doc(user.uid).update({
                      jobTitle:value
                    })

                    dispatch(updateUser({
                      property: 'jobTitle',
                      value: value
                   }))

                   sliderRef.current.goToSlide(1)

                  } catch (err) {
                    showToast(err.message);
                  }

               }} text='Next' />
             </>
            )
            : item.key === 2
            ? (
              <>
                <Breaker />
                <Input style={{ height: '20%', paddingBottom: '12%' }} value={aboutMe} onChange={(a) => setAboutMe(a)} placeholder='Enter a description about yourself' /> 
                <Breaker />
                <Button onPress={async () => {

                   if (!aboutMe) {
                     showToast('Please enter a description about yourself');
                     return;
                   }

                  try {

                    await firebase.firestore().collection('users').doc(user.uid).update({
                      aboutMe
                    })

                    dispatch(updateUser({
                      property: 'aboutMe',
                      value: aboutMe
                   }))

                   sliderRef.current.goToSlide(2)

                  } catch (err) {
                    showToast(err.message);
                  }
              
                }} text={"Next"} />
              </>
            )
            : item.key === 3
            ? (
              <>
                <Breaker />
                <Breaker />
                { user.type=='employee' &&
                <Button onPress={onAttachmentPress} text='Choose attachment' />
                }
                { user.type=='employer' &&
                <Button onPress={employerNext} text='Im Employer' />
                }
              </>
            )
            : (
              <>
                <Breaker />
                <Breaker />
                <Breaker />
                <Button onPress={enableLocationAccess} text='Enable location' />
              </>
            )
        }
      </KeyboardAvoidingView>
    );
  }

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <AntDesign
          name="arrowright"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <MaterialIcons
          name="done"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  }; 

  const onDone = () => {
     navigation.navigate('Tab');
  }

  return (
    <AppIntroSlider 
      scrollEnabled = {false}
      showNextButton={false} 
      ref={sliderRef}
      //onSlideChange={onSlideChange}
      renderItem={renderItem} 
      data={slides} 
      onDone={onDone}
      renderDoneButton={renderDoneButton}
      renderNextButton={renderNextButton}
      activeDotStyle={{ backgroundColor: '#2BE7AC' }}
    />
  )
}

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle:{  
    margin: 24,  
    fontSize: 25,  
    fontWeight: 'bold',  
    textAlign: 'center',  
  }
  
});