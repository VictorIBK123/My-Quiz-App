import React, {useContext, useEffect} from "react";
import { myContext } from "./myContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Text, View,Pressable } from "react-native";
import { TouchableOpacity } from "react-native";
export default function QuizSolutions({route, navigation}){
    const {background,setBackground, setMyColor, myColor} = useContext(myContext)
    const {details} = route.params;
    var attempted = 0
    details.forEach(element => {
        if (element.chosen!=-1){
            attempted+=1;
        }
    });
    var correct =0
    details.forEach(element => {
        if (element.chosen==element.answer){
            correct+=1;
        }
    });
    var i=0
    useEffect(()=>{
        navigation.setOptions(
            {headerRight: ()=>{
            return(
                <View style={{flexDirection:'row', justifyContent:'space-evenly', marginRight:5}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Quiz App')}} style={{marginVertical:4,padding:6,borderRadius:4,borderWidth:2,borderColor:myColor,backgroundColor:'#a9fc03'}}>
                        <Text>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Quiz')}} style={{marginVertical:4,padding:6,borderRadius:4,borderWidth:2,borderColor:myColor,backgroundColor:'#a9fc03'}}>
                        <Text>Take Quiz</Text>
                    </TouchableOpacity>
                </View>)}}
        )
    })
    return(
        <View style={{backgroundColor: background , flex:1, padding:1}}>
            
                
            
            <FlatList
                data ={details} 
                ListHeaderComponent={<View style={{margin: 5, backgroundColor: myColor, padding:8,borderRadius:5}}>
                <View><Text style={{textTransform: 'uppercase', color: background, fontSize:17, fontWeight: 'bold'}}>Category: <Text style={{fontWeight:'100', textTransform:'capitalize'}}>{route.params.category}</Text></Text></View>
                <View><Text style={{textTransform: 'capitalize', color: background, fontSize:16, fontWeight: 'bold'}}>Total Score:     {correct} of {details.length}</Text></View>
                <View><Text style={{textTransform: 'capitalize', color: background, fontSize:16, fontWeight: 'bold'}}>Total Number of questions:      {details.length}</Text></View>
                <View><Text style={{textTransform: 'capitalize', color: background, fontSize:16,  fontWeight: 'bold'}}>Number of questions attempted:    {attempted}</Text></View>
                <View><Text style={{textTransform: 'capitalize', color: background, fontSize:16, fontWeight: 'bold'}}>Number of questions unattempted:     {details.length-attempted}</Text></View>
                <View><Text style={{textTransform: 'capitalize', color: background, fontSize:16, fontWeight: 'bold'}}>Number of questions attempted correctly:  {correct}</Text></View>
                <View><Text style={{textTransform: 'capitalize', color: background, fontSize:16, fontWeight: 'bold'}}>Number of questions attempted Wrongly: {attempted-correct}</Text></View>
            </View>}
                style={{borderRadius:7}}
                renderItem={({item, index})=>{
                    return(
                        <View style={{  paddingRight:5, backgroundColor: myColor,  marginHorizontal:2, paddingVertical:10}}>
                        <View style={{flexDirection:'row', paddingLeft:15}}>
                             <Text adjustsFontSizeToFit={true} style={{color: background, fontSize:15}}>{index+1}.</Text>
                             <Text adjustsFontSizeToFit={true} style={{lineHeight:22,color: background, fontSize:15, paddingLeft:10, paddingRight:5}}>{item.question}</Text>
                        </View>
                        <View>
                        <FlatList
                             style={{marginTop:10, marginLeft:20}}
                             data={item.options.map((element)=>{i+=1;return({value: element, key:i, chosenOne: item.chosen, answer: item.answer})})}
                             renderItem={({item, index})=>(
                                 <View style={{flexDirection:'row', alignItems:'center', margin:3, paddingLeft:20}}>
                                     {(()=>{
                                         if (index == item.chosenOne){
                                             return(<Ionicons name="radio-button-on-sharp" size={15} color={(()=>{
                                                if (item.chosenOne===item.answer){
                                                    return('#a9fc03')
                                                }
                                                else{
                                                    return ('#ff0368')
                                                }
                                             })()} />)
                                         }
                                         else if (index==item.answer){
                                             return(<Ionicons name="radio-button-on-sharp" size={15} color='#a9fc03' />)
                                         }
                                         else{
                                            return(<Ionicons name="radio-button-off-sharp" size={15} color={background} />)
                                         }
                                     })()}
                                     <Text adjustsFontSizeToFit={true} style={{fontSize:15, paddingLeft:10,color: background, textTransform:'capitalize'}}>{`${item.value}`}</Text>
                                 </View>
                             )}
                         /></View>
                         <View adjustsFontSizeToFit={true} style={{ paddingLeft:15, marginTop:4}}><Text style={{fontSize:15,color: background, }}><Text style={{textTransform: 'uppercase',fontWeight:'bold'}} >SubCategory: </Text><Text style={{color: background, textTransform:'capitalize'}}>{`${item.category}`}</Text></Text></View>
                         <View adjustsFontSizeToFit={true} style={{ paddingLeft:15, marginTop:4}}><Text style={{fontSize:15,color: background, }}><Text style={{textTransform: 'uppercase',fontWeight:'bold'}} >Attempted: </Text><Text style={{color: background, textTransform:'capitalize'}}>{`${item.chosen!=-1}`}</Text></Text></View>
                      <View adjustsFontSizeToFit={true} style={{ paddingLeft:15, marginTop:4}}><Text style={{fontSize:15,color: background, }}><Text style={{textTransform: 'uppercase',fontWeight:'bold'}} >Answer: </Text><Text style={{color: background, textTransform: 'capitalize'}}>{`${item.options[item.answer]}`}</Text></Text></View>
                      <View adjustsFontSizeToFit={true} style={{ paddingLeft:15, marginTop:4}}><Text style={{fontSize:15,color: background}}><Text style={{textTransform: 'uppercase',fontWeight:'bold'}}>Explanation: </Text><Text style={{color:background}}>{item.explanation}</Text></Text></View>
                      <View style={{borderBottomWidth:2, borderColor: 'black', marginTop:10}}></View>
                     </View>
                        
                    )
                }}
             />
        </View>

    )
}