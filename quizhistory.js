import React, { useEffect, useContext, useState } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system'
import { data as importedData } from "./data";
import { FlatList, View,Text, TouchableOpacity } from "react-native";
import { myContext } from "./myContext";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
export default function QuizHistory({route, navigation}){
    const { quizId, setQuizId,answerValidation,setAnswerValidation,background,setBackground, setMyColor, myColor, allDurationMin, setAllDurationMin, allDurationHr,setAllDurationHr} = useContext(myContext)
    const [renderedDetails, setRenderedDetails] = useState([])
    const [fileContentArray, setFileContentArray] = useState([])
    const optionsOpacity = useSharedValue(0)
    const optionsTop = useSharedValue(100)
    const delOpacity= useSharedValue(1)
    const shiftLeft = useSharedValue(0)

    // Setting the values of the sellected history of a particular quiz Id
    const [score, setScore] = useState(null)
    const [id, setId] = useState(null)
    const [val, setVal] = useState(null)
    const [hr, setHr] = useState(null)
    const [min, setMin] = useState(null)
    const [dif, setDif] = useState(null)
    const [opt, setOpt] = useState(null)
    const [attempted, setAttempted] = useState(null)
    const [category, setCategory] = useState(null)
    const showOptions =(score, id, val, hr, min, dif, opt, attempted, category)=>{
        setScore(score)
        setId(id)
        setVal(val)
        setHr(hr)
        setMin(min)
        setDif(dif)
        setOpt(opt)
        setAttempted(attempted)
        setCategory(category)
        optionsTop.value = withTiming(0, {duration: 500})
        optionsOpacity.value = withTiming(1, {duration: 500})
    }
    const hideOptions =()=>{
        optionsTop.value = withTiming(100, {duration: 500})
        optionsOpacity.value = withTiming(0, {duration:500})
    }
    const delAnimatedStyle = useAnimatedStyle(()=>({opacity: delOpacity.value, left: `${shiftLeft.value}%`}))
    const optionsAnimatedStyle = useAnimatedStyle(()=>({opacity: optionsOpacity.value, top: `${optionsTop.value}%`}))
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
                    }).reverse())
                    console.log(fileContentArray)
                }
            } catch (error) {
                // catches error
            }
        })()
    },[])
    const takeQuizAgain =(score, id, val, hr, min, dif, opt, attempted, category)=>{
        var questionDetails = fileContentArray.filter((e)=>e.quizId==id).map((element)=>({question: element.question, options: element.options, answer: element.answer, difficultyLevel: element.difficultyLevel, category: element.category, explanation: element.explanation}))
        navigation.navigate('quizPage', { attempted, score,quizId: id,putCategory: category, category: 'Quiz History', questionDetails,totalQuestions: questionDetails.length, difficultyLevel: dif, questionType: opt.length===4? 'multichoice':'true&false', validate:val,durationHr:hr, durationMin:min  })
    }
    const deleteFunc =()=>{
        hideOptions() 
        setTimeout(async()=>{
            setRenderedDetails(renderedDetails.filter((element)=>element.quizId !== id ))
            await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}quizhistory.json`, JSON.stringify(fileContentArray.filter((element)=>element.quizId!=id)))
        })
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
                data = {renderedDetails}
                renderItem={({item})=>{
                    return(
                        <Animated.View style={(()=>{
                            if (item.quizId == id){
                                return ([{flex:1, paddingHorizontal:4 }])
                            }
                            else {
                                return ({flex:1, paddingHorizontal:4 })
                            }
                        })()}>
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
                                <View style={{flexDirection: 'row',alignItems: 'center',justifyContent:'space-between', marginRight:2}}>
                                    <TouchableOpacity style={{marginRight:15}} onPress ={()=>{takeQuizAgain(item.score, item.quizId, item.validate, item.durationHr, item.durationMin, item.difficultyLevel, item.options, item.attempted, item.scategory)}} ><MaterialCommunityIcons name="send-circle" size={30} color={background} /></TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{showOptions(item.score, item.quizId, item.validate, item.durationHr, item.durationMin, item.difficultyLevel, item.options, item.attempted, item.scategory)}}><SimpleLineIcons name="options-vertical" size={24} color={background} /></TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <Text style={{fontSize:12, color: '#bec0cf', flex:1.7/3}}>Category : {item.scategory},</Text>
                                <Text style={{fontSize:12, color: '#bec0cf',  flex:1.3/3, textTransform:'capitalize'}}>Difficulty :  {item.difficultyLevel},</Text>
                                <Text style={{fontSize:12, color: '#bec0cf', flex:1/3}}>Top Score: {item.score}</Text>
                            </View>
                        </Animated.View>
                    )
                }}
             />
            <Animated.View style={[{backgroundColor: '#00000000', position:'absolute', height: '100%', width: '100%', justifyContent:'center', alignItems:'center'}, optionsAnimatedStyle]}> 
                <View style={{ paddingVertical:15,paddingHorizontal:20, backgroundColor: '#5e7ab8ff', height:250, width:300, borderRadius:5}}>
                    <TouchableOpacity onPress={()=>{hideOptions()}} style={{alignItems:'flex-end',justifyContent:'flex-start', flex: 1/10, backgroundColor: '#00000000'}}>
                        <MaterialIcons name="cancel" size={20} color='#e8ceed' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{takeQuizAgain(score, id, val, hr, min, dif, opt, attempted, category)}} style={{borderBottomWidth:1, borderColor:"#e8ceed",flexDirection:'row', alignItems:'center', flex: 3/10}}>
                        <FontAwesome5 name="angle-right" size={24} color="#e8ceed" />
                        <Text style={{color:'#e8ceed', paddingLeft:20}}>Take Quiz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        var questionsDetails = fileContentArray.filter((e)=>e.quizId==id).map((element)=>({question: element.question, options: element.options, answer: element.answer, difficultyLevel: element.difficultyLevel, category: element.category, explanation: element.explanation}))
                        navigation.navigate('quizSolutions', {fromWhere: 'history', questionsDetails, category })
                        }} style={{borderColor: "#e8ceed",borderBottomWidth:1,flexDirection:'row', alignItems:'center', flex: 3/10}}>
                        <FontAwesome5 name="angle-right" size={24} color="#e8ceed" />
                        <Text style={{color:'#e8ceed', paddingLeft:20}}>View Solutions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{deleteFunc()}} style={{flexDirection:'row', alignItems:'center', flex: 3/10}}>
                        <FontAwesome5 name="angle-right" size={24} color="#e8ceed" />
                        <Text style={{color:'#e8ceed', paddingLeft:20}}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}