// import './gesture-handler';// compulspry at the entry point
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react'
import Home from './home';
import TakeQuiz from './takeQuiz';
import Multiplayer from './multiplayer';
import { myContext } from './myContext';
import Globally from './globally';
import QuizHistory from './quizhistory';
import Create from './create';
import Settings from './settings';
import About from './about';
import QuizSettings from './quizsettings';
import QuizPage from './quizPage';
import QuizSolutions from './quizSolutions';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
export default function App(){
  const Stack = createStackNavigator()
  const [background, setBackground] = useState('white')
  const [myColor, setMyColor] =  useState('#1c1c45')
  const [allTotalQuestions, setallTotalQuestions] = useState(20)
  const [allQuestionType, setAllQuestionType] = useState('multichoice')
  const [allDifficultyLevel, setAllDifficultyLevel] = useState('easy')
  const [allDurationMin, setAllDurationMin] = useState(10)
  const [allDurationHr, setAllDurationHr] = useState(0)
  const [answerValidation, setAnswerValidation] =useState('all')
  return(
      <myContext.Provider value={{allQuestionType, setAllQuestionType,allDifficultyLevel, setAllDifficultyLevel,allTotalQuestions, setallTotalQuestions,answerValidation,setAnswerValidation,background, setBackground, myColor, setMyColor,allDurationMin, setAllDurationMin,allDurationHr, setAllDurationHr }}>
        <StatusBar backgroundColor={'black'}/>
        <NavigationContainer>
          <Stack.Navigator  screenOptions={{headerTitleAlign: 'center',headerStyle: {height: 60, backgroundColor: myColor}, headerTintColor: background}}>
            <Stack.Screen  component={Home} name='Quiz App' options={{title:'Home'}}  />
            <Stack.Screen component={TakeQuiz} name='Quiz' options={{title: 'Categories'}} />
            <Stack.Screen component={Multiplayer} name='Multiplayer' />
            <Stack.Screen component={Globally} name='Globally' options={{title: 'Participate Globally'}}/>
            <Stack.Screen component={Create} name='Create' options={{title: 'Create Quiz'}} />
            <Stack.Screen component={Settings} name='Settings' />
            <Stack.Screen component={About} name='About' />
            <Stack.Screen component={QuizSettings} name='QuizSettings' options={{title: 'Quiz Settings'}}/>
            <Stack.Screen component={QuizPage} name='quizPage' options={{title: 'Quiz', headerLeft:null}}/>
            <Stack.Screen component={QuizSolutions} name='quizSolutions' options={{title: 'Quiz Solutions', headerTitleAlign:'left'}}/>
            <Stack.Screen component={QuizHistory} name='quizhistory' options={{title: 'Quiz History'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </myContext.Provider>
    
  )
}