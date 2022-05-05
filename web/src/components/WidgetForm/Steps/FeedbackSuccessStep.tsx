import { CloseButton } from '../../CloseButton';
import Success from '../../../assets/success.svg';

interface FeedbackSuccessStepProps {
  onFeedbackRestartRequest: () => void;
}
export function FeedbackSuccessStep({
  onFeedbackRestartRequest,
}: FeedbackSuccessStepProps) {
  return (
    <>
      <header>
        <CloseButton />
      </header>
      <div className="flex flex-col items-center py-10 w-[304px]">
        <img src={Success} alt="success" className="w-10 h-10" />
        <span className="text-xl mt-2 leading-6">
          Thank you for your feedback!
        </span>
        <button
          onClick={onFeedbackRestartRequest}
          className="py-2 px-6 mt-6 bg-zinc-800 rounded-md border-transparent text-sm leading-6
            hover:bg-zinc-700 transition-colors duration-200 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500
            "
        >
          Send another feedback
        </button>
      </div>
    </>
  )
}
