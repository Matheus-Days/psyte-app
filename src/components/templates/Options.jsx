import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
} from "@material-ui/core";
import { useState } from "react";
import { Delete } from "@material-ui/icons";
import getUserData from "../scripts/getUserData";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    margin: "10px 0 10px 0",
  },
  formContainer: {
    display: "flex",
    flexFlow: "column nowrap",
  },
  innerInput: {
    width: "270px",
    fontSize: "0.9em",
  },
  input: {
    marginLeft: "10px",
  },
  label: {
    fontWeight: "bold",
  },
  mainContainer: {
    maxWidth: "360px",
    marginRight: "auto",
    marginLeft: "auto",
  },
  textField: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    margin: "10px 0 10px 0",
  },
});

const userData = getUserData();

const NameForm = () => {
  const classes = useStyles();
  const [email, setEmail] = useState(userData.email);
  const [name, setName] = useState(userData.name);
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState("");

  const handleDialog = () => {
    dialog ? setDialog(false) : setDialog(true);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const submitName = () => {
    axios({
      url: `api/users/${userData.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
      data: {
        name: name,
      },
    })
      .then(() => {
        localStorage.removeItem("@psyte/userData");
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        setError("Houve um erro ao mudar seu nome, tente novamente.");
      });
  };

  const confirmDialog = (
    <Dialog open={dialog} onClose={handleDialog}>
      {error ? (
        <Box m={2}>
          <Typography component="p">{error}</Typography>
        </Box>
      ) : (
        <Box m={2}>
          <Box mb={1}>
            <Typography component="p">Confirmar alteração de nome?</Typography>
          </Box>
          <Box mb={1}>
            <Typography component="p" style={{ fontSize: "0.9em" }}>
              (Atenção! Ao mudar seu nome, sua sessão será encerrada e você
              precisará se conectar novamente.)
            </Typography>
          </Box>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Box mr={2}>
              <Button variant="contained" color="primary" onClick={submitName}>
                Sim
              </Button>
            </Box>
            <Box ml={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialog}
              >
                Não
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );

  return (
    <Box m={1}>
      <Paper>
        {confirmDialog}
        <Box p={1}>
          <div className={classes.textField}>
            <Typography
              component="label"
              htmlFor="email"
              className={classes.label}
            >
              Email:
            </Typography>
            <TextField
              id="email"
              value={email}
              onChange={handleEmail}
              size="small"
              className={classes.input}
              inputProps={{ className: classes.innerInput }}
              disabled={true}
            />
          </div>
          <div className={classes.formContainer}>
            <div className={classes.textField}>
              <Typography
                component="label"
                htmlFor="name"
                className={classes.label}
              >
                Nome:
              </Typography>
              <TextField
                id="name"
                value={name}
                onChange={handleName}
                className={classes.input}
                inputProps={{ className: classes.innerInput }}
              />
            </div>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleDialog}
            >
              Alterar nome
            </Button>
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

const PasswordForm = () => {
  const classes = useStyles();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState("");

  const handleDialog = () => {
    if (dialog) {
      setDialog(false);
      setError("");
    } else setDialog(true);
  };

  const handleOldPassword = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const submitPassword = () => {
    if (oldPassword && newPassword && confirmPassword)
      axios({
        url: `api/users/${userData.id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        data: {
          newPassword: newPassword,
          oldPassword: oldPassword,
        },
      })
        .then(() => {
          localStorage.removeItem("@psyte/userData");
          window.location.href = "/";
        })
        .catch((err) => {
          console.log(err);
          setError("Senha atual incorreta ou problema no servidor.");
        });
    else {
      setError("Preencha todos os campos de senhas antes de prosseguir.");
    }
  };

  const confirmDialog = (
    <Dialog open={dialog} onClose={handleDialog}>
      {error ? (
        <Box m={2}>
          <Typography component="p">{error}</Typography>
        </Box>
      ) : (
        <Box m={2}>
          <Box mb={1}>
            <Typography component="p">Confirmar alteração de senha?</Typography>
          </Box>
          <Box mb={1}>
            <Typography component="p" style={{ fontSize: "0.9em" }}>
              (Atenção! Ao mudar sua senha, sua sessão será encerrada e você
              precisará se conectar novamente.)
            </Typography>
          </Box>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Box mr={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={submitPassword}
              >
                Sim
              </Button>
            </Box>
            <Box ml={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialog}
              >
                Não
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );

  return (
    <Box m={1}>
      <Paper>
        {confirmDialog}
        <Box p={1} component="div" className={classes.formContainer}>
          <div className={classes.textField}>
            <Typography
              component="label"
              htmlFor="oldPassword"
              className={classes.label}
            >
              Senha atual:
            </Typography>
            <TextField
              id="oldPassword"
              value={oldPassword}
              onChange={handleOldPassword}
              size="small"
              type="password"
              className={classes.input}
            />
          </div>
          <div className={classes.textField}>
            <Typography
              component="label"
              htmlFor="newPassword"
              className={classes.label}
            >
              Nova senha:
            </Typography>
            <TextField
              id="newPassword"
              value={newPassword}
              onChange={handleNewPassword}
              size="small"
              type="password"
              className={classes.input}
            />
          </div>
          <div className={classes.textField}>
            <Typography
              component="label"
              htmlFor="confirmPassword"
              className={classes.label}
            >
              Confirme:
            </Typography>
            <TextField
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              size="small"
              type="password"
              className={classes.input}
            />
          </div>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleDialog}
          >
            Alterar senha
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const AccountRemoval = () => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState("");
  const [require, setRequire] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDialog = () => {
    if (dialog) {
      setDialog(false);
      setRequire(false);
      setError("");
      setConfirmPassword("");
    } else setDialog(true);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const submitRemoval = () => {
    if (confirmPassword)
      axios({
        url: `api/users/${userData.id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        data: {
          confirmPassword: confirmPassword,
        },
      })
        .then(() => {
          localStorage.removeItem("@psyte/userData");
          window.location.href = "/";
        })
        .catch((err) => {
          console.log(err);
          setError("Algo deu errado");
        });
    else {
      setError("Digite sua senha antes de prosseguir.");
    }
  };

  const errorDialog = (
    <Box m={2}>
      <Box mb={2}>
        <Typography component="p">{error}</Typography>
      </Box>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Button color="primary" variant="contained" onClick={handleDialog}>
          VOLTAR
        </Button>
      </Box>
    </Box>
  );

  const requirePassword = (
    <Box m={2}>
      <Box mb={1}>
        <Typography component="p">
          Digite sua senha para prosseguir com a destruição da conta.
        </Typography>
      </Box>
      <Box mb={2} style={{ display: "flex", justifyContent: "center" }}>
        <TextField
          id="confirmPassword"
          value={confirmPassword}
          type="password"
          size="small"
          onChange={handleConfirmPassword}
        />
      </Box>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Box mr={2}>
          <Button variant="contained" color="primary" onClick={submitRemoval}>
            DELETAR
          </Button>
        </Box>
        <Box ml={2}>
          <Button variant="contained" color="primary" onClick={handleDialog}>
            CANCELAR
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const alertDialog = (
    <Box m={2}>
      <Box mb={1}>
        <Typography component="p">Quer mesmo deletar esta conta?</Typography>
      </Box>
      <Box mb={2}>
        <Typography component="p" style={{ fontSize: "0.9em" }}>
          (Após confirmada a remoção você não poderá usar o mesmo e-mail usado
          nesta conta para se cadastrar novamente.)
        </Typography>
      </Box>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Box mr={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRequire(true)}
          >
            Sim
          </Button>
        </Box>
        <Box ml={2}>
          <Button variant="contained" color="primary" onClick={handleDialog}>
            Não
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const confirmDialog = (
    <Dialog open={dialog} onClose={handleDialog}>
      {error ? errorDialog : require ? requirePassword : alertDialog}
    </Dialog>
  );
  return (
    <Box m={1}>
      {confirmDialog}
      <Paper>
        <Box p={1} component="div" className={classes.formContainer}>
          <Button variant="outlined" onClick={handleDialog}>
            Deletar conta
            <Delete color="primary" />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default () => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      <NameForm />
      <PasswordForm />
      <AccountRemoval />
    </div>
  );
};
