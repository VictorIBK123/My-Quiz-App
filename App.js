// import './gesture-handler';// compulspry at the entry point
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import Home from './home';
import TakeQuiz from './takeQuiz';
import { myContext } from './myContext';
import QuizHistory from './quizhistory';
import Settings from './settings';
import About from './about';
import QuizSettings from './quizsettings';
import QuizPage from './quizPage';
import QuizSolutions from './quizSolutions';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import Rate from './rate';
export default function App(){
  const Stack = createStackNavigator()
  const [background, setBackground] = useState('white')
  const [myColor, setMyColor] =  useState('#1c1c45')
  const [allTotalQuestions, setallTotalQuestions] = useState(20)
  const [allQuestionType, setAllQuestionType] = useState('multichoice')
  const [allDifficultyLevel, setAllDifficultyLevel] = useState('easy')
  const [allDurationMin, setAllDurationMin] = useState(10)
  const [allDurationHr, setAllDurationHr] = useState(0)
  const [quizId, setQuizId] = useState(0)
  const [answerValidation, setAnswerValidation] =useState('all')
  const [overallPerformance, setOverallPerformance] = useState('None')
  var quizData;
  useEffect(() => {
    // Prevent splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync()

    // Simulate some loading
    setTimeout(() => {
      // Hide the splash screen when ready
    SplashScreen.hideAsync()
    }, 3000); // Show splash screen for 3 seconds
  }, []);
  useEffect(()=>{
    (async()=>{
      try {
        quizData = await AsyncStorage.getItem('quizdata')
        quizData = JSON.parse(quizData)
        setOverallPerformance(quizData.perf)
        setBackground(quizData.background)
        setMyColor(quizData.myColor)
        setallTotalQuestions(quizData.allTotalQuestions)
        setAllQuestionType(quizData.allQuestionType)
        setAllDifficultyLevel(quizData.allDifficultyLevel)
        setAllDurationMin(quizData.allDurationMin)
        setAllDurationHr(quizData.allDurationHr)
        setQuizId(quizData.quizId)
        setAnswerValidation(quizData.answerValidation)
        setOverallPerformance(quizData.perf)
      }
      catch(error){
        await AsyncStorage.setItem('quizdata', JSON.stringify({background: background, myColor: myColor, allTotalQuestions: allTotalQuestions, 
        allQuestionType: allQuestionType, allDifficultyLevel: allDifficultyLevel, allDurationMin: allDurationMin, 
        allDurationHr: allDurationHr, quizId: quizId,answerValidation: answerValidation, perf: overallPerformance}))
      }
    })()
  },[])
    useEffect(()=>{
      (async()=>{
        await AsyncStorage.setItem('quizdata', JSON.stringify({background: background, myColor: myColor, allTotalQuestions: allTotalQuestions, 
          allQuestionType: allQuestionType, allDifficultyLevel: allDifficultyLevel, allDurationMin: allDurationMin, 
          allDurationHr: allDurationHr, quizId: quizId,answerValidation: answerValidation, perf: overallPerformance}))
      })()
    },[overallPerformance, quizId,allQuestionType, allDifficultyLevel, allTotalQuestions, answerValidation,background, myColor, allDurationMin,allDurationHr])
  return(
      <myContext.Provider value={{overallPerformance, setOverallPerformance, quizId, setQuizId,allQuestionType, setAllQuestionType,allDifficultyLevel, setAllDifficultyLevel,allTotalQuestions, setallTotalQuestions,answerValidation,setAnswerValidation,background, setBackground, myColor, setMyColor,allDurationMin, setAllDurationMin,allDurationHr, setAllDurationHr }}>
        <StatusBar backgroundColor={'black'}/>
        <NavigationContainer>
          <Stack.Navigator  screenOptions={{headerTitleAlign: 'center',headerStyle: {height: 60, backgroundColor: myColor}, headerTintColor: background}}>
            <Stack.Screen  component={Home} name='Quiz App' options={{title:'Home'}}  />
            <Stack.Screen component={TakeQuiz} name='Quiz' options={{title: 'Categories'}} />
            <Stack.Screen component={Settings} name='Settings' />
            <Stack.Screen component={About} name='About' />
            <Stack.Screen component={QuizSettings} name='QuizSettings' options={{title: 'Quiz Settings'}}/>
            <Stack.Screen component={QuizPage} name='quizPage' options={{title: 'Quiz', headerLeft:null}}/>
            <Stack.Screen component={QuizSolutions} name='quizSolutions' options={{title: 'Quiz Solutions', headerTitleAlign:'left'}}/>
            <Stack.Screen component={QuizHistory} name='quizhistory' options={{title: 'Quiz History'}}/>
            <Stack.Screen component={Rate} name ='rate' options={{title: 'Ratings', headerTitleAlign: 'center'}}/> 
          </Stack.Navigator>
        </NavigationContainer>
      </myContext.Provider>
  )
}