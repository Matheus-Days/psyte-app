import React from "react";
import { Box, Paper, Typography, Divider, Link } from "@material-ui/core";
import {
  WhatsApp,
  Phone,
  Instagram,
  HomeWork,
  Email,
} from "@material-ui/icons";

export default () => {
  return (
    <Box
      m={1}
      style={{ maxWidth: "350px", marginLeft: "auto", marginRight: "auto" }}
    >
      <div id="ready"></div>
      <Paper>
        <Box p={1}>
          <Box mb={2} pl={2}>
            <Typography variant="h4">Contato</Typography>
          </Box>
          <Box mt={1} mb={1}>
            <Link href="tel:85997528573">
              <Typography component="p">
                <Phone /> (85) 9 9752-8573
              </Typography>
            </Link>
          </Box>
          <Divider />
          <Box mt={1} mb={1}>
            <Link
              target="_blank"
              rel="noopener"
              href="https://api.whatsapp.com/send?phone=5585997528573"
              style={{ color: "teal" }}
            >
              <Typography component="p">
                <WhatsApp />
                (85) 9 9752-8573
              </Typography>
            </Link>
          </Box>
          <Divider />
          <Box mt={1} mb={1}>
            <Link
              rel="noopener"
              href="mailto:matheusbragaprofissional@gmail.com"
              style={{ color: "#blue" }}
            >
              <Typography component="p">
                <Email />
                matheusbragaprofissional@gmail.com
              </Typography>
            </Link>
          </Box>
          <Divider />
          <Box mt={1} mb={1}>
            <Link
              target="_blank"
              rel="noopener"
              href="https://instagram.com/matheusdiaspsico"
              style={{ color: "#C13584" }}
            >
              <Typography component="p">
                <Instagram />
                @matheusdiaspsico
              </Typography>
            </Link>
          </Box>
          <Divider />
          <Box mt={1}>
            <Typography component="p">
              <HomeWork />
              Rua João Campos Paiva s/n, Gavião, Maranguape - CE.
            </Typography>
          </Box>
        </Box>
        <iframe
          title="location-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15922.459431963705!2d-38.69695447404193!3d-3.8924246047000373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0ab7c759d5c17%3A0xa68c082c4cbc8de3!2sPra%C3%A7a%20Jo%C3%A3o%20Campos%20Paiva%20-%20Centro%2C%20Maranguape%20-%20CE!5e0!3m2!1spt-BR!2sbr!4v1595532980830!5m2!1spt-BR!2sbr"
          width="300"
          height="225"
          frameBorder="0"
          style={{
            borderRadius: "10px",
            boxShadow: "2px 2px lightgray",
            margin: "4px 0px 16px 30px",
          }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        />
      </Paper>
    </Box>
  );
};
