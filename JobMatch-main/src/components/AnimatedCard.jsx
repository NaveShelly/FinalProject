import React from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Animated, PanResponder, Image } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class AnimatedCard extends React.Component {

  constructor(props) {
    super(props)
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }
  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {

            this.props.onSwipeRight(this.props.users[this.state.currentIndex]);

            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {

            this.props.onSwipeLeft(this.props.users[this.state.currentIndex]);  

            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if(gestureState.dy > 20){
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH , y: gestureState.dy }
          }).start(() => {

            this.props.onClickOnCard(this.props.users[this.state.currentIndex]);

            this.setState({ currentIndex: this.state.currentIndex }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  renderUsers = () => {

    return this.props.users.map((item, i) => {


      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {

        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: hp('80%'), width: SCREEN_WIDTH, padding: 10, position: 'absolute', paddingBottom: hp('5%'), marginTop: hp('2%') }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>HIRE</Text>

            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>
            
            <ImageBackground
              imageStyle = {{ resizeMode: 'cover', borderRadius: 20, paddingVertical: '5%' }}
              style={{ flex: 1, height: null, width: null, paddingHorizontal: '5%' }}
              source={{ uri: item.uri }} >

                <Text style={{ marginTop: isIphoneX() ? hp('60%') : hp('56%'), color: 'white', fontSize: 30, fontWeight: '600', marginBottom: '1%' }}>{item.username}</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', marginBottom: '1%' }}>{`Job:  ${item.jobTitle} (${item.type})`}</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{`Description: ${item.aboutMe}`}</Text>
                
              </ImageBackground>

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View

            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: hp('80%'), width: SCREEN_WIDTH, padding: 10, position: 'absolute', paddingBottom: hp('5%'), marginTop: hp('2%')
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>

            <ImageBackground
              imageStyle = {{ resizeMode: 'cover', borderRadius: 20, paddingVertical: '5%' }}
              style={{ flex: 1, height: null, width: null, paddingHorizontal: '5%' }}
              source={{ uri: item.uri }} >

                <Text style={{ marginTop: isIphoneX() ? hp('60%') : hp('56%'), color: 'white', fontSize: 30, fontWeight: '600', marginBottom: '1%' }}>{item.username}</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', marginBottom: '1%' }}>{`Job:  ${item.jobTitle} (${item.type})`}</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{`Description: ${item.aboutMe}`}</Text>

              </ImageBackground>

          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 10 }}>

        </View>
        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});