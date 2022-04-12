import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FolderIcon from "../Images/folder.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProjectListComponent(props) {
  const theme = useTheme();
  let navigate = useNavigate();

  const showProject = () => {
    navigate(`/projects/${props.project._id}`, { replace: true });
  };


  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {props.project.project_name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >{props.project.description}</Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <Button
                  onClick={showProject}
                  color="secondary"
                  position="absolute"
                  sx={{ color: "#790FFF"}}
                >
                  View
              </Button>
        </Box>
      </Box>
     
    </Card>
  );
}
