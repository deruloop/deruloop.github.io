import { useEffect, useRef } from "react";
import type { VideoHTMLAttributes } from "react";

/**
 * A muted, looping, inline video that behaves like a gif: it forces playback
 * as soon as possible and never shows a native play button.
 *
 * iOS blocks autoplay in Low Power Mode and with video previews disabled,
 * leaving a play overlay on the poster frame. This component sets the muted
 * attribute for real (React only sets the property), retries play() on the
 * first touch or click and when the tab becomes visible again, and the
 * webkit play overlay is hidden globally in index.css.
 */
const AutoplayVideo = (props: VideoHTMLAttributes<HTMLVideoElement>) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");

    const tryPlay = () => {
      video.play().catch(() => {
        // Blocked for now; the listeners below retry.
      });
    };

    tryPlay();

    const onInteract = () => tryPlay();
    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };
    window.addEventListener("touchstart", onInteract, { passive: true });
    window.addEventListener("click", onInteract);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("click", onInteract);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      {...props}
    />
  );
};

export default AutoplayVideo;
