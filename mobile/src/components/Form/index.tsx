import React from "react";
import { ArrowLeft } from "phosphor-react-native";
import { View, TextInput, Image, Text, TouchableOpacity } from "react-native";

import { FeedbackType } from "../../components/Widget";
import { Button } from "../../components/Button";
import { ScreenshotButton } from "../../components/ScreenshotButton";

import { styles } from "./styles";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";

interface Props {
  feedbackType: FeedbackType;
}
export function Form({ feedbackType }: Props) {
  const feedbackTypeInfo = feedbackTypes[feedbackType];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>
      <TextInput
        multiline
        style={styles.input}
        placeholder="Something is not working as expected. Tell us the details of the problem."
        placeholderTextColor={theme.colors.text_secondary}
      />
      <View style={styles.footer}>
        <ScreenshotButton
          screenshot={"https://github.com/binaryleo.png"}
          onRemoveShot={() => {}}
          onTakeShot={() => {}}
        />
        <Button isLoading={false} />
      </View>
    </View>
  );
}
