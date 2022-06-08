import { AppWindow, ArrowLeft } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { FeedbackType, feedbackTypes } from '..';
import { CloseButton } from '../../CloseButton';
import {Loading} from '../Loading';
import { ScreenshotButton } from '../ScreenshotButton';
import {api} from '../../../../lib/api';
interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequest: () => void;
  onFeedbackSent: () => void;
}
export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequest,
  onFeedbackSent,
}: FeedbackContentStepProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const feedbackTypeData = feedbackTypes[feedbackType];
  const [comment, setComment] = useState('');
  const[isSendingFeedback, setIsSendingFeedback] = useState(false);

  async function handleSubmitFeedback(e: FormEvent) {
    e.preventDefault();
    setIsSendingFeedback(true);
    //*console.log({screenshot, comment});
    await api.post('/feedbacks', { 
      type:feedbackType,
      screenshot,
      comment,
    }) 
    
    setIsSendingFeedback(false);
    onFeedbackSent();
  }
  return (
    <>
      <header>
        <button
          type="button"
          className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequest}
        >
          <ArrowLeft weight="bold" w-4 h-4 />
        </button>

        <span className="text-xl leading-6 flex items-center gap-2 mt-2">
          <img
            src={feedbackTypeData.image.source}
            alt={feedbackTypeData.image.alt}
            className="w-6 h-6"
          />
          {feedbackTypeData.title}
        </span>
        <CloseButton />
      </header>
      <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
        <textarea
          className="min-w-[384px] w-full min-h-[112px] text-sm 
        placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md 
        focus:border-brand-500 focus:ring-brand-500 focus:ring-1  resize-none focus:outline-none
          scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
          placeholder="Tell in detail what is happening"
          onChange={(e) => setComment(e.target.value)}
        />
        <footer className=" flex gap-2 mt-2">
          <ScreenshotButton
            screenshot={screenshot}
            onScreenshotTook={setScreenshot}
          />
          <button
            type="submit"
            disabled={comment.length === 0 || isSendingFeedback} //* if comment is empty, disable the button
            className="p-2 bg-brand-500 rounded-md border-transparent flex-1 justify-center
          items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500
           transition-colors disabled:opacity-50 disabled:cursor-not-allowed
           disabled:hover:bg-brand-500"
          >
           {isSendingFeedback? <Loading/> :  "Send feedback"}
          </button>
        </footer>
      </form>
    </>
  )
}
