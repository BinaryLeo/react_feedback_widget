//rnbc snippet - extension: R component
import React, { useRef, useState } from "react";

import { TouchableOpacity } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import { Form } from "../Form";
import { Success } from "../Success";
import { Options } from "../Options";

import { styles } from "./styles";
import { theme } from "../../theme";

import { feedbackTypes } from "../../utils/feedbackTypes";

import { ChatTeardropDots } from "phosphor-react-native";
import BottomSheet from "@gorhom/bottom-sheet";

export type FeedbackType = keyof typeof feedbackTypes; //Key and types
function Widget() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  function handleOpen() {
    bottomSheetRef.current?.expand(); // if ! null expands
  }
  function handleRestartFeedback() {
  setFeedbackType(null);
  setFeedbackSent(false);
  }
  function handleFeedbackSent(){
    setFeedbackSent(true);

  }
  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOpen}>
        <ChatTeardropDots
          size={24}
          weight="bold"
          color={theme.colors.text_on_brand_color}
        />
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, 280]}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
      >
        {feedbackSent ? (
          <Success
          onSendAnotherFeedback={handleRestartFeedback}
          />
        ) : (
          <>
            {feedbackType ? (
              <Form feedbackType={feedbackType}
              onFeedbackCanceled={handleRestartFeedback}
              onFeedbackSent={handleFeedbackSent}
              />
            ) : (
              <Options onFeedbackTypeChanged={setFeedbackType} />
            )}
          </>
        )}
      </BottomSheet>
    </>
  );
}
export default gestureHandlerRootHOC(Widget);
