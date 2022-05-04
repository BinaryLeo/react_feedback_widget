import { CloseButton } from "./CloseButton";
import bugImageUrl from '../assets/bug.svg';
import ideaImageUrl from '../assets/idea.svg';
import thoughtImageUrl from '../assets/thought.svg';
import { useState } from "react";

const feedbackTypes = {
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
type feedbackTYPE = keyof typeof feedbackTypes;
export function WidgetForm() {
    const [feedbackType, setFeedbackType] = useState<feedbackTYPE | null>(null);

    return (
        <div className="bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">

            <header>
                <span className="text-xl leading-6">Please give us your feedback!</span>
                <CloseButton />
            </header>
            <div className="flex py-8 gap-2 w-full">
                {
                    Object.entries(feedbackTypes).map(([key, value]) => {
                        return (
                            <button
                                key={key}
                                className="bg-zinc-800 rounded py-5 w-24 flex1 flex flex-col items-center gap-2 border-2 border-transparent hover:border-brand-500 focus:border-brand-500 focus:outline-none"
                                type="button"
                                onClick={() => setFeedbackType(key as feedbackTYPE)}
                            >
                                <img src={value.image.source} alt={value.image.alt}></img>
                                <span>{value.title}</span>
                            </button>
                        )
                    })
                }
            </div>
            <footer className="text-xs text-neutral-400">
                Built with 💜 by <a className="underline underline-offset-2" href="https://github.com/binaryleo">Binaryleo</a>
            </footer>
        </div>
    )
}