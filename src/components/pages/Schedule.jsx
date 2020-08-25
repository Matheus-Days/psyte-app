import React, { useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import {
  Typography,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Dialog,
  Chip,
  Paper,
} from "@material-ui/core";
import { CalendarTodayTwoTone } from "@material-ui/icons";
import axios from "axios";
import { useEffect } from "react";
import getUserData from "../scripts/getUserData";
import Axios from "axios";
import { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  deleteBtns: {
    display: "flex",
    justifyContent: "center",
  },
  sessions: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
    border: "solid 1px #ddd",
  },
  nextSession: {
    display: "flex",
    flexFlow: "row wrap",
  },
  pickADate: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-end",
  },
  results: {
    width: "100%",
    overflowWrap: "break-word",
  },
  scheduleBtn: {
    display: "flex",
    justifyContent: "center",
  },
  schedulerContainer: {
    margin: "10px auto 0px auto",
    padding: "10px",
    backgroundColor: "#fdfdfd",
    borderRadius: "5px",
    boxShadow: "2px 2px",
    position: "relative",
    maxWidth: "350px",
  },
  sessionsContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

const Schedule = () => {
  const classes = useStyles();
  const [appointment, setAppointment] = useState({
    id: null,
    sessionStart: null,
    sessionEnd: null,
  });

  const getAppointment = (cb, myRequest) => {
    axios({
      url: "api/schedule",
      method: "GET",
      headers: {
        Authorization: `Bearer ${getUserData().token}`,
      },
      responseType: "json",
      cancelToken: myRequest.token,
    })
      .then((res) => {
        cb(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const myRequest = Axios.CancelToken.source();
    getAppointment((data) => {
      setAppointment(data);
    }, myRequest);
    return () => {
      myRequest.cancel();
    };
  }, []);

  const MakeAppointment = () => {
    const [date, setDate] = useState(moment().add(1, "day"));
    const [radioHour, setRadioHour] = useState("");
    const [listLoad, setListLoad] = useState(false);
    const [ListError, setListError] = useState("");
    const [intervalsRadios, setintervalsRadios] = useState([]);
    const [showDialog, setDialog] = useState(false);
    const [postLoad, setPostLoad] = useState(false);
    const [dialogText, setDialogText] = useState("Algo deu errado");

    const unmounted = useRef(false);

    const getSessionsList = (selectedDate, cb, error) => {
      axios({
        method: "POST",
        headers: {
          Authorization: `Bearer ${getUserData().token}`,
        },
        url: "api/sessions",
        data: {
          date: selectedDate,
        },
        responseType: "json",
      })
        .then((res) => {
          cb(res.data);
        })
        .catch((err) => {
          error(err.message);
        });
    };

    const makeAppointment = () => {
      setDialog(true);
      setPostLoad(true);

      const appointment = intervalsRadios.find((radio) => {
        return radio.key === radioHour;
      });

      const data = {
        summary: `Sessão de ${getUserData().name}`,
        description: "Sessão agendada pela internet.",
        start: moment(appointment.start).toISOString(),
        end: moment(appointment.end).toISOString(),
      };

      axios({
        method: "POST",
        headers: {
          Authorization: `Bearer ${getUserData().token}`,
        },
        url: "api/schedule",
        responseType: "json",
        data: data,
      })
        .then((res) => {
          setPostLoad(false);
          setDialogText("Agendamento bem sucedido!");
        })
        .catch((err) => {
          setPostLoad(false);
          setDialogText(
            "Houve um erro com seu pedido de reserva: ou alguém já o agendou ou houve algum erro com o servidor. Tente novamente."
          );
        });
    };

    useEffect(() => {
      getSessionsList(
        moment().add(1, "day"),
        (sessionsList) => {
          if (!unmounted.current) {
            setintervalsRadios(sessionsList);
            setListLoad(true);
          }
        },
        (err) => {
          setListError(err);
        }
      );
      return () => {
        unmounted.current = true;
      };
    }, []);

    const handleDateChange = (newDate) => {
      setDate(newDate);
      getSessionsList(newDate, (sessionsList) => {
        if (!unmounted.current) {
          setintervalsRadios(sessionsList);
        }
      });
    };

    const AppointmentDialog = () => {
      const handleCloseDialog = () => {
        setDialog(false);
        window.location.reload();
      };

      return (
        <Dialog open={showDialog} onClose={handleCloseDialog}>
          <Box m={3}>
            {postLoad ? (
              <CircularProgress />
            ) : (
              <Typography component="p">{dialogText}</Typography>
            )}
          </Box>
        </Dialog>
      );
    };

    const SessionsList = () => {
      return (
        <div className={classes.sessions}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="horários"
              name="session-span"
              value={radioHour}
              onChange={(event) => setRadioHour(event.target.value)}
              row
            >
              {intervalsRadios.map((radio) => {
                return (
                  <FormControlLabel
                    key={radio.key}
                    label={radio.label}
                    value={radio.key}
                    disabled={radio.disabled}
                    control={<Radio color="primary" />}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </div>
      );
    };

    return (
      <div>
        <AppointmentDialog />
        <div className={classes.pickADate}>
          <Box m={1}>
            <Typography component="h5">
              Escolha um dia para verificar a disponibilidade de horários:
            </Typography>
          </Box>
          <Box m={1}>
            <MyDatePicker onDateChange={handleDateChange} date={date} />
          </Box>
        </div>
        <Box m={2} component="div" className={classes.sessionsContainer}>
          {listLoad ? (
            <>{ListError ? ListError.message : <SessionsList />}</>
          ) : (
            <CircularProgress />
          )}
        </Box>
        <Box m={1} component="div" className={classes.scheduleBtn}>
          <Button variant="outlined" onClick={makeAppointment}>
            Reservar horário
          </Button>
        </Box>
      </div>
    );
  };

  const MyDatePicker = ({ date, onDateChange }) => {
    const disableDays = (date) => {
      return moment(date).weekday() === 0 || moment(date).weekday() === 6;
    };

    return (
      <DatePicker
        value={date}
        onChange={onDateChange}
        minDate={moment().add(1, "day")}
        maxDate={moment().add(2, "weeks")}
        shouldDisableDate={disableDays}
        disablePast={true}
        disableToolbar={true}
        format="DD/MM/YYYY"
        views={["date"]}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <CalendarTodayTwoTone />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const ScheduledAppointment = ({ appointment }) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deleteErr, setDeleteErr] = useState("");

    const deleteData = useRef();

    const handleDelete = () => {
      deleteData.current = {
        id: appointment.eventId,
        start: appointment.sessionStart,
        end: appointment.sessionEnd,
      };

      const message = (
        <React.Fragment>
          <Typography component="p">
            Quer mesmo cancelar a sessão marcada para{" "}
            <span style={{ fontWeight: "bold" }}>
              {moment(appointment.sessionStart).format(
                "D [de] MMMM [de] YYYY [às] H:mm"
              )}
            </span>
            ?
          </Typography>
          <br />
          <Typography component="p" style={{ fontSize: "0.9em" }}>
            (Atenção: depois de cancelada a sessão, seu horário só será liberado
            depois que o psicólogo confirmar manualmente o cancelamento em sua
            agenda, porém você já poderá agendar um novo horário imediatamente.)
          </Typography>
        </React.Fragment>
      );

      setDeleteMessage(message);
      setDeleteDialog(true);
    };

    const DeleteDialog = () => {
      const handleDelete = () => {
        axios({
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getUserData().token}`,
          },
          url: "api/schedule",
          data: {
            id: deleteData.current.id,
            start: deleteData.current.start,
            end: deleteData.current.end,
          },
        })
          .then(() => {
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            setDeleteErr("Houve um erro com seu pedido de cancelamento.");
          });
      };

      return (
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          {deleteErr ? (
            <Paper>
              <Box m={2}>
                <Typography component="p">{deleteErr}</Typography>
              </Box>
            </Paper>
          ) : (
            <Paper>
              <Box m={2}>
                {deleteMessage}
                <Box component="div" m={2} className={classes.deleteBtns}>
                  <Box mr={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDelete}
                    >
                      Sim
                    </Button>
                  </Box>
                  <Box ml={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setDeleteDialog(false)}
                    >
                      Não
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
        </Dialog>
      );
    };

    if (appointment.id)
      return (
        <React.Fragment>
          <DeleteDialog />
          <div className={classes.nextSession}>
            <Box m={1}>
              <Typography component="h5">
                Sua próxima sessão agendada:
              </Typography>
            </Box>
            <Box m={1}>
              <Chip
                label={moment(appointment.sessionStart).format(
                  "D [de] MMMM [de] YYYY [às] H:mm"
                )}
                onDelete={handleDelete}
              />
            </Box>
          </div>
        </React.Fragment>
      );
    else
      return (
        <Typography component="p">
          Você não tem nenhuma sessão marcada atualmente.
        </Typography>
      );
  };

  return (
    <Box className={classes.schedulerContainer} component="div" margin={3}>
      {appointment ? (
        <ScheduledAppointment appointment={appointment} />
      ) : (
        <MakeAppointment />
      )}
    </Box>
  );
};

export default Schedule;
