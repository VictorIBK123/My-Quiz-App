import React, {useContext, useState} from "react"
import { myContext } from "./myContext"
import { Text, View, TouchableOpacity, Pressable } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'

export default function Settings (){
    const {quizId, setQuizId,allQuestionType, setAllQuestionType,allDifficultyLevel, setAllDifficultyLevel,allTotalQuestions, setallTotalQuestions,answerValidation,setAnswerValidation,background,setBackground, setMyColor, myColor,allDurationMin, setAllDurationMin,allDurationHr, setAllDurationHr } = useContext(myContext)
    const [durationMin, setDurationMin] =useState(allDurationMin)
    const [durationHr, setDurationHr] =useState(allDurationHr)
    const [difficultyLevel, setDifficultyLevel] = useState(allDifficultyLevel)
    const [questionType, setQuestionType] = useState(allQuestionType)
    const [totalQuestions, setTotalQuestions] = useState(allTotalQuestions)
    const [validate, setValidate] = useState(answerValidation)
    const [saved, setSaved] = useState(false)

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
    const saveSettings =()=>{
        setallTotalQuestions(totalQuestions)
        setAllDifficultyLevel(difficultyLevel)
        setAllQuestionType(questionType)
        setAnswerValidation(validate)
        setAllDurationHr(durationHr)
        setAllDurationMin(durationMin)
        setSaved(true)
        // 50 dif tr each 00hr 50 min
    }
    return(
        <View style={{flex:1, backgroundColor: myColor}}>
            <View style={{backgroundColor: '#ffffff22', paddingLeft: 10, padding:5, flex:1.5/20, justifyContent:'center'}}>
                <Text style={{color: 'white', fontSize:15}}>Set Default Quiz Settings</Text>
            </View>
            <View style={{backgroundColor: myColor, margin:5, borderRadius:10, flex:10/20, padding: 5,paddingHorizontal:8}}>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 7/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Total Number of Questions :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:3/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity  onPress={()=>{numberQuestions('reduce')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
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
                        <TouchableOpacity  onPress={()=>{numberQuestions('increase')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="upcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Difficulty Level :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity onPress={()=>{changeLevel('decrease')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
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
                        <TouchableOpacity onPress={()=>{changeLevel('increase')}} style={{flex: 2/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="rightcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Question Type :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity onPress={()=>{changeType('decrease')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
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
                        <TouchableOpacity onPress={()=>{changeType('increase')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="rightcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Answer Validation :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity onPress={()=>{validationHandler('decrease')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
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
                        <TouchableOpacity  onPress={()=>{validationHandler('increase')}} style={{flex: 1.5/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="rightcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', flex: 1/5, justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{flex: 4.5/10, justifyContent:'center'}}>
                        <Text style={{color: background, fontSize: 14}}>Duration :</Text>
                    </View>
                    <View style={{flexDirection: 'row', flex:5.5/10, backgroundColor: background, justifyContent:'center', borderRadius:4}}>
                        <TouchableOpacity onPress={()=>{durationHandler('decrease')}} style={{flex: 1/7, alignItems: 'center', justifyContent:'center',marginVertical:2,paddingLeft:3}}>
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
                        <TouchableOpacity onPress={()=>{durationHandler('increase')}} style={{flex: 1/7, alignItems: 'center', justifyContent:'center', marginVertical:2, paddingRight:3}}>
                            <AntDesign name ="upcircle" size={20} color={myColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={()=>{saveSettings()}}  style={{ flexDirection: 'column', justifyContent:'center', alignItems: 'center', flex:2/20, backgroundColor:background, margin:5, borderRadius:10}}>
                <Text style={{textAlign:'center',fontSize:18, color: myColor}}>Save Settings</Text>
            </TouchableOpacity>
            {saved && <Pressable onPress={()=>{setSaved(false)}} style={{position: 'absolute', bottom: '5%',width: '97%',alignSelf:'center', backgroundColor: '#000000', padding:8, borderRadius: 4}}>
                <Text style={{color:background, }}>x      Settings saved</Text>
            </Pressable>}
        </View>
    )
}