import { StyleSheet, SafeAreaView,ImageView,Text,Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper';
export default function ShowResume({ navigation, route }) {

    
    return (
        <SafeAreaView style={styles.container}>
        <Feather onPress={() => navigation.navigate('Home')} style={{right:360,top:10}} name="chevron-left" size={35} color="#228B22" />    
        <Image
          style={styles.resumeImage}
          source={{uri:route.params.resume}}
        />  
        </SafeAreaView>
      )
    }
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#000000',
        },
        resumeImage: {
           flex: 1,
           borderRadius: 10,
           left:50,
           width: 350,
           height: 80,
           resizeMode: 'stretch'
        }
    })
