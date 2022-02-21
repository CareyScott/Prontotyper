import * as React from "react";
import {Container, Grid} from "@mui/material";
import ProjectsTable from "../components/Projects/ProjectsTable";
const Dashboard = (props) => {
  
  return (
    <>
<div className="app" >
       
       <div className="left-side">
         
       </div>
       <div className="right-side">
         <Grid>
          <ProjectsTable/>
        </Grid>
       </div>
     </div>    </>
  );
};

export default Dashboard;