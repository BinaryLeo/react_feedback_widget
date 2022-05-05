import html2canvas from "html2canvas";
import { Camera } from "phosphor-react";
import { useState } from "react";

export function ScreenshotButton(){
    const [isTakenScreenshot, setIsTakenScreenShot] = useState(false);
    async function handleTakeScreenshot(){
        setIsTakenScreenShot(true);
        const canvas = await html2canvas(document.querySelector("html")!);
        const base64image = canvas.toDataURL("image/png");
        console.log(base64image);
        setIsTakenScreenShot(false);
    }

    return(
        <button type="button"
        className="p-2 bg-zinc-800 rounded-md border-transparent hover:bg-zinc-700
         transitions-colors focus:outline-none focus:ring-2
         focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500"
         onClick={handleTakeScreenshot}
        >
       <Camera w-6 h-6 text-zinc-100 />
       </button>
    )
}