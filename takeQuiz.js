// getting the innercategories was a difficult task
// i created an array of the sub categories, setSubCategoriesArray(Object.keys(data[subCategory])), gotten by the array of keys of the category
// then i used the index at each subcategory level to display the inner categories
import React,{useContext,  useState} from "react"
import { data } from "./data"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { GestureDetector } from 'react-native-gesture-handler'
import { Gesture } from 'react-native-gesture-handler'
import Feather from '@expo/vector-icons/Feather';
import Animated,{useSharedValue, useAnimatedStyle, withTiming, withSpring} from "react-native-reanimated"
import { Text, FlatList, View, TouchableOpacity, Dimensions, Image, Pressable, Alert} from "react-native"
import { myContext } from "./myContext"
export default function TakeQuiz ({navigation}){
    const proceedFunc =()=>{
        // to get the subCategories selected
        const subCategoriesSelected = flstListSubCategoriesData.filter((element)=>(element.isTrue)).map((element)=>(
            element.value
        ))
        const innerCategoriesSelected = innerCategoriesDataArray.map((element)=>{
           return(element.filter((element)=>element.isTrue).map((element)=>element.value)) 
        }).filter((element)=>element.length!=0)
        var totalInnerCategoriesSelected =0
        innerCategoriesSelected.forEach(element => {
            element.forEach((element)=>{
                totalInnerCategoriesSelected+=1;
            })
        });
        if (subCategoriesSelected.length!=0 && subCategoriesSelected.length===innerCategoriesSelected.length && totalInnerCategoriesSelected<=5){
                posValue.value = withTiming(700,{duration:750})
                navigation.navigate('QuizSettings',{category, subCategoriesSelected, innerCategoriesSelected})
        }
        else if (subCategoriesSelected.length==0){
            Alert.alert("Error","Please, select at least one sub-category" )
        }
        else if (subCategoriesSelected.length!==innerCategoriesSelected.length){
            Alert.alert("Error","Please, select at least a sub-category from each sections selected" )
        }
        else if(totalInnerCategoriesSelected>5){
            Alert.alert("Error", "Total number of sub-categories selected should not be more than five(5)")
        }
    }
    const [indexPressed, setIndexPressed] = useState(null)
    const [isMarked, setIsMarked] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isMarked2, setIsMarked2] = useState(false)
    const [category, setCategory] = useState(null)
    const categories = Object.keys(data)
    var i=0
    const flatListCategoriesData = categories.map((element)=>{i+=1;return({value:element, key:i})})
    const [subCategoriesData, setSubCategoriesData] = useState(null)
    const [innerCategoriesDataArray, setInnerCategoriesDataArray] =useState(null)
    const [flstListSubCategoriesData, setFlatListSubCategoriesData] = useState(null)
    const {height, width} = Dimensions.get('screen')
    var j=-1
    const posValue = useSharedValue(height)
    const high= useSharedValue(0)
    const scaleY= useSharedValue(0.1)
    const gesture = Gesture.Pan()
    var y=0
    gesture.onStart((e)=>{
        y= e.absoluteY
    })
    gesture.shouldCancelWhenOutside = false
    gesture.onUpdate((e)=>{
        if (y<e.absoluteY){
            posValue.value = withTiming(e.translationY, {duration: 0})
        }
        
    })
    gesture.onEnd((e)=>{
        if (e.absoluteY-y>400 || e.velocityY>=1000){
            posValue.value = withTiming(height, {duration: 500})
        }
        else{
            posValue.value = withTiming(0, {duration: 300})
        }
    })
    const move =()=>{
        posValue.value = withTiming(0,{duration:750})
    }
    const subCategories=useAnimatedStyle(()=>({transform:[{translateY: posValue.value}]}))
    const {quizId, setQuizId,background,setBackground, setMyColor, myColor} = useContext(myContext)
    var i=0
    const imagesData = {
        'Sports':require('./assets/football.jpg'),
        'Science': require('./assets/science.jpg'), 
        'Technology':require('./assets/technology.jpg'),
        'History':require('./assets/history.jpg'),
        'Entertainment':require('./assets/entertainment.jpg'),
        'Religion': require('./assets/religion.jpg'),
        "Economics":require('./assets/economics.jpg'),
        "Quiz History": require('./assets/quizhistory.png'),
        'Natural Languages': require('./assets/language.jpg')
    }
    const categorySelected =(category)=>{
        if (category=='Quiz History'){
            navigation.navigate('quizhistory', {category})
        }
        else {
            setCategory(category)
            setSubCategoriesData(Object.keys(data[category]))
            setIsMarked(Object.keys(data[category]).map(()=>(false)))
            setFlatListSubCategoriesData(Object.keys(data[category]).map((element)=>{i+=1; return({value: element, key:i.toString(), isTrue: false})}))
            setInnerCategoriesDataArray(Object.keys(data[category]).map((element, index)=>{
                return(data[category][Object.keys(data[category])[index]].map((element)=>{
                    i+=1
                    return({value: element, key:i, isTrue: false})
                }))
            }))
            setIsMarked2(false)
            move()
        }
    }
    const subCategoryHandler=(key, index)=>{
        setIndexPressed(index)
        setFlatListSubCategoriesData(flstListSubCategoriesData.map((element)=>{
            if (element.key == key){
                if (element.isTrue==true){
                    setIsMarked([...isMarked.slice(0,index),false, ...isMarked.slice(index+1,isMarked.length)])
                    setInnerCategoriesDataArray([...innerCategoriesDataArray.slice(0,index),innerCategoriesDataArray[index].map((element)=>({...element, isTrue: false})),...innerCategoriesDataArray.slice(index+1, innerCategoriesDataArray.length)])
                }
                return({...element, isTrue:!element.isTrue})
            }
            else{
                return(element)
            }
        }))
    }
    const innerCategoryHandler=(key)=>{
        setInnerCategoriesDataArray(innerCategoriesDataArray.map((element1)=>{
            return(element1.map((element2)=>{
                if (element2.key == key){
                    return({...element2, isTrue:!element2.isTrue })
                }
                else{
                    return(element2)
                }
            }))
        }))
    }
   
    return(
        <View style={{flex:1, backgroundColor: background, padding:5}}>
            <FlatList
                numColumns={2} 
                data={flatListCategoriesData}
                renderItem={({item})=>{
                    return (
                        <Pressable android_ripple={{color:background,radius:1000,borderless:true, foreground:true }} disabled={isDisabled} onPress={()=>{categorySelected(item.value)}} style={{backgroundColor: myColor, flex: 1,height:170, margin:5, justifyContent: 'center', alignItems: 'center', borderRadius:8 }} >
                            <Image source={imagesData[item.value]} style={{flex:1,height:'80%', width:'100%', resizeMode:'cover'}}/>
                            <Text  style={{color: background, textTransform:'capitalize',fontSize: 17, fontWeight: 'bold'}}>{item.value}</Text>
                        </Pressable>
                    )
                }}
             />
            
            <Animated.View style={[{paddingVertical:10,paddingHorizontal: 8, justifyContent:'center', borderTopRightRadius:10, borderTopLeftRadius:10, alignSelf:'center', width:width,height:(90/100)*(height-60), position:'absolute', backgroundColor: myColor, bottom:0}, subCategories]}>
                <GestureDetector gesture={gesture} ><View style={{flex:1/10}}><Text style={{marginTop:3,textAlign: 'center',color:background, paddingHorizontal:8, textTransform: 'capitalize', fontSize: 18}}>SubCategories</Text></View></GestureDetector>
                <View style={{flex:8.3/10}}>
                    <FlatList
                    data={flstListSubCategoriesData}
                    style={{flex:9/10}}
                    initialNumToRender={10}
                    renderItem={({item,index })=>{
                        var show = item.isTrue
                        return (
                            <View>
                                <TouchableOpacity  onPress={()=>{subCategoryHandler(item.key, index)}}  style={{marginVertical:'1.5%', flexDirection: 'row', marginLeft:10, alignItems: 'center'}} >
                                    {item.isTrue && <FontAwesome5 name="check-square" size={17} color={background} />}
                                    {!item.isTrue && <Feather name="square" size={17} color={background} />}
                                    <Text style={{color:background, paddingHorizontal:8, textTransform: 'capitalize', fontSize: 15}}>{item.value}</Text>
                                </TouchableOpacity>
                                <View>
                                    {show && <FlatList
                                        data ={innerCategoriesDataArray[index]}
                                        renderItem={({item})=>{
                                                return (
                                                    <TouchableOpacity onPress={()=>{innerCategoryHandler(item.key)}}  style={{marginLeft:20, flexDirection: 'row', alignItems: 'center'}}>
                                                        {item.isTrue && <FontAwesome5 name="check-square" size={17}
                                                         color={background} />}
                                                        {!item.isTrue && <Feather name="square" size={17} color={background} />}
                                                        <Text style={{color:background, paddingLeft:15, textTransform: 'capitalize', fontSize: 15}}>{item.value}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        }
                                    />}
                                    
                                </View>
                            </View>
                    )}}
                 />
                </View>
                <View style={{flex:0.7/10, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{justifyContent:'flex-end',}}><Text style={{ color: 'white'}}>Pull down from the top to leave</Text></View>
                    <Pressable android_ripple={{color:background,radius:700}} onPress={proceedFunc}  style={{justifyContent:'flex-end', elevation:10,}} ><Text style={{color: myColor,fontSize:14, backgroundColor: background, fontWeight: 'bold', marginHorizontal: 3, padding: 5,borderTopLeftRadius:3,borderBottomLeftRadius:3, borderTopRightRadius:20, borderBottomRightRadius:20}}>PROCEED</Text></Pressable>
                </View>
            </Animated.View>
        </View>
    )
}