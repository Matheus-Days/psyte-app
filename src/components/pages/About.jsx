import React from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      m={2}
      style={{ maxWidth: "720px", marginRight: "auto", marginLeft: "auto" }}
    >
      <div id="ready"></div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
          <Typography variant="h5">Sobre mim</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            Sou psicólogo formado pela Universidade Federal do Ceará e
            registrado junto ao Conselho Regional de Psicologia da 11ª Região.
            Trabalho com atendimento psicoterapêutico, mais especificamente com
            análise de orientação junguiana.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2-header">
          <Typography variant="h5">Sobre a análise junguiana</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            A análise [de orientação] junguiana é o método psicoterapêutico
            desenvolvido pelo psiquiatra e psicólogo suiço Carl Gustav Jung e
            pela escola de psicologia de Zurique que ele fundou. Em resumo, esse
            método funciona a partir da liberdade do cliente de falar sobre o
            assunto que desejar e das intervenções que o analista faz em cima do
            que foi dito. Comumente o analista utiliza o método de interpretação
            para, com o cliente, extrair sentido dos diversos conteúdos
            abordados, sendo os conteúdos a seguir os principais: sonhos;
            sintomas psiquiátricos, como depressão ou ansiedade; produções
            artísticas literárias, visuais ou musicais; história de vida; e
            fantasias.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3-header">
          <Typography variant="h5">Quem e como atendo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            Os atendimentos podem ser realizados presencialmente no centro de
            Maranguape/CE ou online, através deste website ou de aplicativos de
            videoconferência, como Skype ou Google Meet.
            <br />
            Realizo atendimentos, exclusivamente na modalidade individual, de
            adultos e de adolescentes a partir dos 16 anos com a devida
            autorização dos responsáveis.
            <br />
            Não realizo orientação vocacional, acompanhamento terapêutico,
            aplicação de testes psicológicos, nem laudos psicológicos.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4-header">
          <Typography variant="h5">Valores e métodos de pagamento</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            A primeira sessão tem o valor fixo de R$50,00 a ser pago ao fim do
            atentimento. Antes do final desta sessão inicial negociamos o valor
            a ser pago ao final de cada sessão seguinte.
            <br />
            Caso a pessoa seja atendida virtualmente, as opções de pagamento
            são: cartão de débito ou de crédito, ou transferência para conta
            Caixa ou conta Nubank. Caso o atendimento seja presencial, também há
            a opção de pagamento em espécie.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel5-header">
          <Typography variant="h5">
            Como funciona o Agendamento Virtual
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            Através deste website é possível agendar um horário para o
            atendimento inicial. Para isso é preciso que a pessoa interessada
            faça um cadastro simples, clicando no canto superior direito do
            site, e então acesse a aba "Agendar Consulta" no menu. Nesse serviço
            o calendário mostrará datas possíveis no período de 14 dias a partir
            do dia atual e, abaixo, haverá as opções de horários disponíveis
            para esse dia. Não é possível agendar uma sessão no mesmo dia
            através dessa ferramenta, para fazer isso é preciso entrar em
            contato através do telefone ou whatsapp.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel6-header">
          <Typography variant="h5">
            Como funciona o Atendimento Virtual
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            Os atendimentos virtuais acontecem preferencialmente através da
            ferramenta disponível neste website. Para acessá-la é preciso que a
            pessoa interessada tenha um cadastro simples. Depois basta que
            acesse a aba "Atendimento Online" no menu e clique em "Conectar-se"
            quando estiver próxima de seu horário de atendimento. Para começar
            uma chamada com o profissional basta clicar em seu nome e seguir os
            passos; caso não haja nenhum nome, é porque ele não está disponível.
            <br />
            Caso haja alguma dificuldade técnica no uso da ferramenta de
            videochamada deste website, é possível usar ferramentas de
            terceiros, como Skype e Google Meet.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
