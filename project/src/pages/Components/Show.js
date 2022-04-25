import * as React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { getParameters } from "codesandbox/lib/api/define";

const ComponentsShow = (props) => {
  const [component, setComponent] = useState({});
  const [project, setProject] = useState('');
  const [blobName, setBlobName] = useState('');
  const [isLoading, setLoad] = useState(true);

  const [html, setHTML] = useState('');
  const [sandboxName, setSandboxName] = useState('');
  const [prediction, setPrediction] = useState('');

  let { id } = useParams();
  let token = localStorage.getItem("token");

  let containerName;
  // let blobName;
  let componentImage;
  let sandbox_id;


  useEffect(() => {
    // write your code here, it's like componentWillMount
    predictionRun();
}, [])
  

  const positionsCSS = `.container {
    padding-top: 40px;
    width: 1200px;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 2em;
    grid-row-gap: 1em;
    grid-row: auto;
  }
  
  .nested {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 1.5em;
    grid-row-gap: 1em;
    height: fit-content;
  }
  
  
  .width-1 {
    grid-column: span 1;
  }
  
  .width-2 {
    grid-column: span 2;
  }
  
  .width-3 {
    grid-column: span 3;
  }
  
  .width-4 {
    grid-column: span 4;
  }
  
  .width-5 {
    grid-column: span 5;
  }
  
  .width-6 {
    grid-column: span 6;
  }
  
  .width-7 {
    grid-column: span 7;
  }
  
  .width-8 {
    grid-column: span 8;
  }
  
  .width-9 {
    grid-column: span 9;
  }
  
  .width-10 {
    grid-column: span 10;
  }
  
  .width-11 {
    grid-column: span 11;
  }
  
  .width-12 {
    grid-column: span 12;
  }
  
  .flex {
    display: flex;
    gap: 12px;
  }
  
  .flexWidth {
    flex-grow: 1;
  }
  
  
  .left-1 {
    grid-column: span 1;
  }
  
  .left-2 {
    grid-column: span 2;
  }
  
  .left-3 {
    grid-column: span 3;
  }
  
  .left-4 {
    grid-column: span 4;
  }
  
  .left-5 {
    grid-column: span 5;
  }
  
  .left-6 {
    grid-column: span 6;
  }
  
  .left-7 {
    grid-column: span 7;
  }
  
  .left-8 {
    grid-column: span 8;
  }
  
  .left-9 {
    grid-column: span 9;
  }
  
  .left-10 {
    grid-column: span 10;
  }
  
  .left-11 {
    grid-column: span 11;
  }
  
  .left-12 {
    grid-column: span 12;
  }
  
  .break {
    grid-column: span 12;
  
  }
  
  
  .same{
  
  
    
  }`;

  const htmlHead = `import React from "react";
    import ReactDOM from "react-dom";
    import "./css/grid.css";
    import Helmet from "react-helmet";
   
    const element = (
  <>
  <Helmet><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\" /></Helmet>
  
  <div className="container">
   ${html}
   </div>
   </> 
   );
  
    
    ReactDOM.render(
      element,
      document.getElementById('root')
    );`;

  let htmlRoot = '<div id="root"></div>';

  const parameters = getParameters({
    files: {
      "package.json": {
        content: {
          dependencies: {
            react: "latest",
            "react-dom": "latest",
            "react-helmet": "^6.1.0",

            bootstrap: "^5.1.3",
          },
        },
      },
      "index.js": {
        content: htmlHead,
      },
      "index.html": {
        content: htmlRoot,
      },
      "/css/grid.css": {
        content: positionsCSS,
      },
    },
  });

  const doNothing = () => {};

   const predictionRun = async () => {
    await getComponentData(),
    await predict(),
    await generateCode(),
    await openSandbox()
  };

  // const getData = () => {
  //   axios
  //     .get(`http://localhost:3030/components/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       setComponent(response.data);
  //       setBlobName(response.data.blob_name);

  //       axios
  //         .get(`http://localhost:3030/projects/${response.data.project}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //           setProject(response.data.project_name.toLowerCase());
  //         })
  //         .catch((err) => {
  //           console.log(`Error: ${err}`);
  //         });

  //       setLoad(false);
  //     })
  //     .catch((err) => {
  //       console.log(`Error: ${err}`);
  //     });

  //   // await predict();
  // };

  const getComponentData = async () => {
    try {
      const resp = await axios.get(`http://localhost:3030/components/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlobName(resp.data.blob_name);
      setProject(resp.data.project.project_name.toLowerCase());
      setComponent(resp.data);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  // const getProjectData = async () => {
  //   let componentString = component.project
  //   componentString.toString()
  //   try {
  //     const resp = await axios.get(`http://localhost:3030/projects/${component.project}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setProject(resp.data.project_name.toLowerCase())
  //   } catch (err) {
  //     console.log(`Error: ${err}`);
  //   }
  // };
  // axios
  //   .get(`http://localhost:3030/predict/${blobName}/container/${project}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((response) => {
  //     setPrediction(response.data.id);
  //     // generateCode(response.data.id);
  //     setPredicted(true);
  //   })
  //   .catch((err) => {
  //     console.log(`Error: ${err}`);
  //   });
  //   // await generateCode();
  //   // return Promise.resolve

  const predict = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:3030/predict/${blobName}/container/${project}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrediction(resp.data.id);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const generateCode = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:3030/code/${prediction}/frameworks/bootstrap/projects/${project}/sketch/${component.component_name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHTML(resp.data);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const openSandbox = async () => {
    try {
      const resp = await axios.post(
        `https://codesandbox.io/api/v1/sandboxes/define?json=1`,
        {
          parameters: parameters,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(resp);
      setSandboxName(resp.data.sandbox_id);
      setLoad(false)

    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };


  // const generateCode =  () => {
  //   axios
  //     .get(
  //       `http://localhost:3030/code/${prediction}/frameworks/bootstrap/projects/${project}/sketch/${component.component_name}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setHTML(response.data);
  //       // console.log(htmlCode);
  //     })
  //     // .then(() => openSandbox())

  //     .catch((err) => {
  //       console.log(`Error: ${err}`);
  //     });
  //     // await openSandbox();

  //     // return Promise.resolve
  // };

  // const openSandbox = () => {
  //   axios
  //     .post(`https://codesandbox.io/api/v1/sandboxes/define?json=1`, {
  //       parameters: parameters,
  //     })
  //     .then((response) => {
  //       console.log(response.data.sandbox_id);
  //       setSandboxName(response.data.sandbox_id);
  //     })
  //     .catch((err) => {
  //       console.log(`Error: ${err}`);
  //     });

  //   // return Promise.resolve
  // };

  const Sandbox = () => {
    return (
      <iframe
        src={`https://codesandbox.io/embed/${sandboxName}`}
        width="100%"
        height="590"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    );
  };

  if (isLoading === true) {
    console.log("Loading");
    return (
      <>
        {" "}
        <div className="col-1"></div>
        <div className="col-11 line-1">Loading</div>
      </>
    );
  } else {
    console.log("Done Loading");
    // predictionRun()
    // predict()
    // const once= (fn, context) => {
    //   let result;

    //   return function() {
    //     if(fn) {
    //       result = fn.apply(context || this, arguments);
    //       fn = null;
    //     }

    //     return result;
    //   };

    // }

    // // let canOnlyFireOnce = once(function() {
    // //   console.log('Fired!');
    // //   predict()
    // // });

    // canOnlyFireOnce(); // "Fired!"

    // canOnlyFireOnce(); // "Fired!"
    // if (predicted === false) {
    // predict()
    // }
    // let count = 0;
    // count === 1 ? predict : doNothing;
    // count++;
    return (
      <>
        <div className="container-main">
          <div className="col-1"></div>
          <div className="col-11 line-1">{component.component_name}</div>
          <div className="col-1 paragraph-gap "></div>
          <div className="col-1 paragraph-gap">
            <Button
              variant="outlined"
              color="secondary"
              xs={6}
              // onClick={predict}
              sx={{ color: "#790FFF", width: 250, height: 50, mb: 4 }}
            >
              Download Component
            </Button>
          </div>
          <div className="col-10 paragraph-gap">
            <Button
              // onClick={generateCode}
              color="secondary"
              xs={6}
              sx={{ color: "#790FFF", width: 250, height: 50 }}
            >
              Edit
            </Button>
          </div>
          {/* <div className="col-2">
          {!project ? (
            <p>no img</p>
          ) : (
            <img
              width="100%"
              src={`https://sketch2codestoresc.blob.core.windows.net/${project}/${component.blob_name}`}
            />
          )} 
        </div> */}

          <div className="col-12">
            {sandboxName === "" ? <></> : <Sandbox />}
          </div>
          <div className="col-12"></div>
          <div className="col-2"></div>
        </div>
      </>
    );
  }
};

export default ComponentsShow;
