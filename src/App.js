import "./App.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useCallback, useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { API } from "./global";
import { height, width } from "@mui/system";
import { Alert, Snackbar } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
};

export default function App() {
  const [count, setCount] = useState(0);
  const [boxSize, setBoxSize] = useState(null);
  const getFixValues = async () => {
    await fetch(`${API}/status`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((values) => setBoxSize(values))
      .then(() => console.log("pos", boxSize[0]))
      .then(() => localStorage.setItem("position", JSON.stringify(boxSize[0])));
  };
  useEffect(() => {
    getFixValues();
  }, [count]);
  if (count < 1) {
    setTimeout(() => {
      setCount(count + 1);
    }, 500);
  }

  return boxSize ? (
    <Status boxSize={boxSize} setBoxSize={setBoxSize} />
  ) : (
    "Loading..."
  );
}

function Status({ boxSize, setBoxSize }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [enable, setEnable] = useState(true);

  const addFixValues = () => {
    let localdata = localStorage.getItem("position");
    fetch(`${API}/status`, {
      method: "POST",
      body: localdata,
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((value) => setBoxSize(value[0]))
      .then(() => console.log("localdata", localdata));
  };
  const [state, setState] = useState({
    openAlert: false,
    vertical: "top",
    horizontal: "left",
  });

  const { vertical, horizontal, openAlert } = state;

  const handleClick = (newState) => {
    setState({ openAlert: true, ...newState });
  };

  const handleCloseAlert = () => {
    setState({ ...state, openAlert: false });
  };
  return (
    <div className="App">
      <div className="nytt-container">
        <img
          className="nytt-logo"
          src="https://nyttdev.com/testing_env/version4/assets/img/app_logo_orange.png"
          alt="NYTT"
        />
        <button className="live-status" onClick={handleOpen}>
          Live Status
        </button>

        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modalbox"
        >
          <Box sx={style} className="modal-container">
            <div className="header">
              <p className="title">Live Detection</p>
              <Button
                sx={{
                  marginLeft: "auto",
                  textAlign: "center",
                  color: "red",
                }}
                onClick={handleClose}
              >
                <CancelIcon />
              </Button>
            </div>
            <div className="modal-content">
              <div className="actions">
                <p style={{ padding: "10px" }}>Machine50</p>
                <div
                  className="buttons"
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    gap: "20px",
                    padding: "10px",
                  }}
                >
                  <button
                    className="edit-button"
                    onClick={() => setEnable(!enable)}
                  >
                    {enable ? "Edit detection" : "Save Changes"}
                  </button>
                  <button
                    className="save-button"
                    onClick={() => {
                      handleClick({
                        vertical: "top",
                        horizontal: "right",
                      });
                      addFixValues();
                    }}
                  >
                    Sync to SetApp
                  </button>
                  <Snackbar
                    open={openAlert}
                    autoHideDuration={2000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical, horizontal }}
                  >
                    <Alert onClose={handleCloseAlert} severity="success">
                      Data added to MySql
                    </Alert>
                  </Snackbar>
                </div>
              </div>

              <CropDemo enable={enable} />
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

function CropDemo({ enable }) {
  var cropValues = JSON.parse(localStorage.getItem("position"));

  const [crop, setCrop] = useState({
    unit: "px",
    x: cropValues.x,
    y: cropValues.y,
    width: cropValues.width,
    height: cropValues.height,
  });

  const onComplete = useCallback((croppedArea, croppedAreaPixels) => {
    for (var key of Object.keys(croppedArea)) {
      if (typeof croppedArea[key] === "number" && croppedArea[key] !== 0) {
        croppedArea[key] = Math.ceil(croppedArea[key]);
      }
    }
    console.log("croppedArea", croppedArea);
    localStorage.setItem("position", JSON.stringify(croppedArea));
  }, []);

  return (
    <div>
      {enable ? (
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={onComplete}
          keepSelection="false"
          className="crop-container"
          disabled="false"
        >
          <img className="error-image" src="Error_1.png" />
        </ReactCrop>
      ) : (
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={onComplete}
          keepSelection="false"
          className="crop-container"
        >
          <img className="error-image" src="Error_1.png" />
        </ReactCrop>
      )}
      <p>
        values: x-{cropValues.x} x-{cropValues.y} width-{cropValues.width}{" "}
        height-{cropValues.height}
      </p>
    </div>
  );
}
