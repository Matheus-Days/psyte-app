import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import Peer from "simple-peer";
import io from "socket.io-client";
import getUserData from "../scripts/getUserData";
import { AccountCircleRounded } from "@material-ui/icons";
import VideoStreamer from "../custom/VideoStreamer.jsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  chatContainer: {
    marginTop: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  confirmBtns: {
    display: "flex",
    justifyContent: "center",
  },
  list: {
    backgroundColor: "#fdfdfd",
    borderRadius: "5px",
    boxShadow: "2px 2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    marginBottom: "10px",
  },
  mkCallBtns: {
    display: "flex",
    justifyContent: "center",
  },
  videoStreamer: {
    marginBottom: "10px",
  },
});

const VideoChat = ({ open }) => {
  const classes = useStyles();

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [error, setError] = useState("");
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const peer = useRef();

  // This useEffect establishes the event listeners for the Peer signaling
  useEffect(() => {
    // Establishes connection with backend and sends the current user's token for authentication
    socket.current = io({
      query: {
        token: getUserData().token,
      },
    }).connect();
    // Sets the AV stream from user's cam and mic.
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: true })
      .then((stream) => {
        window.localstream = stream;
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((err) => {
        setError("Erro ao acessar câmera e microfone.");
        console.log(err);
      });
    // Recieves and sets the user ID upon connection to ICE server.
    socket.current.on("yourID", (id) => {
      setYourID(id);
    });
    // Recieves and sets the list of current connected users on the server.
    socket.current.on("allUsers", (users) => {
      getUserData().admin ? setUsers(users[0]) : setUsers(users[1]);
    });
    // Event listener that receives and sets if, from where, and the signal of the peer that is calling
    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
    // This is executed when ComponentWillUnmount
    // Closes socket connection and stops media stream.
    return () => {
      socket.current.close();
      window.localstream.getTracks().forEach((track) => track.stop());
    };
  }, []);
  // Function that starts a call
  function callPeer(id) {
    // Creates a WebRTC wrapper for initiator peer.
    peer.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    // Sends a signal to who you wants to call telling your intent.
    peer.current.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID[0],
      });
    });
    // When connection is established this sets the stream comming from the orther peer.
    peer.current.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });
    // This recieves the 'accept' signal from peer so the strem may be established.
    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.current.signal(signal);
    });
    // If the peer disconnects
    if (peer.current.destroyed) {
      setError("O outro usuário se desconectou.");
    }
  }
  // Function for accepting a call
  function acceptCall() {
    setCallAccepted(true);
    // Creates a WebRTC wrapper for reciever peer.
    peer.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    // Sends a 'accept' signal to initiator peer to establish the stream.
    peer.current.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: users[caller] });
    });
    // When connection is established this sets the stream comming from the orther peer.
    peer.current.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });
    // Recieves the signals being sent from the other peer to start a stream.
    // 'callerSignal' references useEffect's event listener 'hey'.
    peer.current.signal(callerSignal);
    // If the peer disconnects
    if (peer.current.destroyed) {
      setError("O outro usuário se desconectou.");
    }
  }

  const micToggle = (disableMic) => {
    stream.getAudioTracks()[0].enabled = disableMic;
  };

  const vidToggle = (disableVideo) => {
    stream.getVideoTracks()[0].enabled = disableVideo;
  };

  const closeIncomingCall = () => {
    setReceivingCall(false);
  };

  const IncomingCall = (
    <Dialog open={receivingCall && !callAccepted} onClose={closeIncomingCall}>
      <Paper>
        <Box m={2}>
          <Typography component="h3">
            {caller} quer iniciar uma chamada de vídeo com você.
          </Typography>
          <Box mt={2} className={classes.confirmBtns}>
            <Box mr={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  acceptCall();
                }}
              >
                Aceitar
              </Button>
            </Box>
            <Box ml={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={closeIncomingCall}
              >
                Recusar
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Dialog>
  );

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogUser, setDialogUser] = useState("");

  const closeConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleClickUser = (user) => {
    setOpenConfirmDialog(true);
    setDialogUser(user);
  };

  const contactList = (
    <div className={classes.list}>
      <Dialog open={openConfirmDialog} onClose={closeConfirmDialog}>
        <Paper>
          <Box m={2}>
            <Typography component="p">
              Iniciar uma chamada com {dialogUser}?
            </Typography>
            <Box mt={2} component="div" className={classes.mkCallBtns}>
              <Box mr={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    callPeer(users[dialogUser]);
                    closeConfirmDialog();
                  }}
                >
                  Sim
                </Button>
              </Box>
              <Box ml={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={closeConfirmDialog}
                >
                  Não
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Dialog>
      <Typography component="p">
        {getUserData().admin ? "Clientes" : "Profissional"} online:
      </Typography>
      <List>
        {Object.keys(users).map((user, i) => {
          return (
            <ListItem
              button
              key={i}
              component="button"
              onClick={() => handleClickUser(user)}
            >
              <ListItemIcon>
                <AccountCircleRounded />
              </ListItemIcon>
              <ListItemText>{user}</ListItemText>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <div>
      <div>
        {error ? (
          <Paper>
            <Typography component="p">{error}</Typography>
          </Paper>
        ) : null}
      </div>
      {callAccepted ? (
        <VideoStreamer
          reference={partnerVideo}
          controlMic={micToggle}
          controlCam={vidToggle}
          controlCallEnd={() => {
            socket.current.destroy();
            open();
          }}
          endButton={true}
          className={classes.videoStreamer}
        />
      ) : (
        <VideoStreamer
          muted
          reference={userVideo}
          controlMic={micToggle}
          controlCam={vidToggle}
          controlCallEnd={open}
          endButton={true}
          className={classes.videoStreamer}
        />
      )}
      <div>{callAccepted ? null : contactList}</div>
      {IncomingCall}
    </div>
  );
};

const VideoRoom = () => {
  const [showVideo, setShowVideo] = useState(false);
  const classes = useStyles();

  const handleClick = () => {
    showVideo ? setShowVideo(false) : setShowVideo(true);
  };

  return (
    <div className={classes.chatContainer}>
      {showVideo ? (
        <VideoChat open={handleClick} />
      ) : (
        <Button variant="contained" color="primary" onClick={handleClick}>
          Conectar-se
        </Button>
      )}
    </div>
  );
};

export default VideoRoom;
