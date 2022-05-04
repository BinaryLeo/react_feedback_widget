import bugImageUrl from '../../assets/bug.svg';
import ideaImageUrl from '../../assets/idea.svg';
import thoughtImageUrl from '../../assets/thought.svg';
import { useState } from "react";
import { FeedbackTypeStep } from "./Steps/FeedbackTypeStep";
import { FeedbackContentStep } from "./Steps/FeedbackContentStep";

export const feedbackTypes = {
    BUG: {
        title: "Bug",
        image: {
            source: bugImageUrl,
            alt: "A purple caterpillar image"
        }
    },
    IDEA: {
        title: "Idea",
        image: {
            source: ideaImageUrl,
            alt: "A Lamp image"
        }
    },
    OTHER: {
        title: "Other",
        image: {
            source: thoughtImageUrl,
            alt: "A thought balloon image"
        }
    }

}
export type FeedbackType = keyof typeof feedbackTypes;
export function WidgetForm() {
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);//type of feedback that the user is submitting

    return (
        <div className="bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">
            {!feedbackType ? (

                <FeedbackTypeStep onFeedbackTypeChanged={setFeedbackType} />
                /* the comp. receives a  prop. onFeedbackTypeChanged with a function setFeedbackType*/
            ) : (
                <FeedbackContentStep feedbackType ={feedbackType} />
            )}
            <footer className="text-xs text-neutral-400">
                Built with 💜 by <a className="underline underline-offset-2" href="https://github.com/binaryleo">Binaryleo</a>
            </footer>
        </div>
    )
}