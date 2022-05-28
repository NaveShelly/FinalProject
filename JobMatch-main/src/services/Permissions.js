import * as ImagePicker from 'expo-image-picker';

class Permissions {
   async requestCameraPermissions() {
       let { status } = await ImagePicker.requestCameraPermissionsAsync(); 
       if (status !== 'granted') {
         return false 
       } else {
         return true;  
       }
    }

   async requestMediaLibraryPermissions() {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 
    if (status !== 'granted') {
      return false 
    } else {
      return true;  
    }
   }
}

export default new Permissions();