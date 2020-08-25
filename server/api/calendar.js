const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const { calAuth } = require("../.env");
const moment = require("moment");
const base32 = require("base32");

const oAuth2Client = new OAuth2(calAuth.ID, calAuth.secret);

oAuth2Client.setCredentials({ refresh_token: calAuth.token });

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

const buildSessionsList = (
  startTime = { hour: 0, min: 0 },
  endTime = { hour: 0, min: 0 },
  granularity = 60,
  date
) => {
  const start = moment(date)
    .hour(startTime.hour)
    .minute(startTime.min)
    .second(0)
    .millisecond(0);
  const end = moment(date)
    .hour(endTime.hour)
    .minute(endTime.min)
    .second(0)
    .millisecond(0);

  const timeSpans = Math.ceil(moment(end).diff(start, "minutes") / granularity);

  let sessions = [];

  for (let i = 0; i < timeSpans; i++) {
    const startHour = moment(start)
      .add(granularity * i, "minutes")
      .format("HH");
    const startMin = moment(start)
      .add(granularity * i, "minutes")
      .format("mm");
    const endHour = moment(start)
      .add(granularity * (i + 1), "minutes")
      .format("HH");
    const endMin = moment(start)
      .add(granularity * (i + 1), "minutes")
      .format("mm");

    sessions.push({
      key: `${i}`,
      label: `${startHour}:${startMin}-${endHour}:${endMin}`,
      start: moment(start)
        .add(granularity * i, "minutes")
        .second(0),
      end: moment(start)
        .add(granularity * (i + 1), "minutes")
        .second(0),
      disabled: false,
    });
  }
  return sessions;
};

const disableSessions = (sessions, eventsList) => {
  return sessions.map((session) => {
    const newSession = { ...session };
    newSession.disabled =
      eventsList.reduce((previousValue, event) => {
        const shouldDisable =
          moment(event.start).isBetween(
            session.start,
            session.end,
            undefined,
            "[]"
          ) &&
          moment(event.end).isBetween(
            session.start,
            session.end,
            undefined,
            "[]"
          );
        return previousValue || shouldDisable;
      }, false) ||
      moment(session.start).weekday() === 0 ||
      moment(session.start).weekday() === 6;
    return newSession;
  });
};

module.exports = (app) => {
  const getAppointment = async (req, res) => {
    app
      .db("appointments")
      .select()
      .whereNull("deletedAt")
      .where({ userId: req.user.id })
      .then((appointments) => {
        if (appointments.length > 0) {
          const appointment = appointments[appointments.length - 1];
          const isSameOrBefore = moment(
            appointment.sessionStart
          ).isSameOrBefore(moment(), "hour");
          if (isSameOrBefore)
            res.status(204).send({
              id: null,
              sessionStart: null,
              sessionEnd: null,
            });
          else res.status(200).send(appointment);
        } else
          res.status(204).send({
            id: null,
            sessionStart: null,
            sessionEnd: null,
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSessionsList = (req, res) => {
    try {
      const dateBegining = moment(req.body.date)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const dateEnding = moment(req.body.date)
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999);

      calendar.events
        .list({
          calendarId: calAuth.calendarId,
          timeMin: moment(dateBegining).toISOString(),
          timeMax: moment(dateEnding).toISOString(),
        })
        .then((calendar) => {
          const calendarEvents = calendar.data.items;
          const appointments = calendarEvents.map((event) => {
            return {
              start: event.start.dateTime,
              end: event.end.dateTime,
            };
          });
          const rawSessions = buildSessionsList(
            { hour: 14, min: 0 },
            { hour: 21, min: 0 },
            60,
            dateBegining
          );
          const sessions = disableSessions(rawSessions, appointments);
          res.status(200).send(sessions);
        });
    } catch (err) {
      res.status(500).send();
      console.log(err);
    }
  };

  const scheduleSession = async (req, res) => {
    const session = { ...req.body };
    const event = {
      summary: session.summary,
      location: null,
      description: req.user.id,
      start: {
        dateTime: session.start,
        timeZone: "America/Fortaleza",
      },
      end: {
        dateTime: session.end,
        timeZone: "America/Fortaleza",
      },
      reminders: {
        useDefault: "false",
        overrides: [
          { method: "popup", minutes: 60 },
          { method: "email", minutes: 24 * 60 },
        ],
      },
    };
    calendar.freebusy.query(
      {
        resource: {
          timeMin: new Date(event.start.dateTime).toISOString(),
          timeMax: new Date(event.end.dateTime).toISOString(),
          timeZone: "America/Fortaleza",
          items: [{ id: calAuth.calendarId }],
        },
      },
      (err, response) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        const isBusyArr = response.data.calendars[`${calAuth.calendarId}`].busy;

        if (isBusyArr.length === 0)
          return calendar.events.insert(
            {
              calendarId: calAuth.calendarId,
              resource: event,
            },
            (err, response) => {
              if (err) {
                console.log(err);
                return res.status(500).send(err);
              }

              const appointmentLog = {
                sessionStart: response.data.start.dateTime,
                sessionEnd: response.data.end.dateTime,
                eventId: response.data.id,
                userId: req.user.id,
                psychoId: 1,
                createdAt: moment(response.data.created).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
              };
              app
                .db("appointments")
                .insert(appointmentLog)
                .catch((err) => console.log(err));

              return res.status(200).send("Sessão agendada com sucesso!");
            }
          );
        return res.status(400).send("Horário ocupado!");
      }
    );
  };

  const deleteSession = (req, res) => {
    calendar.events
      .update({
        calendarId: calAuth.calendarId,
        eventId: req.body.id,
        requestBody: {
          summary: "SESSÃO CANCELADA",
          description: `Sessão cancelada por ${req.user.name}`,
          end: {
            dateTime: req.body.end,
          },
          start: {
            dateTime: req.body.start,
          },
        },
      })
      .then(() => {
        app
          .db("appointments")
          .update({ deletedAt: moment().format("YYYY-MM-DD HH:mm:ss") })
          .where({ eventId: req.body.id })
          .catch((err) => console.log(err));
        res.status(200).send("Sessão cancelada com sucesso!");
      })
      .catch((err) => {
        res.status(500).send("Falhou.");
        console.log(err);
      });
  };

  return { getAppointment, scheduleSession, deleteSession, getSessionsList };
};
