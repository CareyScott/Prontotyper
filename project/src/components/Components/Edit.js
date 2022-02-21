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
  const [component, setComponent] = useState({});

  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/components/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setComponent(response.data);
        // setForm(response.data)
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [id, token]);

  useEffect(() => {
    setForm({
      component_name: component.component_name,
      file_url: component.file_url,
      code_output_url: component.code_output_url,
      project: component.project,
    });
  }, [component]);

  if (!component) return null;

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
        `http://localhost:3030/components/${id}`,
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
      <h2>Edit Component</h2>


      <div className="form-group">
        <TextField
          multiline
          variant="filled"
          label="Component Name"
          name="component_name"
          value={form.component_name}
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
          label="Component File URL"
          name="file_url"
          value={form.file_url}
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
          label="Component Framework"
          name="component_framework"
          value={form.component_framework}
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

      {/* <ComponentsTable/> */}

      <Button onClick={submitForm} variant="contained">
        Submit
      </Button>
    </div>
  );
};

export default Edit;