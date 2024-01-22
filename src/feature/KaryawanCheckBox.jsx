/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ip from "../ip";
import axios from "axios";

function KaryawanCheckBox({ batchId, setBatchId }) {
  const api = `${ip}/api/karyawan/nama&id`;
  const [row, setRow] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(searchQuery = "") {
    const url = `${api}?search=${searchQuery}`;
    const response = await axios.get(url, config);
    setRow(response.data);
    if (searchQuery === "") {
      setOriginalRows(response.data);
    }
  }

  const handleSearch = (search) => {
    setRow(
      originalRows.filter((item) => item.nama.toLowerCase().includes(search))
    );
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);

    if (query === "" || query === null) {
      // If the search box is empty, return to the original data
      setRow(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(search);
    }
  };

  const handleCheckboxChange = async (event, id) => {
    const isChecked = event.target.checked;
    const check = (isChecked) => {
      if (isChecked) {
        setBatchId([...batchId, id]);
      } else {
        setBatchId(batchId.filter((selectedId) => selectedId !== id));
        if (selectAll) {
          setSelectAll(!selectAll);
        }
      }
    };
    await check(isChecked);
    console.log(batchId);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedBatchId = selectAll
      ? [] // If "Select All" is checked, unselect all
      : row.map((item) => item.id); // If "Select All" is unchecked, select all
    setBatchId(updatedBatchId);
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto space-y-2">
      <div className="bg-gray-200 rounded-lg flex justify-start items-center w-full border border-gray-400">
        <SearchIcon style={{ fontSize: 25 }} />
        <InputBase
          placeholder="Search..."
          onKeyPress={handleKeyPress}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>
      <div className="flex flex-wrap w-full justify-evenly">
        <div className="flex flex-col w-1/2">
          {/* "Select All" checkbox */}
          <div className="">
            <FormControlLabel
              label="Select all"
              control={
                <Checkbox
                  id="selectAllCheckbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              }
            />
          </div>
          {row.slice(0, Math.ceil(row.length / 2)).map((item) => (
            <FormControlLabel
              key={item.id}
              control={<Checkbox checked={batchId.includes(item.id)} />}
              label={item.nama}
              onChange={(e) => handleCheckboxChange(e, item.id)}
              //   onClick={() => console.log(item.nama)}
            />
          ))}
        </div>
        <div className="flex flex-col w-1/2">
          {row.slice(Math.ceil(row.length / 2)).map((item) => (
            <FormControlLabel
              key={item.id}
              control={<Checkbox checked={batchId.includes(item.id)} />}
              label={item.nama}
              onChange={(e) => handleCheckboxChange(e, item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default KaryawanCheckBox;
