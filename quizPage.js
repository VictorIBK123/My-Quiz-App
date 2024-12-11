import React ,{useContext, useEffect, useState, useRef}from "react";
import * as FileSystem from 'expo-file-system'
import { View,Text, Pressable, FlatList, TouchableOpacity, TouchableHighlight, Button } from "react-native";
import { myContext } from "./myContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated,{ useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { BackHandler } from "react-native";
export default function QuizPage({navigation, route}){
    const [showQuitMenu, setShowQuitMenu] = useState(false)
    const [score, setScore] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const { quizId, setQuizId,answerValidation,setAnswerValidation,background,setBackground, setMyColor, myColor, allDurationMin, setAllDurationMin, allDurationHr,setAllDurationHr} = useContext(myContext)
    const [sureSubmitShow, setSureSubmitShow] = useState(false)
    const [totalTimeInSec, setTotalTimeInSec] = useState((route.params.durationHr*3600)+(route.params.durationMin*60))
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [timeUsedHr, setTimeUsedHr] =useState(0)
    const [timeUsedMin, setTimeUsedMin] = useState(0)
    const [timeUsedSec, setTimeUsedSec] = useState(0)
    const [timeLeftHr, setTimeLeftHr] =useState(route.params.durationHr)
    const [timeLeftMin, setTimeLeftMin] =useState(route.params.durationMin)
    const [timeLeftSec, setTimeLeftSec] =useState(0)
    const [questionOnScreenIndex, setQuestionOnScreenIndex] = useState(0)
    var questionNumberList =[]
    const questionSheetOpacity = useSharedValue(1)
    const questionSheetStyle = useAnimatedStyle(()=>({opacity: questionSheetOpacity.value}))
    const timeCounter = useRef(null)
    const [displayVerify, setDisplayVerify] =useState(false)
    const [validateEach, setValidateEach] =useState(null)
    const [questionsDetails, setQuestionsDetails]=useState(route.params.questionDetails);

    useEffect(()=>{
        const backPressed =()=>{
            setShowQuitMenu(true)
            return(true)
        }
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backPressed)
        return ()=> backHandler.remove()
    },[])
    useEffect(()=>{
// Saving questionHistory
(async()=>{
            
    if (quizSubmitted){
        var toWrite;
        var content;
        const url = `${FileSystem.documentDirectory}quizhistory.json`
        try {
            const info = await FileSystem.getInfoAsync(url)
            if (route.params.category=='Quiz History'){
                content = await FileSystem.readAsStringAsync(url)
                content =JSON.parse(content)
                var scoreToStore;
                var attempted;
                var id;
                var filteredContent = content.filter((element)=>{
                    if (element.quizId == route.params.quizId){
                        scoreToStore = score > route.params.score? score : route.params.score
                    }
                    return (element.quizId !== route.params.quizId)
                })
                contentToStore = filteredContent.concat(questionsDetails.map((element, index)=>{
                    return({...element, 'chosen':-1, onQuestion: false, verified: false, quizId:route.params.quizId, score:scoreToStore,attempted: route.params.attempted+1, scategory: route.params.category, validate: route.params.validate==='each'? 'each':'all', durationHr: route.params.durationHr, durationMin: route.params.durationMin})
                }))
                await FileSystem.writeAsStringAsync(url, JSON.stringify(contentToStore))
            }
            else if (info.exists){
                console.log('file exists')
                content = await FileSystem.readAsStringAsync(url)
                console.log(route.params.durationMin)
                // joins data read from file with new questions (data) generated
                content = JSON.parse(content).concat(questionsDetails.map((element, index)=>{
                    return({...element, 'chosen':-1, onQuestion: false, verified: false, quizId:quizId+1, score,attempted: 1, scategory: route.params.category, validate: route.params.validate==='each'? 'each':'all', durationHr: route.params.durationHr, durationMin: route.params.durationMin})
                }))
                await FileSystem.writeAsStringAsync(url, JSON.stringify(content))
                setQuizId(quizId+1)
            }
            else{
                // same thing as what questionsDetails is set to
                toWrite = JSON.stringify(questionsDetails.map((element, index)=>{
                        return({...element, 'chosen':-1, onQuestion: false, verified: false, quizId: quizId+1, score,attempted:1, scategory: route.params.category, validate: route.params.validate==='each'? 'each':'all', durationHr: route.params.durationHr, durationMin: route.params.durationMin})
                }))
                console.log(toWrite)
                await FileSystem.writeAsStringAsync(url, toWrite)
                setQuizId(quizId+1)
            }
            
        } catch (error) {
            // catch error
        }}
})()
    },[quizSubmitted])
    useEffect(()=>{
        setQuestionsDetails(questionsDetails.map((element, index)=>{
            // Since the first quiz index to be displayed is 0, so onQuestion automatically sets to true
            if (index==0){
                return({...element, 'chosen':-1, onQuestion: true, verified: false})
            }
            else{
                return({...element, 'chosen':-1, onQuestion: false, verified: false})
            }
        }))
        setValidateEach(route.params.validate==='each')
    },[])

    useEffect(()=>{
        if (questionsDetails[questionOnScreenIndex].verified == true){
            setButtonDisabled(true)
        }
        else{
            setButtonDisabled(false)
        }
    },[displayVerify, questionOnScreenIndex])
    useEffect(()=>{
        if (questionsDetails[questionOnScreenIndex].chosen!=-1 && questionsDetails[questionOnScreenIndex].verified===false && validateEach){
            setDisplayVerify(true)
        }
        else{
            setDisplayVerify(false)
        }
    },[questionOnScreenIndex])
    
    useEffect(()=>{
        timeCounter.current =setInterval(()=>{
            setTotalTimeInSec((prev)=>{
                if (prev<=0){
                    clearInterval(timeCounter.current)
                    submissionHandler('timeUp')
                }
                console.log(prev)
                setTimeLeftSec(prev%60)
                setTimeLeftMin(Math.floor(prev/60)%60)
                setTimeLeftHr(Math.floor(prev/3600))

                // setting the seconds used
                setTimeUsedSec(((route.params.durationHr*3600)+(route.params.durationMin*60) -prev)%60)
                setTimeUsedMin(route.params.durationMin- Math.ceil(prev/60)%60)
                setTimeUsedHr(Math.ceil(route.params.durationHr - (prev/3600))) 
                return(prev-1)})
            // setting the seconds left
            
            }, 1000)
        return () => {
            clearInterval(timeCounter.current);
          };
    },[])
    
    // useEffect(()=>{
    //     if (timeUsedHr===allDurationHr && timeUsedMin===allDurationMin && timeUsedSec ===0){
    //         clearInterval(timeCounter.current) 
    //         submissionHandler('timeUp')
    // //     }
    // },[timeLeftHr, timeLeftMin, timeLeftSec])
    for (var i=1; i<=questionsDetails.length; i++){
        questionNumberList.push({questionNumber:i.toString(), key:i})
    }
    var i=0
    const questionOnScreenHandler =(args)=>{
        questionSheetOpacity.value = withSequence(withTiming(0.5, {duration: 0}),withTiming(1, {duration: 700}) )
        if (args === 'next' && questionOnScreenIndex!==questionsDetails.length-1){
            setQuestionOnScreenIndex(questionOnScreenIndex+1)
        }
        else if(args === 'previous' && questionOnScreenIndex!==0){
            setQuestionOnScreenIndex(questionOnScreenIndex-1)
        }
        else if(args!=='next' && args!='previous' ){
            setQuestionOnScreenIndex(args-1)
        }
        
    }
    const optionPressedHandler =(index)=>{
        if (validateEach==true){
            setDisplayVerify(true)
        }
        setQuestionsDetails([...questionsDetails.slice(0,questionOnScreenIndex),{...questionsDetails[questionOnScreenIndex], chosen: index} , ...questionsDetails.slice(questionOnScreenIndex+1, questionsDetails.length)])
    }
    const submissionHandler=(method)=>{
        if (method ==='sure'){
            var tempScore =0
            questionsDetails.forEach((element)=>{
                if (element['answer'] === element['chosen']){
                    tempScore+=1
                }
                setScore(tempScore)
            })
            setQuizSubmitted(true)
            navigation.setOptions({headerRight: ()=>null})
            setSureSubmitShow(false)
        }
        else if (method === 'notSure'){
            setSureSubmitShow(false)
            setQuizSubmitted(false)
        }
        if (method==='buttonPressed'){
            setSureSubmitShow(true)
        }
        else if(method ==='timeUp'){
            questionsDetails.forEach((element)=>{
                if (element['answer'] === element['chosen']){
                    setScore(score+1)
                }
            })
            setQuizSubmitted(true)
            navigation.setOptions({headerRight: ()=>null})
        }
    }
    const verifyAnswer =()=>{
        setQuestionsDetails([...questionsDetails.slice(0,questionOnScreenIndex),{...questionsDetails[questionOnScreenIndex], verified:true}, ...questionsDetails.slice(questionOnScreenIndex+1,questionsDetails.length)])
        setDisplayVerify(false)
    }
    const quitHandler =(shouldQuit)=>{
        if (shouldQuit==='ask'){
            setShowQuitMenu(true)
        }
        else if (shouldQuit==='no'){
            setShowQuitMenu(false)
        }
        else if (shouldQuit==='yes'){
            setShowQuitMenu(false)
            navigation.navigate('Quiz')
        }
    }
    useEffect(()=>{
        navigation.setOptions({
            headerRight: ()=>(<TouchableOpacity onPress={()=>{quitHandler('ask')}} style={{backgroundColor: '#ff5555', paddingVertical:8, paddingHorizontal:18,marginRight: 8, borderRadius:3}}><Text style={{color: background,fontSize: 15}}>Quit</Text></TouchableOpacity>)
        })
    },[navigation])
    
    return(
        <View style={{flex:1, backgroundColor:background}}>
            <View style={{flex: 1.5/10, backgroundColor: myColor, margin:2, borderRadius:8, flexDirection:'row', alignItems: 'center'}}>
                <View style={{flex:1/4,marginLeft:5, borderRightWidth:1, borderColor:background}}>
                    <View>
                        <Text style={{color:background, fontSize:15}}>Duration:</Text>
                    </View>
                    <View >
                        <Text style={{color:'#aaaaff'}}>{(()=>{if (route.params.durationHr.toString().length ==1){return(`0${route.params.durationHr}`)}else{return(route.params.durationHr)}})()} :{(()=>{if (route.params.durationMin.toString().length ==1){return(`0${route.params.durationMin}`)}else{return(route.params.durationMin)}})()} : 00</Text>
                    </View>
                </View>
                <View style={{flex:1/4,marginLeft:5, borderRightWidth:1, borderColor:background}}>
                    <View>
                        <Text style={{color:background, fontSize:15}}>Time Used:</Text>
                    </View>
                    <View >
                        <Text style={{color:'#77ff77'}}>{(()=>{if (timeUsedHr.toString().length ==1){return(`0${timeUsedHr}`)}else{return(timeUsedHr)}})()} : {(()=>{if (timeUsedMin.toString().length ==1){return(`0${timeUsedMin}`)}else{return(timeUsedMin)}})()} : {(()=>{if (timeUsedSec.toString().length ==1){return(`0${timeUsedSec}`)}else{return(timeUsedSec)}})()}</Text>
                    </View>
                </View>
                <View style={{flex:1/4,marginLeft:5}}>
                    <View>
                        <Text style={{color:background, fontSize:15}}>Time Left:</Text>
                    </View>
                    <View >
                        <Text style={{color:'#ff5555'}}>{(()=>{if (timeLeftHr.toString().length ==1){return(`0${timeLeftHr}`)}else{return(timeLeftHr)}})()} : {(()=>{if (timeLeftMin.toString().length ==1){return(`0${timeLeftMin}`)}else{return(timeLeftMin)}})()} : {(()=>{if (timeLeftSec.toString().length ==1){return(`0${timeLeftSec}`)}else{return(timeLeftSec)}})()}</Text>
                    </View>
                </View>
                <Pressable onPress={()=>{submissionHandler('buttonPressed')}} android_ripple={{color: myColor, radius:700}} style={{flex:1/4, alignItems: 'center', justifyContent: 'center', backgroundColor:background, marginRight:6, borderRadius:5}}>
                    <Text style={{color: myColor,paddingVertical:8, fontWeight: 'bold', fontSize:16}}>Submit</Text>
                </Pressable>
            </View>
            <Animated.View style={[{flex: 5/10, backgroundColor: myColor, margin:2, borderRadius:8}, questionSheetStyle]}>
                <View style={{flex:1/7,justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color: background, fontSize:15,textTransform:'uppercase'}}><Text>Question {questionOnScreenIndex+1}</Text> <Text>({questionsDetails[questionOnScreenIndex].category})</Text></Text>
                </View>
                <View style={{flex: 6/7,  paddingRight:5}}>
                   <View>
                   <FlatList
                        ListHeaderComponent={<View style={{flexDirection:'row'}}>
                        <Text adjustsFontSizeToFit={true} style={{color: background, fontSize:15}}>{'>>'}</Text>
                        <Text adjustsFontSizeToFit={true} style={{lineHeight:22,color: background, fontSize:15, paddingLeft:10, paddingRight:5}}>{questionsDetails[questionOnScreenIndex].question}</Text>
                   </View>}
                        ListFooterComponent={questionsDetails[questionOnScreenIndex].verified && <View adjustsFontSizeToFit={true} style={{ paddingLeft:15}}><Text style={{fontSize:15,color: background}}><Text>Answer: </Text><Text style={{textTransform:'capitalize'}}>{`${questionsDetails[questionOnScreenIndex].options[questionsDetails[questionOnScreenIndex].answer]}`}</Text></Text></View>}
                        style={{marginTop:10, marginLeft:20}}
                        data={questionsDetails[questionOnScreenIndex].options.map((element)=>{i+=1;return({value: element, key:i})})}
                        renderItem={({item, index})=>(
                            <Pressable disabled={buttonDisabled} onPress={()=>optionPressedHandler(index)} android_ripple={{color:'white', radius:300}} style={{flexDirection:'row', alignItems:'center', margin:3, paddingLeft:20}}>
                                {(()=>{ if (questionsDetails[questionOnScreenIndex].verified!=true){
                                    if (index === questionsDetails[questionOnScreenIndex].chosen){
                                        return(<Ionicons name="radio-button-on-sharp" size={15} color={background} />)
                                    }
                                    else{
                                        return(<Ionicons name="radio-button-off-sharp" size={15} color={background} />)
                                    }
                                }
                                else{
                                    if (index == questionsDetails[questionOnScreenIndex].chosen){
                                        return(<Ionicons name="radio-button-on-sharp" size={15} color={(()=>{
                                           if (questionsDetails[questionOnScreenIndex].chosen===questionsDetails[questionOnScreenIndex].answer){
                                               return('#a9fc03')
                                           }
                                           else{
                                               return ('#ff0368')
                                           }
                                        })()} />)
                                    }
                                    else if (index==questionsDetails[questionOnScreenIndex].answer){
                                        return(<Ionicons name="radio-button-on-sharp" size={15} color='#a9fc03' />)
                                    }
                                    else{
                                       return(<Ionicons name="radio-button-off-sharp" size={15} color={background} />)
                                    }
                                }
                                    
                                })()}
                                <Text adjustsFontSizeToFit={true} style={{fontSize:15, paddingLeft:10,color: background, textTransform: 'capitalize'}}>{`${item.value}`}</Text>
                            </Pressable>
                        )}
                    /></View>  
                </View>    
            </Animated.View>
            <View style={{flex: 2.5/10, backgroundColor: myColor, margin:2, borderRadius:8, padding:2}}>
                <FlatList
                    data={questionNumberList}
                    numColumns={5}
                    style={{flex:1}}
                    renderItem={({item})=>{
                        return (
                        <TouchableOpacity onPress={()=>{questionOnScreenHandler(item.questionNumber)}} style={{flex:1/5, backgroundColor: (()=>{if (questionsDetails[item.questionNumber-1].chosen!=-1){return('#77ff77');} else{return(background)}})(), margin:6, padding:7, alignItems:'center', borderRadius:3}}>
                            <Text style={{fontSize:15,color:myColor, fontWeight:'bold'}}>{item.questionNumber}</Text>
                        </TouchableOpacity>
                        )
                    }}
                 />
            </View>
            <View style={{flex: 1/10,   borderRadius:8, flexDirection:'row', alignItems:'center'}}>
                <Pressable onPress={()=>{questionOnScreenHandler('previous')}} android_ripple={{color: background, radius:100}} style={{flex:1/2, alignItems:'center',backgroundColor: myColor,margin:2, padding:15, borderRadius:8}}>
                    <Text style={{color:background, fontSize:15}}>Previous</Text>
                </Pressable>
                {!displayVerify &&
                <Pressable onPress={()=>{questionOnScreenHandler('next')}} android_ripple={{color: background, radius:100,}} style={{flex:1/2, alignItems:'center',backgroundColor: myColor,margin:2, padding:15, borderRadius:8}}>
                    <Text style={{color:background, fontSize:15}}>Next</Text>
                </Pressable>
                }
                {validateEach && displayVerify &&
                <Pressable onPress={()=>{verifyAnswer()}} android_ripple={{color: background, radius:100,}} style={{flex:1/2, alignItems:'center',backgroundColor: myColor,margin:2, padding:15, borderRadius:8}}>
                    <Text style={{color:background, fontSize:15}}>Verify</Text>
                </Pressable>
                }
            </View>
            {quizSubmitted && <View style={{position: 'absolute',height:'100%', width:'100%',flex:1,backgroundColor:myColor, justifyContent:'center', alignItems: 'center'}}>
                <View style={{marginBottom:10}}>
                    <Text style={{color: background, fontSize:17}}>Quiz submitted successfully</Text>
                </View>
                <View style={{marginBottom:10}}>
                    <Text style={{color:background, fontSize:23}}>Your score: <Text>{score}</Text> of <Text>{questionsDetails.length}</Text></Text>
                </View>
                <View style={{marginBottom:5}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('quizSolutions', {details: questionsDetails, category: route.params.category})}} style={{backgroundColor:background, borderRadius:4}}>
                        <Text  style={{color: myColor, padding:5, fontWeight: 'bold'}}>Click to view quiz solutions and other details</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginBottom:5}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Quiz')}} style={{backgroundColor:background, borderRadius:4}}>
                        <Text style={{color: myColor, padding:5, fontWeight: 'bold'}}>Take another quiz</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Quiz App')}} style={{backgroundColor:background, borderRadius:4}}>
                        <Text style={{color: myColor, padding:5, fontWeight: 'bold'}}>Click to go home</Text>
                    </TouchableOpacity>
                </View>
            </View>}
            {sureSubmitShow && <View style ={{position: 'absolute', justifyContent: 'center', alignItems: 'center', flex:1, height: '100%', width: '100%', backgroundColor:"#ffffff44"}}>
                <View style={{flex: 2/5, backgroundColor: myColor, width: '90%', borderRadius:6, padding:7, justifyContent:'space-evenly'}}>
                    <View style={{}}><Text style={{color: background, textAlign: 'center'}}>Are you sure you want to submit?</Text></View>
                    <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity onPress={()=>{submissionHandler('sure')}}><Text style={{color: myColor,backgroundColor:  background , padding:6, paddingHorizontal:10,borderRadius:4}}>Yes</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>{submissionHandler('notSure')}}><Text style={{color: myColor, backgroundColor: background, padding:6, paddingHorizontal:10, borderRadius:4}}>No</Text></TouchableOpacity>
                    </View>
                </View>
            </View>}
            {showQuitMenu && <View style ={{position: 'absolute', justifyContent: 'center', alignItems: 'center', flex:1, height: '100%', width: '100%', backgroundColor:"#ffffff44"}}>
                <View style={{flex: 2/5, backgroundColor: myColor, width: '90%', borderRadius:6, padding:7, justifyContent:'space-evenly'}}>
                    <View style={{}}><Text style={{color: background, textAlign: 'center'}}>Are you sure you want to quit?</Text></View>
                    <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity onPress={()=>{quitHandler('yes')}}><Text style={{color: myColor,backgroundColor:  background , padding:6, paddingHorizontal:10,borderRadius:4}}>Yes</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>{quitHandler('no')}}><Text style={{color: myColor, backgroundColor: background, padding:6, paddingHorizontal:10, borderRadius:4}}>No</Text></TouchableOpacity>
                    </View>
                </View>
            </View>}
        </View>
    )
}