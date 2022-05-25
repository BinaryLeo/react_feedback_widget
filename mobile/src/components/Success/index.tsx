import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import successImg from '../../assets/success.png'; 
import { Copyright } from '../Copyright';
import { styles } from './styles';

interface Props{
onSendAnotherFeedback: () => void;
}

export function Success({ onSendAnotherFeedback }: Props) {
  return (
    <View style={styles.container}>
   <Image
   source={successImg}
    style={styles.image}
   />
    <Text style={styles.title}>We appreciate your feedback</Text>
    <TouchableOpacity
     onPress={onSendAnotherFeedback}
     style={styles.button}
     >
    <Text style={styles.buttonTitle}>Send another feedback</Text>
    </TouchableOpacity>
    <Copyright/>
    </View>
  );
}