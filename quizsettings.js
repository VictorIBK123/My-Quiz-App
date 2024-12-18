import { Alert, Pressable, Text,TouchableOpacity,View } from "react-native";
import React, { useContext, useState,  } from "react";
import { myContext } from "./myContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ActivityIndicator } from "react-native";
import * as Progress from 'react-native-progress'

export default function QuizSettings({navigation, route}) {
    const {allQuestionType, allDifficultyLevel, allTotalQuestions, answerValidation,background,  myColor,allDurationMin,allDurationHr } = useContext(myContext)
    const [durationMin, setDurationMin] =useState(allDurationMin)
    const [durationHr, setDurationHr] =useState(allDurationHr)
    const [difficultyLevel, setDifficultyLevel] = useState(allDifficultyLevel)
    const [questionType, setQuestionType] = useState(allQuestionType)
    const [totalQuestions, setTotalQuestions] = useState(allTotalQuestions)
    const [validate, setValidate] = useState(answerValidation)
    const [isDefault, setIsDefault] =useState(true)
    const [disableGenerateButt, setDisableGenerateButt] = useState(false)
    const [customizeSettingsOpacity, setCustomizeSettingsOpacity] = useState(0.7)
    const [progress, setProgress] = useState(0)
    const API_KEY ="AIzaSyCqNxXZMBNGqQamU9pHXO2wWLvmfCIPR4I"
    var questionDetails;
    
    const generateQuiz =async()=>{
        setDisableGenerateButt(true)
        var result=[];
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `You have to give the json codes only, in the format
             [
        {
            'question': 'What does CSS stand for?',
            'options': ['Cascading Style Sheets', 'Cascading Simple Sheets', 'Computer Style Sheets', 'Creative Style Sheets'],
            'answer': 0,
            'difficultyLevel' : 'easy',
            'category': 'Machine Learning',
            'explanation': 'CSS stands for Cascading Style Sheets, which is used to style the appearance of web pages.'
        },
        {
            'question': 'Which language is used for web apps?',
            'options': ['PHP', 'Python', 'JavaScript', 'All of the above'],
            'answer': 3,
            'difficultyLevel' : 'easy',
            'category': 'Natural Language Processing',
            'explanation': 'All of these languages (PHP, Python, and JavaScript) are commonly used in web development.'
        }]
            'question' is the question you generated according to the category given
            'options' is an array of four options including the answer if multichoice and just two options (True and False) if true&false
            'answer' is the index of the array of options that is the correct answer
            'difficultyLevel' : the difficulty level can be 'easy', 'normal' or 'hard' depending on the prompt I gave you
            'category' is the category of the particular question according to the categories I gave you
            'explanation' is just a brief explanation of the answer or how you got the answer
            The difficulty of the questions will depend on the difficulty level I put in the prompt I gave
            Make sure your questions are random and must not include the previous ones you generated even in previous chats
            The number of questions for each category should be equal to one another but the total number of questions you generated must be exactly equal to the totalQuestions given in the prompt 
            You must not generated more than the questions you are asked to generate and must not generate less
            `,
            generationConfig:{
                temperature:2.0
            } });
            const chat = model.startChat();
            const prompt = `Generate 5 total questions of categories ${route.params.innerCategoriesSelected} with difficulty level ${difficultyLevel} and type ${questionType} questions
        Note: that the total number of questions you generated is not less than 5 and not greater than 5`;
            var tempResult ;
            var networkError;
            if (route.params.category!='Quiz History'){
                try {
                    for (var i=1; i<= parseInt(totalQuestions/5); i++){
                        tempResult  = await chat.sendMessage(prompt);
                        result = result.concat(JSON.parse(tempResult.response.text().replaceAll("```json\n","").replaceAll("\n```","")))
                        setProgress((5*i)/totalQuestions)
                    }
                } catch (error) {
                    if (error.message == '[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: Network request failed'){
                        networkError= true
                    }
                    else{
                        networkError =false
                    }
                    setDisableGenerateButt(false)
                }
                if (!networkError){
                questionDetails = result
                setDisableGenerateButt(false)
                navigation.navigate('quizPage', {
                category: route.params.category, subCategoriesSelected: route.params.subCategoriesSelected, innerCategoriesSelected: route.params.innerCategoriesSelected,questionDetails, totalQuestions, difficultyLevel, questionType, validate,durationHr, durationMin  
            })}
                else{
                    Alert.alert("Network Error", "Please, connect to the internet", [{text:'Try Again'}])
                }
            }
            else {
                setDisableGenerateButt(false)
                navigation.navigate('quizhistory', {
                    category: route.params.category, subCategoriesSelected: route.params.subCategoriesSelected, innerCategoriesSelected: route.params.innerCategoriesSelected,questionDetails, totalQuestions, difficultyLevel, questionType, validate,durationHr, durationMin  
                })
            }    
    }
    const settingsHandler=(settings)=>{
        if (settings==='default'){
            setIsDefault(true)
            setTotalQuestions(allTotalQuestions)
            setDifficultyLevel(allDifficultyLevel)
            setQuestionType(allQuestionType)
            setValidate(answerValidation)
            setDurationHr(allDurationHr)
            setDurationMin(allDurationMin)
            setCustomizeSettingsOpacity(0.7)
        }
        else{
            setIsDefault(false)
            setCustomizeSettingsOpacity(1)
        }
    }
    const numberQuestions=(action)=>{
        if (action =='increase'){
            if (totalQuestions==50){
                setTotalQuestions(5) 
            }
            else{
                setTotalQuestions(totalQuestions+5)
            }
        }
        else if (action =='reduce'){
            if (totalQuestions==5){
                setTotalQuestions(50) 
            }
            else{
                setTotalQuestions(totalQuestions-5)
            }
        }
    }
    const changeLevel=(level)=>{
        if (level==='increase'){
            if (difficultyLevel == 'easy'){
                setDifficultyLevel('normal')
            }
            else if (difficultyLevel== 'normal'){
                setDifficultyLevel('difficult')
            }
        }
        else if(level==='decrease'){
            if (difficultyLevel=='difficult'){
                setDifficultyLevel('normal')
            }
            else if (difficultyLevel=='normal'){
                setDifficultyLevel('easy')
            }
        }
    }
    const changeType =(action)=>{
        if (action==='increase'){
            if (questionType=='multichoice'){
                setQuestionType('true&false')
            } 
            
        }
        else if(action==='decrease'){
            if (questionType == 'true&false'){
                setQuestionType('multichoice')
            }
        }
    }
    const validationHandler=(action)=>{
        if (action==='increase'){
            if (validate=='all'){
                setValidate('each')
            } 
        }
        else if(action==='decrease'){
            if (validate== 'each'){
                setValidate('all')
            }
        }
    }
    const durationHandler =(action)=>{
        if (action =='increase'){
            if (durationMin==55){
                setDurationMin(0)
                setDurationHr(durationHr+1) 
            }
            else{
                setDurationMin(durationMin+5)
            }
        }
        else if (action =='decrease' && (durationHr!==0 || durationMin!=5)){
            if (durationMin==0){
                setDurationHr(durationHr-1)
                setDurationMin(55) 
            }
            else{
                setDurationMin(durationMin-5)
            }
        }
    }
    
    return(
        <View style={{flex:1, backgroundColor: background}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', flex:1/10, backgroundColor:myColor, margin:5, borderRadius:10}}>
                <TouchableOpacity onPress={()=>{settingsHandler('default')}} style={{flexDirection: 'row', justifyContent: 'space-evenly', flex:1/2, alignItems: 'center'}}>
                    <View>
                        <Text style={{color: background}} adjustsFontSizeToFit={true}>Use Default Settings</Text>
                    </View>
                    <View>
                        {isDefault && <Ionicons name="radio-button-on-sharp" size={18} color={background} />}
                        {!isDefault && <Ionicons name="radio-button-off-sharp" size={18} color={background} />}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{settingsHandler('customize')}} style={{flexDirection: 'row', justifyContent: 'space-evenly', flex:1/2, alignItems: 'center'}}>
                    <View>
                        <Text style={{color: background}} adjustsFontSizeToFit={true}>Customize Settings</Text>
                    </View>
                    <View>
                        {isDefault && <Ionicons name="radio-button-off-sharp" size={18} color={background} />}
                        {!isDefault && <Ionicons name="radio-button-on-sharp" size={18} color={background} />}
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: myColor, margin:5, borderRadius:10, flex:5/10, padding: 5,paddingHorizontal:8,opacity:customizeSettingsOpacity}}>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 7/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Total Number of Questions :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:3/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{numberQuestions('reduce')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
                            <AntDesign name ="downcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                        <View style={{flex:3/7, alignItems: 'center', justifyContent:'center',marginVertical:2}}>
                            <Text style={{fontWeight: '700', fontSize: 17, color:myColor}}>{(()=>{
                                if (totalQuestions.toString().length ==1){
                                    return(`0${totalQuestions}`)
                                }
                                else{
                                    return(totalQuestions)
                                }
                            })()}</Text>
                        </View>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{numberQuestions('increase')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="upcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Difficulty Level :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{changeLevel('decrease')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
                            <AntDesign name ="leftcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                        <View  style={{flex:3/7, alignItems: 'center', justifyContent:'center',marginVertical:2}}>
                            { difficultyLevel=='easy' && <View style={{justifyContent: 'center', alignItems: 'center'}} key={0}>
                                <Text style={{fontWeight: '700',color: myColor}}>Easy</Text>
                            </View>}
                            {difficultyLevel == 'normal' && <View style={{justifyContent: 'center', alignItems:'center'}}key={1}>
                                <Text style={{fontWeight: '700',color: myColor}}>Normal</Text>
                            </View>}
                            {difficultyLevel=='difficult' && <View style={{justifyContent: 'center', alignItems: 'center'}} key={2}>
                                <Text style={{fontWeight: '700',color: myColor}}>Difficult</Text>
                            </View>}
                        </View>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{changeLevel('increase')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="rightcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Question Type :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{changeType('decrease')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
                            <AntDesign name ="leftcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                        <View style={{flex:4/7, alignItems: 'center', justifyContent:'center',marginVertical:2}}>
                            {questionType=='multichoice' && <View style={{justifyContent: 'center', alignItems: 'center'}} key={0}>
                                <Text  style={{fontWeight: '700',color: myColor}}adjustsFontSizeToFit={true}>MultiChoice</Text>
                            </View>}
                            {questionType == 'true&false' && <View style={{justifyContent: 'center', alignItems:'center'}}key={1}>
                                <Text style={{fontWeight: '700',color: myColor}} adjustsFontSizeToFit={true}>True/False</Text>
                            </View>}
                            {questionType == 'fillInBlank' && <View style={{justifyContent: 'center', alignItems:'center'}}key={2}>
                                <Text style={{fontWeight: '700',color: myColor}} adjustsFontSizeToFit={true}>Fill in blanks</Text>
                            </View>}
                        </View>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{changeType('increase')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="rightcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Answer Validation :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{validationHandler('decrease')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
                            <AntDesign name ="leftcircle" size={20} color={myColor}/>
                        </TouchableOpacity>
                        <View style={{flex:4/7, alignItems: 'center', justifyContent:'center',marginVertical:2}}>
                            {validate=='all' && <View style={{justifyContent: 'center', alignItems: 'center'}} key={0}>
                                <Text  style={{fontWeight: '700',color: myColor}} adjustsFontSizeToFit={true}>All Questions</Text>
                            </View>}
                            {validate == 'each' && <View style={{justifyContent: 'center', alignItems:'center'}}key={1}>
                                <Text style={{fontWeight: '700',color: myColor}} adjustsFontSizeToFit={true}>Each Questions</Text>
                            </View>}
                        </View>
                        <TouchableOpacity disabled={isDefault} onPress={()=>{validationHandler('increase')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="rightcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 4.5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Duration :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5.5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity onPress={()=>{durationHandler('decrease')}} disabled={isDefault}  style={{flex: 1/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
                            <AntDesign name ="downcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                        <View  style={{flex:5/7, alignItems: 'center', justifyContent:'center',marginVertical:2}}>
                            <Text style={{fontWeight: '700',color: myColor}}>
                            <Text>{(()=>{
                                if (durationHr.toString().length ==1){
                                    return(`0${durationHr}`)
                                }
                                else{
                                    return(durationHr)
                                }
                            })()}</Text> <Text>hr(s)</Text> : <Text>{(()=>{
                                if (durationMin.toString().length ==1){
                                    return(`0${durationMin}`)
                                }
                                else{
                                    return(durationMin)
                                }
                            })()}</Text> <Text>min(s)</Text></Text>
                        </View>
                        <TouchableOpacity onPress={()=>{durationHandler('increase')}} disabled={isDefault} style={{flex: 1/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="upcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Pressable disabled={disableGenerateButt} android_ripple={{color:background,radius:500,borderless:true }} onPress={generateQuiz}  style={{ flexDirection: 'column', justifyContent:'center', alignItems: 'center', flex:2/10, backgroundColor:myColor, margin:5, borderRadius:10}}>
                <Text style={{textAlign:'center',fontSize:18, color: background, opacity:  (()=>{return (disableGenerateButt? 0.5 : 1)})()}}>Generate Quiz Questions</Text>
                {disableGenerateButt && <ActivityIndicator style={{position: 'absolute'}} color={'green'} size={50}/>}
            </Pressable>
            <Text style={{color:myColor, paddingHorizontal:7, fontSize:11}}>Make sure you are connected to the internet.</Text>
            <Text style={{color:myColor, paddingHorizontal:7, fontSize:11}}>Note that the number of questions generated may not be complete because you are using a free version of gemini api.</Text>
            {disableGenerateButt && <View style={{flex: 2/10, justifyContent:'center', alignItems: 'center'}}>
                <Progress.Bar progress={progress} color={myColor} unfilledColor="#ff4455" height={50} borderRadius={5} width={350} />
                <Text style={{position: 'absolute', fontSize: 18, color: background}}>{Math.round(progress*100)}%</Text>
            </View>}
        </View>
    )
}