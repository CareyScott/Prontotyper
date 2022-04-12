import {
    CircularProgress,
    LinearProgress,
    makeStyles,
    createStyles,
    Theme
  } from "@material-ui/core";
  import { useState, useEffect } from "react";
  
  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      margin: {
        margin: theme.spacing(3),
      },
      linearProgress: {
        width: theme.spacing(30),
      },
    })
  );
  
  function Loading() {
    const classes = useStyles();
    const [level, setLevel] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setLevel((newLevel) => (newLevel >= 100 ? 0 : newLevel + 10));
      }, 700);
      return () => {
        clearInterval(timer);
      };
    }, []);
  
    return (
      <>
      <div className={classes.root}>
       
        
        <LinearProgress
          variant="buffer"
          value={level}
          valueBuffer={level + 10}
          className={[classes.linearProgress, classes.margin]}
        />
      </div>
      </>
    );
  }
  
  export default Loading;