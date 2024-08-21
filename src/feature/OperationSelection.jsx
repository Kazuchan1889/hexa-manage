/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useState } from "react";
import {
  TextField,
  InputAdornment,
  TableContainer,
  TableCell,
  TableRow,
  Table,
  TableBody,
  Button,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const OperationSelection = ({
  allOperation,
  chosenOperation,
  btnFunction,
  setSubmitValue,
  isSubmit,
}) => {
  const [chosen, setChosen] = useState(chosenOperation);
  const [choice, setChoice] = useState([]);
  const [searchChoice, setSearchChoice] = useState("");
  const [searchChosen, setSearchChosen] = useState("");

  useEffect(() => {
    setChoice(
      allOperation.filter(
        (item) =>
          !chosenOperation.some((chosenItem) => chosenItem.id === item.id)
      )
    );
    setChosen(chosenOperation);
  }, [allOperation, chosenOperation]);

  useEffect(() => {
    // console.log(chosen);
    setSubmitValue(chosen);
  }, [chosen, setSubmitValue]);
  const handleSearchChoice = (e) => {
    setSearchChoice(e.target.value);
  };
  const handleSearchChosen = (e) => {
    setSearchChosen(e.target.value);
  };

  const moveItemToChosen = (item) => {
    setChosen((prevChosen) => [...prevChosen, item]);
    setChoice((prevChoice) =>
      prevChoice.filter((choiceItem) => choiceItem.id !== item.id)
    );
  };

  const moveItemToChoice = (item) => {
    setChoice((prevChoice) => [...prevChoice, item]);
    setChosen((prevChosen) =>
      prevChosen.filter((chosenItem) => chosenItem.id !== item.id)
    );
  };
  return (
    <div>
      <div className="flex justify-center mt-1">
        <div
          className="w-full md:w-1/2"
          style={{ marginRight: "20px", minHeight: "300px" }}
        >
          <div className="flex justify-center mb-2">
            <TextField
              onChange={handleSearchChoice}
              label="Cari"
              variant="outlined"
              fullWidth
              style={{ marginTop: "10px", color: "black" }}
              InputProps={{
                style: { color: "black", padding: "0" },
                inputProps: {
                  style: {
                    padding: "8px",
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ height: "20px", color: "black" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: {
                  paddingBottom: "25px",
                  alignItems: "center",
                  display: "flex",
                  height: "100%",
                },
              }}
            />
          </div>
          <div
            className="p-4 rounded-t-lg"
            style={{ backgroundColor: "#204684" }}
          >
            <p className="text-white font-semibold text-center">
              Hak yang dapat dipilih
            </p>
          </div>
          <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg max-h-[300px] overflow-auto">
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {choice
                    .filter((item) =>
                      item.operation
                        .toLowerCase()
                        .includes(searchChoice.toLowerCase())
                    )
                    .filter((item) => item.fungsi !== null)
                    .sort((a, b) => a.operation.localeCompare(b.operation))
                    .map((choiceItem, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Tooltip
                            title={
                              choiceItem.fungsi ??
                              "operation tidak memiliki fungsi"
                            }
                          >
                            <Button
                              onClick={() => moveItemToChosen(choiceItem)}
                              variant="text"
                              className="m-2 p-2 md:p-4 md:min-w-[150px] md:text-lg"
                            >
                              {choiceItem.operation.replace("_", " ")}
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="flex justify-center mb-2">
            <TextField
              onChange={handleSearchChosen}
              label="Cari"
              variant="outlined"
              fullWidth
              style={{ marginTop: "10px", color: "black" }}
              InputProps={{
                style: { color: "black", padding: "0" },
                inputProps: {
                  style: {
                    padding: "8px",
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ height: "20px", color: "black" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: {
                  paddingBottom: "25px",
                  alignItems: "center",
                  display: "flex",
                  height: "100%",
                },
              }}
            />
          </div>
          <div
            className="p-4 rounded-t-lg"
            style={{ backgroundColor: "#204684" }}
          >
            <p className="text-white font-semibold text-center">
              Hak Yang Didapat
            </p>
          </div>
          <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg max-h-[300px] overflow-auto">
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {chosen
                    .filter((item) =>
                      item.operation
                        .toLowerCase()
                        .includes(searchChosen.toLowerCase())
                    )
                    .filter((item) => item.fungsi !== null)
                    .sort((a, b) => a.operation.localeCompare(b.operation))
                    .map((chosenItem, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Tooltip title={chosenItem.fungsi}>
                            <Button
                              onClick={() => moveItemToChoice(chosenItem)}
                              variant="text"
                              className="m-2 p-2 md:p-4 md:min-w-[150px] md:text-lg"
                            >
                              {chosenItem.operation.replace("_", " ")}
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-end bg-white mt-4">
        <Button
          variant="contained"
          size="small"
          style={{ backgroundColor: "#204684" }}
          onClick={() => {
            btnFunction();
          }}
        >
          {isSubmit ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default OperationSelection;