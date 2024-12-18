import React, {useContext} from "react"
import { myContext } from "./myContext"
import { ScrollView, Text, View } from "react-native"
export default function About (){
    const { myColor} = useContext(myContext)
    return(
        <ScrollView style={{flex:1, backgroundColor:myColor}}>
            <View >
                <Text style={{color: 'white',paddingLeft: 10, fontWeight:'bold',padding:5, fontSize:19, textDecorationLine:'underline', textDecorationColor:'grey'}}>The Quiz App</Text>
            </View>
            <View style={{marginBottom:9}}>
                <Text style={{color:'#ffffffcc', paddingHorizontal:10, fontSize:15, lineHeight:20}}>{`Discover the ultimate quiz experience with our AI-driven app, powered by the Gemini model! Dive into a vast array of categories and subcategories tailored to your interests. Customize your quizzes by setting the time limit, difficulty level, question type (multiple choice or true/false), and the number of questions—giving you complete control.  
        
Completed quizzes are automatically saved on your device, so you can retake them anytime and track your progress. Whether for fun, learning, or self-challenge, this app turns every quiz into a personalized adventure!`}</Text>
            </View>
            <View>
                <Text style={{color: 'white', paddingLeft: 10, fontWeight:'bold',padding:5, fontSize:19, textDecorationLine:'underline', textDecorationColor:'grey'}}>The Gemini Model</Text>
            </View>
            <View style={{marginBottom:9}}>
                <Text style={{color:'#ffffffcc', paddingHorizontal:10, fontSize:15, lineHeight:20}}>{`The Gemini model, developed by Google DeepMind, is an advanced AI designed for natural language understanding, reasoning, and generation. It excels in creating context-aware responses and handling tasks like quiz generation, text creation, and data summarization.  

The Gemini API allows seamless integration of these capabilities into apps, enabling features like dynamic content generation and personalization. Fast, scalable, and efficient, it’s a powerful tool for developers looking to enhance their applications with AI-driven solutions.  `}</Text>
            </View>
            <View>
                <Text style={{color: 'white',paddingLeft: 10, fontWeight:'bold',padding:5, fontSize:19, textDecorationLine:'underline', textDecorationColor:'grey'}}>About the developer</Text>
            </View>
            <View style={{marginBottom:2}}>
                <Text style={{color:'#ffffffcc', paddingHorizontal:10, fontSize:15, lineHeight:20}}>{` This app was developed by Ibukun Victor Ogundipe, a passionate Computer Science student at the University of Ibadan. With a strong interest in mobile and web development, Ibukun specializes in building mobile applications using React Native with the Expo framework.  

For inquiries or collaboration, you can reach out via:  
- Phone/WhatsApp: 09079172441  
- Email: ibukunogundipe2@gmail.com  

Dedicated to creating innovative and user-friendly applications, Ibukun Victor is excited to bring impactful solutions to the tech world!`}</Text>
            </View>
            <View style={{marginTop:20, marginBottom:10, marginRight:10}}><Text style={{fontWeight:'bold', textAlign:'right', color:'#ffffffcc'}}>© 2024 Ibukun Victor Ogundipe.  </Text><Text style={{fontWeight:'bold', textAlign:'right', color:'#ffffffcc'}}>All Rights Reserved. </Text></View>
        </ScrollView>
    )
}