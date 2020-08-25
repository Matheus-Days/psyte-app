import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { AccountCircleRounded } from "@material-ui/icons";
import MaskedInput from "react-text-mask";
import axios from "axios";
import getUserData from "../scripts/getUserData";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formButtons: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-around",
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  optionsButtons: {
    width: "200px",
  },
}));

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        "(",
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const LoginDialog = (props) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userName, setUserName] = useState(getUserData().name);
  const [isLogged] = useState(!!getUserData().name);
  const [loadUser, setLoadUser] = useState(false);
  const [userError, setUserError] = useState("");

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUserError("");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const AuthDialog = () => {
    const [signinEmail, setSigninEmail] = useState("");
    const [signinPassword, setSigninPassword] = useState("");
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPhone, setSignupPhone] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);
    const [nameHelper, setNameHelper] = useState("");
    const [emailHelper, setEmailHelper] = useState("");
    const [phoneHelper, setPhoneHelper] = useState("");
    const [passwordHelper, setPasswordHelper] = useState("");
    const [confirmPasswordHelper, setConfirmPasswordHelper] = useState("");

    const extractPhoneNumber = (value) => {
      let number = value.replace(/\D/g, "");
      return number;
    };

    const signin = {
      handleEmail: (event) => {
        setSigninEmail(event.target.value);
      },
      handlePassword: (event) => {
        setSigninPassword(event.target.value);
      },
    };

    const signup = {
      handleName: (event) => {
        setSignupName(event.target.value);
      },
      nameBlur: (event) => {
        if (event.target.value) {
          setNameErr(false);
          setNameHelper("");
        } else {
          setNameErr(true);
          setNameHelper("Preencha com seu nome completo.");
        }
      },
      handleEmail: (event) => {
        setSignupEmail(event.target.value);
      },
      emailBlur: (event) => {
        if (event.target.value) {
          setEmailErr(false);
          setEmailHelper("");
        } else {
          setEmailErr(true);
          setEmailHelper("Preencha com um e-mail válido.");
        }
      },
      handlePhone: (event) => {
        setSignupPhone(event.target.value);
      },
      phoneBlur: (event) => {
        const number = extractPhoneNumber(event.target.value);
        if (number) {
          setPhoneErr(false);
          setPhoneHelper("");
        } else {
          setPhoneErr(true);
          setPhoneHelper("Um telefone para contato é obrigatório.");
        }
      },
      handlePassword: (event) => {
        setSignupPassword(event.target.value);
      },
      passwordBlur: (event) => {
        if (event.target.value) {
          setPasswordErr(false);
          setPasswordHelper("");
        } else {
          setPasswordErr(true);
          setPasswordHelper("Preencha com uma senha.");
        }
      },
      handleConfirmPassword: (event) => {
        setSignupConfirmPassword(event.target.value);
      },
      confirmPasswordBlur: (event) => {
        if (event.target.value) {
          if (event.target.value === signupPassword) {
            setConfirmPasswordErr(false);
            setConfirmPasswordHelper("");
          } else {
            setConfirmPasswordErr(true);
            setConfirmPasswordHelper("Não confere com a senha acima.");
          }
        } else {
          setConfirmPasswordErr(true);
          setConfirmPasswordHelper(
            "Preencha com a mesma senha digitada acima."
          );
        }
      },
    };

    const submitSignin = (data) => {
      setLoadUser(true);
      axios({
        url: "api/signin",
        method: "POST",
        data: {
          email: data.email || signinEmail,
          password: data.password || signinPassword,
        },
      })
        .then((res) => {
          localStorage.setItem("@psyte/userData", JSON.stringify(res.data));
          setUserName(res.data.name);
          window.location.href = "/";
        })
        .catch((err) => {
          setLoadUser(false);
          setUserError("Não foi possível autenticar esse usuário.");
          console.log(err);
        });
    };

    const submitSignup = () => {
      if (
        nameErr ||
        emailErr ||
        phoneErr ||
        passwordErr ||
        confirmPasswordErr
      ) {
        setUserError(
          "Você deve preencher corretamente todos os campos em branco para poder se cadastrar."
        );
      } else {
        const signupData = {
          name: signupName,
          email: signupEmail,
          phone: extractPhoneNumber(signupPhone),
          password: signupPassword,
          confirmPassword: signupConfirmPassword,
        };
        setLoadUser(true);
        axios({
          url: "api/signup",
          method: "POST",
          data: signupData,
        })
          .then((res) => {
            submitSignin(signupData);
          })
          .catch((err) => {
            console.log(err);
            setLoadUser(false);
            setUserError(
              "Houve um problema ao tentar criar seu usuário, tente novamente."
            );
          });
      }
    };

    return (
      <div className={classes.tabs}>
        <AppBar position="static" color="inherit">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="simple tabs example"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="ENTRAR" {...a11yProps(0)} />
            <Tab label="REGISTRAR-SE" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="E-mail"
              type="email"
              value={signinEmail}
              onChange={signin.handleEmail}
              fullWidth
            />
            <TextField
              margin="dense"
              id="password"
              label="Senha"
              type="password"
              onChange={signin.handlePassword}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <div className={classes.formButtons}>
              <Button
                onClick={submitSignin}
                color="primary"
                variant="contained"
              >
                ENTRAR
              </Button>
              <Button
                onClick={handleDialogClose}
                color="primary"
                variant="contained"
              >
                VOLTAR
              </Button>
            </div>
          </DialogActions>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              Preencha os campos abaixo para se registrar e assim ter acesso aos
              recursos deste site. Use um e-mail e telefone com o qual o
              profissional possa entrar em contato com você.
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label="Nome completo"
              type="text"
              value={signupName}
              onChange={signup.handleName}
              error={nameErr}
              helperText={nameHelper}
              onBlur={signup.nameBlur}
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              label="E-mail"
              type="email"
              value={signupEmail}
              onChange={signup.handleEmail}
              error={emailErr}
              helperText={emailHelper}
              onBlur={signup.emailBlur}
              fullWidth
            />
            <TextField
              margin="dense"
              id="phone"
              label="Telefone"
              type="tel"
              value={signupPhone}
              onChange={signup.handlePhone}
              error={phoneErr}
              helperText={phoneHelper}
              onBlur={signup.phoneBlur}
              fullWidth
              InputProps={{ inputComponent: TextMaskCustom }}
            />
            <TextField
              margin="dense"
              id="password"
              label="Senha"
              type="password"
              value={signupPassword}
              onChange={signup.handlePassword}
              error={passwordErr}
              helperText={passwordHelper}
              onBlur={signup.passwordBlur}
              fullWidth
            />
            <TextField
              margin="dense"
              id="confirmPassword"
              label="Confirme sua senha"
              type="password"
              value={signupConfirmPassword}
              onChange={signup.handleConfirmPassword}
              error={confirmPasswordErr}
              helperText={confirmPasswordHelper}
              onBlur={signup.confirmPasswordBlur}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <div className={classes.formButtons}>
              <Button
                onClick={submitSignup}
                color="primary"
                variant="contained"
              >
                CADASTRAR
              </Button>
              <Button
                onClick={handleDialogClose}
                color="primary"
                variant="contained"
              >
                VOLTAR
              </Button>
            </div>
          </DialogActions>
        </TabPanel>
      </div>
    );
  };

  const OptionsDialog = () => {
    const logOut = () => {
      setLoadUser(true);
      setTimeout(() => {
        localStorage.removeItem("@psyte/userData");
        window.location.reload(true);
      }, 1000);
    };

    return (
      <Box>
        <Button
          color="primary"
          href="/options"
          className={classes.optionsButtons}
        >
          Opções
        </Button>
        <Divider />
        <Button
          color="primary"
          className={classes.optionsButtons}
          onClick={logOut}
        >
          Sair
        </Button>
      </Box>
    );
  };

  return (
    <div style={props.style}>
      <IconButton color="inherit" onClick={handleDialogOpen}>
        <Typography component="span" style={{ marginRight: "4px" }}>
          {userName ? userName : "Entrar"}
        </Typography>
        <AccountCircleRounded fontSize="large" />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        {loadUser ? (
          <Box m={3}>
            <CircularProgress />
          </Box>
        ) : userError ? (
          <Box m={2}>
            <Typography component="p">{userError}</Typography>
            <Box
              mt={2}
              component="div"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setDialogOpen(false);
                  setUserError("");
                }}
              >
                VOLTAR
              </Button>
            </Box>
          </Box>
        ) : (
          <>{isLogged ? <OptionsDialog /> : <AuthDialog />}</>
        )}
      </Dialog>
    </div>
  );
};

export default LoginDialog;
