import "./App.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useCallback, useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { API } from "./global";

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
  const [boxSize, setBoxSize] = useState(null);
  const [fix, setFix] = useState({});

  const getFixValues = () => {
    fetch(`${API}/status`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((values) => setBoxSize(values));
  };
  useEffect(getFixValues, []);

  return boxSize ? (
    <Status
      boxSize={boxSize}
      setBoxSize={setBoxSize}
      fix={fix}
      setFix={setFix}
    />
  ) : (
    <h1>Loading...</h1>
  );
}
function Status({ boxSize, setBoxSize, fix, setFix }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [enable, setEnable] = useState(true);

  console.log("fix", fix);
  const addFixValues = (fix) => {
    console.log("backend", fix);
    fetch(`${API}/status`, {
      method: "POST",
      body: JSON.stringify(fix),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((value) => setBoxSize(value[0]));
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
                    onClick={() => addFixValues(fix)}
                  >
                    Sync to SetApp
                  </button>
                </div>
              </div>

              <CropDemo
                setBoxSize={setBoxSize}
                boxSize={boxSize}
                enable={enable}
                fix={fix}
                setFix={setFix}
              />
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

function CropDemo({ setBoxSize, boxSize, enable, fix, setFix }) {
  const getFixValues = () => {
    fetch(`${API}/status`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((values) => setBoxSize(values));
  };
  useEffect(getFixValues, []);

  console.log("boxSize", boxSize[0]);
  console.log("enable", enable);
  const [crop, setCrop] = useState(boxSize[0]);

  const onComplete = useCallback((croppedArea, croppedAreaPixels) => {
    for (var key of Object.keys(croppedArea)) {
      if (typeof croppedArea[key] === "number" && croppedArea[key] !== 0) {
        croppedArea[key] = Math.ceil(croppedArea[key]);
      }
    }
    console.log("croppedArea", croppedArea);
    setFix(croppedArea);
    console.log("croppedArea-fix", fix);
    // setBoxSize({ croppedArea });
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
    </div>
  );
}
