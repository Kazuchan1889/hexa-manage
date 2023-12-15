import React, { useState } from "react";
import axios from "axios";
import ip from "../ip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import KaryawanCheckBox from "./KaryawanCheckBox";
import FormPengisianGaji from "./FormPengisianGaji";
import Swal from "sweetalert2";

const CreatePayroll = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [batchId, setBatchId] = useState([]);
  const [requestBody, setRequestBody] = useState({});
  const [formType, setFormType] = useState("Bulanan");
  const [formValid, setformValid] = useState("false");
  const apiCreatePayrollBulanan = `${ip}/api/payroll/post/bulanan`;
  const apiCreatePayrollTHR = `${ip}/api/payroll/post/bonus`;

  const handleStep = (index) => {
    const max = 1;
    if (index <= max) setStep(index);
    else handleSubmit();
  };

  const handleClose = () => {
    setStep(null);
    onClose();
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  const handleSubmit = () => {
    const DatatoSend = {
      month: requestBody.months,
      bpjs: requestBody.formDataBulanan.bpjs,
      bjps: requestBody.formDataBulanan.bjps,
      year: requestBody.year,
      formulaId: requestBody.formulaId,
      ph21:
        formType === "Bulanan"
          ? requestBody.formDataBulanan.ph21
          : requestBody.formDataTHR.ph21,
      batchId: batchId,
      bonus: requestBody.formDataTHR.bonus,
    };
    console.log(DatatoSend);
    axios
      .post(
        formType === "Bulanan" ? apiCreatePayrollBulanan : apiCreatePayrollTHR,
        DatatoSend,
        config
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: response.data,
          customClass: {
            container: "z-30",
          },
        });
        handleClose();
      })
      .catch((error) => {
        console.error("Error Creating Payroll", error);
      });
  };

  return (
    <Modal open={isOpen || false} onClose={onClose}>
      <div
        className="w-2/5 h-96"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="h-full" style={{ overflowY: "auto" }}>
          <CardContent>
            <div className="flex items-center justify-between">
              <Typography variant="h6">Buat Payroll</Typography>
            </div>
            {step === 0 && (
              <KaryawanCheckBox
                batchId={batchId}
                setBatchId={setBatchId}
              ></KaryawanCheckBox>
            )}
            {step === 1 && (
              <FormPengisianGaji
                setRequestBody={setRequestBody}
                requestBody={requestBody}
                formType={formType}
                setFormType={setFormType}
                setformValid={setformValid}
              />
            )}
            <div className="my-2 flex items-start justify-end space-x-2 ">
              {step !== 0 && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStep(step - 1)}
                >
                  Back
                </Button>
              )}
              {step !== 1 && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStep(step + 1)}
                >
                  Next
                </Button>
              )}
              {step === 1 && (
                <Button
                  variant="contained"
                  size="small"
                  disabled={!formValid}
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export default CreatePayroll;
