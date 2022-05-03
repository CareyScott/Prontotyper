import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";




const Edit = (props) => {
  let navigate = useNavigate();
    let {id} = useParams();


  console.log(id);

  const [form, setForm] = useState({});
  const [component, setComponent] = useState({});

  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://pronto-api-rest.azurewebsites.net/components/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
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
      description: component.description,
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
    // console.log(form);

    let token = localStorage.getItem("token");

    axios
      .put(
        `https://pronto-api-rest.azurewebsites.net/components/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        window.location.reload()
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
          label="Component Description"
          name="description"
          value={form.description}
          onChange={handleForm}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      
      <Button onClick={submitForm} variant="contained">
        Submit
      </Button>
    </div>
  );
};

export default Edit;