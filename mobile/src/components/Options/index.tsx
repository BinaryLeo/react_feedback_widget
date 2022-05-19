import React from "react";
import { View, Text } from "react-native";
import { Copyright } from "../Copyright";
import {Option } from "../Option";
import {feedbackTypes} from '../../utils/feedbackTypes'
import { styles } from "./styles";

export function Options() {
  return (
    <View style={styles.container}>
         <Text style={styles.title}>Please Give us your Feedback!</Text>
        <View style={styles.options}>
            {
            Object
            .entries(feedbackTypes)
            .map(([key, value]) =>
            (
              <Option 
              key={key}
              title={value.title}
              image={value.image}
              
              />  
            ))
            }
        </View>
      <Copyright />
    </View> 
  );
}
