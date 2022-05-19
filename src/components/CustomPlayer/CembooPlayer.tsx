import React from "react";
import ReactPlayer from "react-player";

import { convertToHMS } from "../utils";

import "./CembooPlayer.css";

export const CembooPlayer: React.FC<{ url: string }> = ({ url }) => {
  const reactPlayerRef = React.useRef<ReactPlayer>(null);
  const progressBarRef = React.useRef<any>(null);
  const progressAreaTimeRef = React.useRef<any>(null);
  const thumbnailRef = React.useRef<any>(null);
  const videoPlayerContainerRef = React.useRef<any>();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [totalDurationInSeconds, setTotalDurationInSeconds] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(convertToHMS(0));
  const [volume, setVolume] = React.useState(0.5);
  const [completedPlaying, setCompletedPlaying] = React.useState(false);
  const [isPipEnabled, setIsPipEnabled] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCaptions, setShowCaptions] = React.useState(false);
  const [playBackRate, setPlaybackRate] = React.useState(1);
  const [showControls, setShowControls] = React.useState(false);

  // Handle active class
  React.useEffect(() => {
    if (videoPlayerContainerRef.current) {
      videoPlayerContainerRef.current.addEventListener("mouseenter", () => {
        setShowControls(true);
      });

      videoPlayerContainerRef.current.addEventListener("mouseleave", () => {
        if (showCaptions || showSettings) {
          setShowControls(true);
        } else {
          setShowControls(false);
        }
      });
    }
  }, [showCaptions, showSettings]);

  // handle on ready
  const handleOnReady = React.useCallback(() => {
    console.log(reactPlayerRef.current);
  }, []);

  // handle on duration
  const handleDuration = React.useCallback((totalDuration: number) => {
    console.log(totalDuration);
    setTotalDurationInSeconds(totalDuration);
  }, []);

  // Handle play and pause clicks
  const handlePlayPauseVideo = React.useCallback(() => {
    setIsPlaying(!isPlaying);
    if (completedPlaying) {
      setCompletedPlaying(false);
    }
  }, [isPlaying, completedPlaying]);

  // Forward and Rewind handlers
  const handleForwardClick = React.useCallback(() => {
    if (reactPlayerRef.current) {
      const currentTime = reactPlayerRef.current.getCurrentTime();
      reactPlayerRef.current.seekTo(currentTime + 10, "seconds");
    }
  }, []);

  const handleRewindClick = React.useCallback(() => {
    if (reactPlayerRef.current) {
      const currentTime = reactPlayerRef.current.getCurrentTime();
      reactPlayerRef.current.seekTo(currentTime - 10, "seconds");
    }
  }, []);

  // handle progress
  const handleOnProgress = React.useCallback((timeObj) => {
    setCurrentTime(convertToHMS(Math.ceil(timeObj.playedSeconds)));
    const progressBarWidth = timeObj.played * 100 + 0.1;
    if (progressBarRef && progressBarRef.current) {
      progressBarRef.current.style.width = `${progressBarWidth}%`;
    }
  }, []);

  // handle click on progress area to update current time
  const handleProgressAreaClick = React.useCallback(
    (e) => {
      let progressAreaWidth = e.target.clientWidth + 2;
      if (e.target.id === "progress-bar") {
        // gete parent client width
        progressAreaWidth = e.target.parentElement.clientWidth + 2;
      }

      const clickOffsetX = e.nativeEvent.offsetX;

      const currentTime =
        (clickOffsetX / progressAreaWidth) * totalDurationInSeconds;

      setCurrentTime(convertToHMS(Math.ceil(currentTime)));
      reactPlayerRef.current?.seekTo(Math.ceil(currentTime), "seconds");
    },
    [totalDurationInSeconds]
  );

  //   hanlde on seek
  const handleOnSeek = React.useCallback(() => {
    console.log("Called on seek");
  }, []);

  // Volume handler

  const handleVolumeChange = React.useCallback((e) => {
    setVolume(+e.target.value);
  }, []);

  const toggleMute = React.useCallback(() => {
    if (volume === 0) {
      setVolume(0.5);
    } else {
      setVolume(0);
    }
  }, [volume]);

  const volumeIcon = React.useMemo(() => {
    return volume === 0 ? (
      <i className="material-icons volume" onClick={toggleMute}>
        volume_off
      </i>
    ) : volume > 0 && volume <= 0.5 ? (
      <i className="material-icons volume" onClick={toggleMute}>
        volume_down
      </i>
    ) : volume > 0.5 && volume <= 1 ? (
      <i className="material-icons volume" onClick={toggleMute}>
        volume_up
      </i>
    ) : (
      <i className="material-icons volume" onClick={toggleMute}>
        volume_off
      </i>
    );
  }, [volume, toggleMute]);

  const handleMouseMoveOnProgressArea = React.useCallback(
    (e) => {
      let progressAreaWidth = e.target.clientWidth + 2;
      if (e.target.id === "progress-bar") {
        // gete parent client width
        progressAreaWidth = e.target.parentElement.clientWidth + 2;
      }

      let x = e.nativeEvent.offsetX;

      const duration = totalDurationInSeconds;

      const progressTime = Math.floor((x / progressAreaWidth) * duration);

      const currentHour = Math.floor(progressTime / 3600);
      const currentMin = Math.floor(progressTime / 60);
      const currentSec = Math.floor(progressTime % 60);

      if (x >= progressAreaWidth - 100) {
        x = progressAreaWidth - 100;
      } else if (x <= 75) {
        x = 75;
      } else {
        x = e.nativeEvent.offsetX;
      }

      if (progressAreaTimeRef.current) {
        progressAreaTimeRef.current.style.setProperty("--x", `${x}px`);
        progressAreaTimeRef.current.style.display = "block";
      }

      // if seconds are less then 10 then add 0 at the begning
      const currentSecText = currentSec < 10 ? "0" + currentSec : currentSec;
      progressAreaTimeRef.current.innerHTML =
        currentHour !== 0
          ? `${currentHour}:${currentMin}:${currentSecText}`
          : `${currentHour}:${currentMin}:${currentSecText}`;

      thumbnailRef.current.style.setProperty("--x", `${x}px`);
      thumbnailRef.current.style.display = "block";

      // Todo
    },
    [totalDurationInSeconds]
  );

  const handleMouseLeaveFromProgressArea = React.useCallback(() => {
    progressAreaTimeRef.current.style.display = "none";
    thumbnailRef.current.style.display = "none";
  }, []);

  const handleOnVideoEnded = React.useCallback(() => {
    setCompletedPlaying(true);
    setIsPlaying(false);
  }, []);

  const handlePipClick = React.useCallback(() => {
    setIsPipEnabled(!isPipEnabled);
  }, [isPipEnabled]);

  const handleFullScreenClick = React.useCallback(() => {
    if (reactPlayerRef.current) {
    }
  }, []);

  const handelSettingsClick = React.useCallback(() => {
    setShowSettings(!showSettings);
    if (showCaptions) {
      setShowCaptions(false);
    }
  }, [showSettings, showCaptions]);

  const handleCaptionsClick = React.useCallback(() => {
    setShowCaptions(!showCaptions);
    if (showSettings) {
      setShowSettings(false);
    }
  }, [showSettings, showCaptions]);

  const handlePlaybackSpeedClick = React.useCallback((value: number) => {
    setPlaybackRate(value);
  }, []);

  const handleRightClickOnVideo = React.useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    // video element
    <section>
      <div className="cemboo-player-container">
        <div
          id="video_player"
          ref={videoPlayerContainerRef}
          onContextMenu={handleRightClickOnVideo}
        >
          <ReactPlayer
            ref={reactPlayerRef}
            id="main-video"
            url={url}
            width="100%"
            height="100%"
            playing={isPlaying}
            onReady={handleOnReady}
            onDuration={handleDuration}
            onProgress={handleOnProgress}
            onSeek={handleOnSeek}
            onEnded={handleOnVideoEnded}
            volume={volume}
            controls={false}
            pip={isPipEnabled}
            playbackRate={playBackRate}
            onDisablePIP={() => setIsPipEnabled(false)}
            config={{
              file: {
                tracks: [
                  {
                    kind: "subtitles",
                    src: "subs/subtitles.en.vtt",
                    srcLang: "en",
                    default: true,
                    label: "label1",
                  },
                ],
              },
            }}
          />
          <p className="caption_text"></p>
          <div className="thumbnail" ref={thumbnailRef}></div>
          <div className="progressAreaTime" ref={progressAreaTimeRef}>
            00:00
          </div>
          <div className={showControls ? "controls active" : "controls"}>
            <div
              className="progress-area"
              onClick={handleProgressAreaClick}
              onMouseMove={handleMouseMoveOnProgressArea}
              onMouseLeave={handleMouseLeaveFromProgressArea}
            >
              <div
                className="progress-bar"
                id="progress-bar"
                ref={progressBarRef}
              >
                <span></span>
              </div>
            </div>

            <div className="controls-list">
              <div className="controls-left">
                <span className="icon">
                  <i
                    className="material-icons fast-rewind"
                    onClick={handleRewindClick}
                  >
                    replay_10
                  </i>
                </span>
                <span className="icon">
                  {completedPlaying ? (
                    <i
                      className="material-icons replay"
                      onClick={handlePlayPauseVideo}
                    >
                      replay
                    </i>
                  ) : isPlaying ? (
                    <i
                      className="material-icons play_pause"
                      onClick={handlePlayPauseVideo}
                    >
                      pause
                    </i>
                  ) : (
                    <i
                      className="material-icons play_pause"
                      onClick={handlePlayPauseVideo}
                    >
                      play_arrow
                    </i>
                  )}
                </span>
                <span className="icon">
                  <i
                    className="material-icons fast-forward"
                    onClick={handleForwardClick}
                  >
                    forward_10
                  </i>
                </span>
                <span className="icon">
                  {volumeIcon}
                  {/* <i className="material-icons volume">volume_up</i> */}
                  <input
                    type="range"
                    name="volume_range"
                    id="volume_range"
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleVolumeChange}
                    value={volume}
                  />
                </span>
                <div className="timer">
                  <span className="current">{currentTime}</span> /{" "}
                  <span className="duration">
                    {convertToHMS(totalDurationInSeconds)}
                  </span>
                </div>
              </div>
              <div className="controls-right">
                <span className="icon">
                  <i
                    className="material-icons captionsBtn"
                    onClick={handleCaptionsClick}
                  >
                    closed_caption
                  </i>
                </span>
                <span className="icon">
                  <i
                    className="material-icons settingsBtn"
                    onClick={handelSettingsClick}
                  >
                    settings
                  </i>
                </span>
                <span className="icon">
                  <i
                    className="material-icons picture_in_picutre"
                    onClick={handlePipClick}
                  >
                    picture_in_picture_alt
                  </i>
                </span>
                <span className="icon">
                  <i
                    className="material-icons fullscreen"
                    onClick={handleFullScreenClick}
                  >
                    fullscreen
                  </i>
                </span>
              </div>
            </div>
          </div>
          {showSettings && (
            <div id="settings">
              <div className="playback">
                <span>Playback Speed</span>
                <ul>
                  <li
                    data-speed="0.25"
                    className={playBackRate === 0.25 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(0.25)}
                  >
                    0.25
                  </li>
                  <li
                    data-speed="0.5"
                    className={playBackRate === 0.5 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(0.5)}
                  >
                    0.5
                  </li>
                  <li
                    data-speed="0.75"
                    className={playBackRate === 0.75 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(0.75)}
                  >
                    0.75
                  </li>
                  <li
                    data-speed="1"
                    className={playBackRate === 1 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(1)}
                  >
                    Normal
                  </li>
                  <li
                    data-speed="1.25"
                    className={playBackRate === 1.25 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(1.25)}
                  >
                    1.25
                  </li>
                  <li
                    data-speed="1.5"
                    className={playBackRate === 1.5 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(1.5)}
                  >
                    1.5
                  </li>
                  <li
                    data-speed="1.75"
                    className={playBackRate === 1.75 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(1.75)}
                  >
                    1.75
                  </li>
                  <li
                    data-speed="2"
                    className={playBackRate === 2 ? "active" : ""}
                    onClick={() => handlePlaybackSpeedClick(2)}
                  >
                    2
                  </li>
                </ul>
              </div>
            </div>
          )}
          {showCaptions && (
            <div id="captions">
              <div className="caption">
                <span>Select Subtitle</span>
                <ul>
                  <li data-track="OFF" className="active">
                    OFF
                  </li>
                  <li data-track="English">English</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
