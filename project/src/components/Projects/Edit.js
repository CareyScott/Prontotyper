// functionality not in use -- requires further development to rename storage container folder at the same time.


import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import ComponentsTable from "../Components/ComponentsTable";




const Edit = (props) => {
  let navigate = useNavigate();
    let {id} = useParams();


  console.log(id);

  const [form, setForm] = useState({});
  const [project, setProject] = useState({});

  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://pronto-api-rest.azurewebsites.net/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProject(response.data);
        // setForm(response.data)
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [id, token]);

  useEffect(() => {
    setForm({
      project_name: project.project_name,
      project_framework: project.project_framework,
      user_id: project.user_id,
    });
  }, [project]);

  if (!project) return null;

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = () => {
    console.log(form);

    let token = localStorage.getItem("token");

    axios
      .put(
        `https://pronto-api-rest.azurewebsites.net/projects/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        navigate(`/dashboard/`);
      })
      .catch((err) => console.log(err));
  };

  

  return (
    <div>
      <h2>Edit Project</h2>


      <div className="form-group">
        <TextField
          multiline
          variant="filled"
          label="Project Name"
          name="project_name"
          value={form.project_name}
          onChange={handleForm}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className="form-group">
        <TextField
          multiline
          variant="filled"
          label="Project Framework"
          name="project_framework"
          value={form.project_framework}
          onChange={handleForm}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      {/* <div className="form-group">
        <TextField
          multiline
          variant="filled"
          label="User_Id"
          name="user_id"
          value={form.user_id}
          onChange={handleForm}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div> */}

      <ComponentsTable/>

      <Button onClick={submitForm} variant="contained">
        Submit
      </Button>
    </div>
  );
};

export default Edit;