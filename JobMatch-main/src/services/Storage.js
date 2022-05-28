import firebase from "firebase";
import { Alert } from "react-native";

class Storage {
   async saveFileToStorage(localUri, uid, pathName) {
    try {
     const response = await fetch(localUri);
     const blob = await response.blob();

     //create the ref in firebase
     const ref = firebase.storage().ref().child(`${pathName}/${uid}`);

     const snapshot = await ref.put(blob, { contentType: "image/jpg" }); 

     // Create a download URL
     const remoteURL = await snapshot.ref.getDownloadURL();

     return remoteURL;
    } catch (err) {
      Alert.alert(err.message); 
      return;
    } 
   }  
}

export default new Storage();