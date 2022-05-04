import { ArrowLeft } from "phosphor-react";
import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";
interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequest: () => void;
}
export function FeedbackContentStep({
     feedbackType,
     onFeedbackRestartRequest
     }: FeedbackContentStepProps) {
    const feedbackTypeData = feedbackTypes[feedbackType];
    return (
        <>
            <header>
                <button 
                type="button" 
                className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
                 onClick={onFeedbackRestartRequest}
                 >
                 <ArrowLeft weight="bold" w-4 h-4/>
                </button>

                <span className="text-xl leading-6 flex items-center gap-2 mt-2">
                <img 
                src={feedbackTypeData.image.source} 
                alt={feedbackTypeData.image.alt} className="w-6 h-6"/>
                {feedbackTypeData.title}
                </span>
                <CloseButton />
            </header>
            <div className="flex py-8 gap-2 w-full">
               
            </div>
        </>
    )
}