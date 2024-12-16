import { View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Rate(){
    return(
        <View style={{flex:1, flexDirection: 'row'}}>
            <FontAwesome name="star" size={24} color="#33ff55" />
            <FontAwesome name="star" size={24} color="#33ff55" />
            <FontAwesome name="star" size={24} color="#33ff55"/>
            <FontAwesome name="star" size={24} color="#33ff55" />
            <FontAwesome name="star-half-empty" size={24} color="#33ff55" />
        </View>
    )
}