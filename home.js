import React, {  useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { myContext } from "./myContext";
export default function Home({navigation}){
  const {background,setBackground, setMyColor, myColor} = useContext(myContext)
  return (
    <View style={{flex:1, paddingTop: 20,backgroundColor: myColor}}>
      <View style={{flex: 3.5/10,}}>
        <View style={{flex:2.5/5, alignItems:'center', justifyContent:'center'}}>
          <Image source={require('./assets/default.png')} style={{height:110, width: 110}} />
        </View>
        <View style={{flex:1.25/5, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color:background}}>Welcome, Username</Text>
        </View>
        <View style={{flex:1.25/5,  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginBottom:5}}>
          <TouchableOpacity>
            <Text style={{fontSize: 15, borderRadius:4, padding:4,fontWeight:'700', elevation:10, backgroundColor: background, color: myColor}}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            setBackground(myColor);setMyColor(background)
          }}>
            <Text style={{fontSize: 15, borderRadius:4, padding:4,fontWeight:'700', elevation:10, backgroundColor: background, color: myColor}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 4/10, justifyContent: 'center', marginHorizontal:2, borderRadius:5, padding:5}}>
        <View style={{flex:5/10, flexDirection: 'row', }}>
          <TouchableOpacity onPress={()=>{navigation.navigate('Quiz')}} style={{flex:1/2}}>
            <View style={{flex: 1, backgroundColor: background, borderRadius: 7, margin:4, elevation: 10}}>
              <View style={{flex:2/5, justifyContent: 'center'}}><Text style={[styles.menuTitle, {color: myColor}]}>Take Quiz</Text></View>
              <View style={{flex:3/5, justifyContent: 'center'}}><Text adjustsFontSizeToFit={true} style={[styles.menuText, {color: myColor}]}>Challenge your self with quiz of different categories</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate('Multiplayer')}} style={{flex: 1/2}}>
            <View style={{flex: 1, backgroundColor: background, borderRadius: 7, margin:4, elevation: 10}}>
              <View style={{flex:2/5, justifyContent: 'center'}}><Text style={[styles.menuTitle, {color: myColor}]}>Multiplayer</Text></View>
              <View style={{flex:3/5, justifyContent: 'center'}}><Text adjustsFontSizeToFit={true} style={[styles.menuText, {color: myColor}]}>Compete with a quiz taker online with ur internet or local wifi</Text></View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex:5/10, flexDirection:'row', }}>
          <TouchableOpacity onPress={()=>{navigation.navigate('Globally')}} style={{flex:1/2}}>
            <View style={{flex: 1, backgroundColor: background, borderRadius: 7, margin:4, elevation: 10}}>
              <View style={{flex:2/5, justifyContent: 'center'}}><Text style={[styles.menuTitle, {color: myColor}]}>Participate globally</Text></View>
              <View style={{flex:3/5, justifyContent: 'center'}}><Text adjustsFontSizeToFit={true} style={[styles.menuText, {color: myColor}]}>Participate in a global quiz competetion </Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate('Create')}} style={{flex:1/2}}>
            <View style={{flex: 1, backgroundColor: background, borderRadius: 7, margin:4, elevation: 10}}>
              <View style={{flex:2/5, justifyContent: 'center'}}><Text style={[styles.menuTitle, {color: myColor}]}>Create Quiz</Text></View>
              <View style={{flex:3/5, justifyContent: 'center'}}><Text adjustsFontSizeToFit={true} minimumFontScale={0.5} style={[styles.menuText, {color: myColor}]}>Make quiz for people to participate in and get their grades</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 2.5/10, }}>
        <TouchableOpacity onPress={()=>{navigation.navigate('Settings')}} style={{flex:1/3}}>
          <View style={{flex:1, borderBottomWidth: 1, marginHorizontal:10, marginVertical:3,  flexDirection: 'row', alignItems:'center', paddingLeft:5}}>
            <Feather name="settings" size={24} color={background} />
            <Text adjustsFontSizeToFit={true} minimumFontScale={0.5} style={[styles.otherText, {color: background}]}>Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('About')}} style={{flex:1/3}}>
          <View style={{flex:1,  marginHorizontal:10, marginVertical:3, flexDirection:'row',borderBottomWidth: 1, alignItems:'center', paddingLeft:5}}>
            <Ionicons name="apps" size={24} color={background} />
            <Text adjustsFontSizeToFit={true} minimumFontScale={0.5} style={[styles.otherText, {color: background}]}>About</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity  style={{flex:1/3}}>
          <View style={{flex:1,  marginHorizontal:10, marginVertical:3, flexDirection:'row', alignItems:'center', paddingLeft:5}}>
            <Ionicons name="apps" size={24} color={background} />
            <Text adjustsFontSizeToFit={true} minimumFontScale={0.5} style={[styles.otherText, {color: background}]}>Rate us</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles=StyleSheet.create({
  menuTitle:{
    color: '#277ee8',
    paddingHorizontal:9,
    fontSize:17,
    fontWeight: 'bold'
  },
  menuText:{
    color: '#277ee8',
    paddingHorizontal: 9,
    lineHeight:16,
    fontSize:14,
  },
  otherText:{
    fontSize: 15,
    paddingHorizontal: 20,
    fontWeight: '600',
    color: 'white'
  }
})