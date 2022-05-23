//rnbc snippet - extension: R component
import React, {useRef} from "react";
import { TouchableOpacity } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import { Form } from "../Form";
import { Success } from "../Success";
import { ChatTeardropDots } from "phosphor-react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { styles } from "./styles";
import { theme } from "../../theme";
import {feedbackTypes} from "../../utils/feedbackTypes"

export type FeedbackType = keyof typeof feedbackTypes; //Key and types
function Widget() {
 const bottomSheetRef = useRef<BottomSheet>(null);
 function handleOpen(){
   bottomSheetRef.current?.expand(); // if ! null expands
 }
  return (
    <>
      <TouchableOpacity 
      style={styles.button}
      onPress={handleOpen}
      >
        <ChatTeardropDots
          size={24}
          weight="bold"
          color={theme.colors.text_on_brand_color}
        />
      </TouchableOpacity>
      <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[1,280]}//closed and opened
      backgroundStyle={styles.modal}
      handleIndicatorStyle={styles.indicator}


     >
      <Success/>
     </BottomSheet>
    </>
  );
}
export default gestureHandlerRootHOC(Widget)