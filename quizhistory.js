import React, { useEffect, useContext, useState } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system'
import { data as importedData } from "./data";
import { FlatList, View,Text, TouchableOpacity } from "react-native";
import { myContext } from "./myContext";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
export default function QuizHistory({route, navigation}){
    const { quizId, setQuizId,answerValidation,setAnswerValidation,background,setBackground, setMyColor, myColor, allDurationMin, setAllDurationMin, allDurationHr,setAllDurationHr} = useContext(myContext)
    const [renderedDetails, setRenderedDetails] = useState([])
    const [fileContentArray, setFileContentArray] = useState([])
    useEffect(()=>{
        (async()=>{
            // the url for the saved quiz information
            const url = `${FileSystem.documentDirectory}quizhistory.json`
            try {
                var info =await FileSystem.getInfoAsync(url)
                if (info.exists){
                    var fileContent = await FileSystem.readAsStringAsync(url)
                    var fileContentArray =JSON.parse(fileContent)
                    var previous= -1
                    setFileContentArray(fileContentArray)
                    // comparing an elment of array with the previous ones so that it wont render elements with same Id 
                    setRenderedDetails(fileContentArray.filter((element)=>{
                        let addElement = element.quizId != previous;
                        previous = element.quizId
                        return(addElement)
                    }))
                }
            } catch (error) {
                // catches error
            }
        })()
    },[])
    const takeQuizAgain =(score, id, val, hr, min, dif, opt, attempted, category)=>{
        var questionDetails = fileContentArray.filter((e)=>e.quizId==id).map((element)=>({question: element.question, options: element.options, answer: element.answer, difficultyLevel: element.difficultyLevel, category: element.category, explanationn: element.explanation}))
        navigation.navigate('quizPage', { attempted, score,quizId: id, category, questionDetails,totalQuestions: questionDetails.length, difficultyLevel: dif, questionType: opt.length===4? 'multichoice':'true&false', validate:val,durationHr:hr, durationMin:min  })
    }
    return(
        <View style={{flex:1, backgroundColor: myColor}}>
            <FlatList
                ListEmptyComponent={()=>(
                <View style={{height:500,top:100 }}>
                    <Text style={{fontSize:17, color: myColor, textAlign: 'center', backgroundColor:background, marginHorizontal:90, padding:10, borderRadius:5, fontWeight: '700'}}>No Quizzes yet</Text>
                </View>
                )}
                ItemSeparatorComponent={()=>(
                <View style={{borderBottomWidth:0.5, borderTopWidth:0.5, borderColor: '#ffffff55'}}>
                </View>)}
                style={{margin: 9}}
                data = {renderedDetails.reverse()}
                renderItem={({item})=>{
                    return(
                        <View style={{flex:1, paddingHorizontal:7, }}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontSize:15, color: background, paddingVertical: 13}}>Quiz {item.quizId} {`-->`}   Total Questions :
                                    {(()=>{
                                    var sum = 0
                                    fileContentArray.forEach((element)=>{
                                        if (element.quizId === item.quizId ){
                                            sum++;
                                        }
                                    })
                                    return("    "+sum.toString())
                                })()}
                                </Text>
                                <TouchableOpacity onPress ={()=>{takeQuizAgain(item.score, item.quizId, item.validate, item.durationHr, item.durationMin, item.difficultyLevel, item.options, item.attempted, item.scategory)}} style={{justifyContent:'center', marginRight:10}}>
                                    <MaterialCommunityIcons name="send-circle" size={30} color={background} />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <Text style={{fontSize:12, color: '#bec0cf', flex:1.7/3}}>Category : {item.scategory},</Text>
                                <Text style={{fontSize:12, color: '#bec0cf',  flex:1.3/3, textTransform:'capitalize'}}>Difficulty :  {item.difficultyLevel},</Text>
                                <Text style={{fontSize:12, color: '#bec0cf', flex:1/3}}>Top Score: {item.score}</Text>
                            </View>
                        </View>
                    )
                }}
             />
        </View>
    )
}