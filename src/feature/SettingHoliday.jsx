/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ip from "../ip";
import axios from "axios";

const SettingHoliday = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [deskripsi, setDeskripsi] = useState(null);
  const [savedDates, setSavedDates] = useState([]);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };
  async function getHoliday() {
    const url = `${ip}/api/absensi/get/holiday`;
    try {
      const response = await axios.get(url, config);
      // console.log(response.data);
      setSavedDates(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function postHoliday() {
    const url = `${ip}/api/absensi/post/holiday`;
    try {
      const response = await axios.post(url, { data: savedDates }, config);
      console.log(response.data);
      setSavedDates(null);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getHoliday();
  }, []);
  const handleSaveDates = () => {
    // Do something with savedDates, like sending to the server or storing in the application state
    console.log("Saved Dates:", savedDates);
    postHoliday();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-8/12 h-6/12">
        <CardContent className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="h6" component="div">
              Setting Holiday Dates
            </Typography>
            <Button size="small" onClick={onClose}>
              <CloseIcon className="text-black" />
            </Button>
          </div>
          <div className="flex justify-between space-x-1 my-5">
            <TextField
              size="small"
              type="date"
              fullWidth
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            ></TextField>
            <TextField
              type="text"
              fullWidth
              size="small"
              label="Description"
              onChange={(e) => {
                setDeskripsi(e.target.value);
              }}
            />
            <Button
              size="small"
              onClick={() => {
                console.log(savedDates);
                if (!savedDates.some((item) => item.tanggal === selectedDate)) {
                  setSavedDates((prev) => [
                    ...prev,
                    { tanggal: selectedDate, desk: deskripsi },
                  ]);
                }
              }}
            >
              <AddIcon className="text-black" />
            </Button>
          </div>
          <div className=" bg-gray-300 drop-shadow-lg rounded-lg overflow-auto max-h-96">
            <div>
              {savedDates &&
                savedDates
                  .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)) // Sort the dates
                  .map((item) => (
                    <div
                      className="flex justify-evenly space-x-2 w-full p-2"
                      key={item.tanggal}
                    >
                      <div className="w-full items-start justify-start flex">
                        {item.tanggal}
                      </div>
                      <div className="w-full items-start justify-start flex">
                        {item.desk}
                      </div>
                      <Button
                        onClick={() => {
                          setSavedDates((prev) =>
                            prev.filter((temp) => temp !== item)
                          );
                        }}
                        size="small"
                      >
                        <DeleteIcon className="text-red-700" />
                      </Button>
                    </div>
                  ))}
            </div>
          </div>
          <div className="flex-grow my-2" />
          <div className="flex items-end justify-end">
            <div className="flex items-center justify-between">
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveDates}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingHoliday;
