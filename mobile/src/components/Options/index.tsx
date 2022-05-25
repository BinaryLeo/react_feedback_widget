import React from "react";
import { View, Text } from "react-native";

import { Copyright } from "../Copyright";
import {Option } from "../Option";
import {FeedbackType} from "../Widget"
import {feedbackTypes} from '../../utils/feedbackTypes'

import { styles } from "./styles";

interface Props{
  onFeedbackTypeChanged:( feedbackType: FeedbackType) => void;
}
export function Options({onFeedbackTypeChanged}:Props) {
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
              onPress={() => onFeedbackTypeChanged(key as FeedbackType)} //* cast to FeedbackType
              />  
            ))
            }
        </View>
      <Copyright />
    </View> 
  );
}
