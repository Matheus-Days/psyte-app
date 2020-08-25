import React from "react";
import { Box, Paper, Typography } from "@material-ui/core";

const ShouldSignin = () => {
  return (
    <Box
      mt={2}
      style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "350px" }}
    >
      <Paper>
        <Box p={3}>
          <Typography component="p">
            Você deve estar conectado a uma conta para poder acessar este
            serviço. Caso ainda não tenha uma, acesse o formulário para criação
            de conta no canto superior direito desta página.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShouldSignin;
