import { Container, Grid, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import React from "react";
import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";

const PageNotFound = () => {
  // let location = useLocation();

  // console.log(location);

  return (
    <React.Fragment>
      <Container fixed>
        <Box justifyContent="center">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Typography variant="h1">404 </Typography>
            <Typography>Page Not Found </Typography>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default PageNotFound;