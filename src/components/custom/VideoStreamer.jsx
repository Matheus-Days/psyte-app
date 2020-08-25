import React, { useState, useRef } from "react";
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Fullscreen,
  FullscreenExit,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles({
  player: {
    position: "initial",
    display: "flex",
    flexDirection: "column",
    background: "#03051A",
    width: "100%",
    minWidth: "250px",
  },
  video: {
    margin: "0",
    width: "100%",
    position: "relative",
    transform: "scaleX(-1)",
    WebkitTransform: "scaleX(-1)",
  },
  controls: {
    margin: "0",
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "stretch",
    background: "#424772aa",
  },
  icons: {
    color: "#b8b8b8",
  },
});

const VideoStreamer = ({
  controlMic,
  controlCam,
  controlCallEnd,
  style,
  className,
  reference,
  muted,
  endButton,
}) => {
  const classes = useStyles();
  const [disableMic, setDisableMic] = useState(false);
  const [disableVideo, setDisableVideo] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const playerRef = useRef();
  const controlsRef = useRef();

  const handleMic = () => {
    disableMic ? setDisableMic(false) : setDisableMic(true);
    try {
      controlMic(disableMic);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCam = () => {
    disableVideo ? setDisableVideo(false) : setDisableVideo(true);
    try {
      controlCam(disableVideo);
    } catch (err) {
      console.log(err);
    }
  };

  const endCall = () => {
    try {
      controlCallEnd();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFullScreen = () => {
    document.fullscreen ? setFullScreen(true) : setFullScreen(false);
    document.fullscreen
      ? document.exitFullscreen()
      : playerRef.current.requestFullscreen();
  };

  return (
    <div
      ref={playerRef}
      className={`${classes.player} ${className}`}
      style={style}
    >
      <video
        ref={reference}
        className={classes.video}
        playsInline
        autoPlay
        muted={muted}
      />
      <div ref={controlsRef} className={classes.controls}>
        <IconButton onClick={handleMic}>
          {disableMic ? (
            <MicOff className={classes.icons} fontSize="large" />
          ) : (
            <Mic className={classes.icons} fontSize="large" />
          )}
        </IconButton>
        <IconButton onClick={handleCam}>
          {disableVideo ? (
            <VideocamOff className={classes.icons} fontSize="large" />
          ) : (
            <Videocam className={classes.icons} fontSize="large" />
          )}
        </IconButton>
        {endButton ? (
          <IconButton onClick={endCall}>
            <CallEnd color="error" fontSize="large" />
          </IconButton>
        ) : null}
        <IconButton onClick={handleFullScreen}>
          {fullScreen ? (
            <FullscreenExit className={classes.icons} fontSize="large" />
          ) : (
            <Fullscreen className={classes.icons} fontSize="large" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default VideoStreamer;
