import html2canvas from 'html2canvas';
import { Camera, Trash } from 'phosphor-react';
import { useState } from 'react';
import { Loading } from './Loading';

interface ScreenshotButtonProps {
  screenshot: string | null;
  onScreenshotTook: (screenshot: string | null) => void;
}
export function ScreenshotButton({
  screenshot,
  onScreenshotTook,
}: ScreenshotButtonProps) {
  const [isTakenScreenshot, setIsTakenScreenShot] = useState(false)
  async function handleTakeScreenshot() {
    setIsTakenScreenShot(true);
    const canvas = await html2canvas(document.querySelector('html')!);
    const base64image = canvas.toDataURL('image/png');
    onScreenshotTook(base64image);//send the screenshot to the parent component
    setIsTakenScreenShot(false);//reset the state
  }
  if (screenshot) {
    return (
      <button
        type="button"
        className="p-1 w-10 h-10 rounded-md border-transparent flex 
                justify-end items-end text-zinc-400 hover:text-zinc-100 transition-colors"
        onClick={() => onScreenshotTook(null)}
        style={{
          backgroundImage: `url(${screenshot})`,
          backgroundPosition: 'right bottom',
          backgroundSize: 180,// a small preview of the screenshot
        }}
      >
        <Trash weight="fill" />
      </button>
    )
  }
  return (
    <button
      type="button"
      className="p-2 bg-zinc-800 rounded-md border-transparent hover:bg-zinc-700
         transitions-colors focus:outline-none focus:ring-2
         focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500"
      onClick={handleTakeScreenshot}
    >
      {isTakenScreenshot ? <Loading /> : <Camera weight="bold" w-6 h-6 />}
    </button>
  )
}
