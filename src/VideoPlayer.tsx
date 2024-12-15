import {
  Fullscreen,
  Pause,
  Play,
  RotateCcw,
  Speaker,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = () => {
  // state to manage the video playback
  const [isPlayed, setIsPlayed] = useState(false);
  //   state to manage the visibility of the controls
  const [controlsVisible, setIsControlsVisible] = useState(true);
  const [volume, setVolume] = useState(1);
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(-1);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bufferedPercentage, setBufferedPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getVolumeIcon = () => {
    if (volume === 0)
      return (
        <VolumeX fill="white" size={`${isFullScreen ? "2rem" : "1.5rem"}`} />
      );
    if (volume < 0.5)
      return (
        <Volume1 fill="white" size={`${isFullScreen ? "2rem" : "1.5rem"}`} />
      );
    if (volume <= 1)
      return (
        <Volume2 fill="white" size={`${isFullScreen ? "2rem" : "1.5rem"}`} />
      );
  };

  //   ref to the timeout timer which is used to manage the visibility of the controls
  const TimerRef = useRef<number | null>(null);

  //   ref to the video element
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMetadataLoaded = () => {
      if (videoRef.current && videoRef.current.duration) {
        setDurationInSeconds(videoRef.current.duration);
        const totalDuration =
          Math.floor(videoRef.current.duration / 60) +
          ":" +
          Math.floor(videoRef.current.duration % 60)
            .toString()
            .padStart(2, "0");
        setTotalDuration(totalDuration);
      }
    };

    const videoElement = videoRef.current;

    // Add event listener for 'loadedmetadata'
    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", handleMetadataLoaded);
    }

    // Clean up the event listener
    return () => {
      if (videoElement) {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleMetadataLoaded
        );
      }
    };
  }, [videoRef]);

  useEffect(() => {
    const updateBufferedProgress = () => {
      if (videoRef.current && videoRef.current.buffered.length > 0) {
        console.log(videoRef.current.buffered);
        const bufferedEnd = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1
        );
        const percentage = (bufferedEnd / durationInSeconds) * 100;
        console.log(bufferedEnd, percentage);
        setBufferedPercentage(percentage);
      }
    };

    const videoElement = videoRef.current;

    // Add event listener for 'loadedmetadata'
    if (videoElement && durationInSeconds > 0) {
      videoRef.current?.addEventListener("progress", updateBufferedProgress);
    }

    return () => {
      videoRef.current?.removeEventListener("progress", updateBufferedProgress);
    };
  }, [durationInSeconds]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTimeInSeconds(videoRef.current.currentTime);
        const currentTime =
          Math.floor(videoRef.current.currentTime / 60) +
          ":" +
          Math.floor(videoRef.current.currentTime % 60)
            .toString()
            .padStart(2, "0");
        setCurrentTime(currentTime);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [videoRef]);

  useEffect(() => {
    if (!isPlayed) {
      setIsControlsVisible(true);
    }
  }, [isPlayed]);

  //   useEffect to manage the video playback on key press
  useEffect(() => {
    const onFullScreenChange = () => {
      if (document.fullscreenElement === containerRef.current) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    videoRef.current?.addEventListener("ended", () => {
      setIsPlayed(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "f") {
        fullScreenHandler();
      }
    });
    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("keydown", (e) => {
      if (e.key === "m") {
        muteUnmuteHandler();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        playPauseHandler();
      }
    });

    return () => {
      videoRef.current?.removeEventListener("ended", () => {
        setIsPlayed(false);
      });
      document.removeEventListener("keydown", (e) => {
        if (e.key === "f") fullScreenHandler();
      });
      document.removeEventListener("fullscreenchange", onFullScreenChange);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "m") {
          muteUnmuteHandler();
        }
      });
      document.removeEventListener("keydown", (e) => {
        if (e.key === " ") {
          playPauseHandler();
        }
      });
    };
  }, []);

  //   function to manage the visibility of the controls
  const mouseMoveHandler = () => {
    if (TimerRef.current) {
      clearTimeout(TimerRef.current);
    }
    setIsControlsVisible(true);

    TimerRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  const muteUnmuteHandler = () => {
    if (videoRef.current) {
      if (videoRef.current?.volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      } else {
        setVolume(0);
        videoRef.current.volume = 0;
      }
    }
  };

  //   useEffect to manage the visibility of the controls
  useEffect(() => {
    if (isPlayed) {
      TimerRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }

    return () => {
      if (TimerRef.current) {
        clearTimeout(TimerRef.current);
      }
    };
  }, [isPlayed]);

  //   function to manage the video playback
  const playPauseHandler = () => {
    
        
    if (videoRef.current?.ended) {
      setIsPlayed(true);
      videoRef.current.play();
    } else if (videoRef.current?.paused) {
      setIsPlayed(true);
      videoRef.current.play();
    } else {
      setIsPlayed(false);
      videoRef.current?.pause();
      mouseMoveHandler();
    }
  };

  const handleVolumeChange = (event: any) => {
    if (videoRef.current) {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
      videoRef.current.volume = newVolume;
    }
  };

  const fullScreenHandler = () => {
    if (containerRef.current === null) return;

    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    if (videoRef.current && isFullScreen) {
      videoRef.current.controls = !isFullScreen; // Disable default controls in fullscreen
    }
  }, [isFullScreen]);

  const handleTimeChange = (event: any) => {
    if (videoRef.current === null) return;

    const newTime = parseFloat(event.target.value);
    videoRef.current.currentTime = newTime;
  };

  const handleSeekStart = () => {
    if (videoRef.current) {
      setIsPlayed(false);
      videoRef.current.pause();
    }
  };

  const handleSeekEnd = () => {
    if (videoRef.current) {
      setIsPlayed(true);
      videoRef.current.play();
    }
  };

  const handleWaiting = () => {
    setIsLoading(true); // Show loader
  };

  const handleCanPlay = () => {
    setIsLoading(false); // Hide loader
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={mouseMoveHandler}
      className={`${
        controlsVisible ? "cursor-auto" : "cursor-none"
      } rounded-lg relative w-full md:w-[800px] aspect-video  bg-black`}
    >

        {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="loader border-t-transparent border-4 border-white size-12 rounded-full animate-spin"></div>
        </div>
      )}

      <video
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        ref={videoRef}
        id="myVideo"
        onClick={(e) => {
          if (!videoRef.current?.ended) {
            playPauseHandler();
          }
        }}
        className={`${isFullScreen && "z-[1]"} rounded-lg relative z-[1]
        }`}
      >
        <source
          src="https://res.cloudinary.com/dydzkarpe/video/upload/v1734260616/zdhtdewy3dfvcykkxdtu.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div
        className={`${
          controlsVisible ? "opacity-100" : "opacity-0"
        } drop-shadow-2xl shadow-black w-full absolute bottom-0 left-0 z-[9999999999999999999999999] py-4 px-7 flex flex-col justify-start items-start gap-2`}
      >
        <div className="relative w-full h-1 bg-gray-100/30 rounded-full group">
          {/* Buffered Progress */}
          <div
            className="absolute top-0 left-0 h-1 bg-white rounded-full pointer-events-none"
            style={{ width: `${bufferedPercentage}%` }}
          />

          {/* Progress Slider */}
          <input
            type="range"
            min="0"
            max={durationInSeconds}
            step="0.01"
            value={currentTimeInSeconds}
            onInput={(e) => {
              e.currentTarget.blur();
              handleTimeChange(e);
            }}
            onMouseDown={(e) => {
              e.currentTarget.blur();
              handleSeekStart();
            }}
            onMouseUp={(e) => {
              e.currentTarget.blur();
              handleSeekEnd();
            }}
            className="
      absolute top-0 left-0 w-full h-1 appearance-none
      bg-transparent
      cursor-pointer 
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:h-4 
      [&::-webkit-slider-thumb]:w-4 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:bg-blue-500 
      [&::-webkit-slider-thumb]:opacity-0
      group-hover:[&::-webkit-slider-thumb]:opacity-100
      [&::-moz-range-thumb]:appearance-none 
      [&::-moz-range-thumb]:h-4 
      [&::-moz-range-thumb]:w-4 
      [&::-moz-range-thumb]:rounded-full 
      [&::-moz-range-thumb]:bg-blue-500 
      [&::-moz-range-thumb]:opacity-0
      group-hover:[&::-moz-range-thumb]:opacity-100
      z-10
    "
            style={{
              background: `linear-gradient(to right, #3b82f6 ${(
                (currentTimeInSeconds / durationInSeconds) *
                100
              ).toFixed(2)}%, transparent 0%)`,
            }}
          />
        </div>

        {/* <div
          className="absolute top-0 left-0 w-full h-1 bg-blue-500"
          style={{
            width: `${bufferedPercentage}%`,
          }}
        ></div> */}
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 justify-start items-center">
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                playPauseHandler();
              }}
              className={`${
                controlsVisible ? "opacity-100" : "opacity-0"
              } transition-all ease-linear duration-200 text-white `}
            >
              {currentTimeInSeconds === durationInSeconds ? (
                <RotateCcw />
              ) : isPlayed ? (
                <Pause
                  fill="white"
                  size={`${isFullScreen ? "2rem" : "1.5rem"}`}
                />
              ) : (
                <Play
                  fill="white"
                  size={`${isFullScreen ? "2rem" : "1.5rem"}`}
                />
              )}
            </button>
            <div className="flex justify-center items-center gap-2 group">
              <button
                className="text-white focus:outline-none "
                onClick={(e) => {
                  e.currentTarget.blur();
                  muteUnmuteHandler();
                }}
              >
                {getVolumeIcon()}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 transition-all ease-linear duration-75 w-0 opacity-0 group-hover:opacity-100 group-hover:w-[4rem] focus:outline-none"
              />
            </div>
            <div>
              <span className="text-white">{currentTime}</span>
              <span className="text-white"> / </span>
              <span className="text-white">{totalDuration}</span>
            </div>
          </div>
          <button
            className="text-white"
            onClick={(e) => {
              e.currentTarget.blur();
              e.stopPropagation();
              e.preventDefault();
              fullScreenHandler();
            }}
          >
            <Fullscreen
              size={`${isFullScreen ? "2rem" : "1.5rem"}`}
              fill="white"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
