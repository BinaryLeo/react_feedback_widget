import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton"
interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
}
export function FeedbackContentStep({ feedbackType }: FeedbackContentStepProps) {
    const feedbackTypeData = feedbackTypes[feedbackType];
    return (
        <>
            <header>
                <span className="text-xl leading-6"></span>
                <CloseButton />
            </header>
            <div className="flex py-8 gap-2 w-full">
                {feedbackTypeData.title}
            </div>
        </>
    )
}