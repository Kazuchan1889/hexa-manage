import React, { useState } from "react";
import { Button, Card, CardContent, Modal, InputBase, Switch, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const TableDataKaryawan = ({ onClose }) => { // Perbaiki penggunaan { onClose }
  const [isAddRoleOpen, setAddRoleOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [operations, setOperations] = useState({
    ADD_KARYAWAN: false,
    READ_KARYAWAN: false,
    UPDATE_KARYAWAN: false,
    DELETE_KARYAWAN: false,
  });
  const [roles, setRoles] = useState([
    { name: "Admin", operations: { ADD_KARYAWAN: true, READ_KARYAWAN: true, UPDATE_KARYAWAN: true, DELETE_KARYAWAN: true } },
    { name: "User", operations: { ADD_KARYAWAN: false, READ_KARYAWAN: true, UPDATE_KARYAWAN: false, DELETE_KARYAWAN: false } },
  ]);

  const handleOpenAddRole = () => setAddRoleOpen(true);
  const handleCloseAddRole = () => {
    setAddRoleOpen(false);
    resetRoleForm();
  };

  const resetRoleForm = () => {
    setRoleName("");
    setOperations({
      ADD_KARYAWAN: false,
      READ_KARYAWAN: false,
      UPDATE_KARYAWAN: false,
      DELETE_KARYAWAN: false,
    });
  };

  const handleRoleNameChange = (event) => setRoleName(event.target.value);

  const handleOperationToggle = (operation) => {
    setOperations((prevOperations) => ({
      ...prevOperations,
      [operation]: !prevOperations[operation],
    }));
  };

  const handleAddRole = () => {
    const newRole = { name: roleName, operations: { ...operations } };
    setRoles([...roles, newRole]);
    resetRoleForm();
    setAddRoleOpen(false);
  };

  const handleDeleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  const handleEditRole = (index) => {
    const roleToEdit = roles[index];
    setRoleName(roleToEdit.name);
    setOperations(roleToEdit.operations);
    handleOpenAddRole();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-full my-4 flex flex-col items-center">
        {/* Close Button positioned at the top right corner */}
        <IconButton
          onClick={onClose} // Gunakan onClose dari props dengan benar
          className="absolute top-2 right-2"
          style={{ color: "white" }} // Set icon color to white
        >
          <CloseIcon />
        </IconButton>
        
        <Card className="w-11/12">
          <CardContent>
            <div className="flex justify-between items-center">
              {/* Search Bar */}
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 flex items-center rounded-lg p-2">
                  <SearchIcon className="text-gray-500" />
                  <InputBase placeholder="Search..." className="ml-2 w-full" />
                </div>
                <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Search
                </Button>
              </div>

              {/* Add Role Button */}
              <Button
                onClick={handleOpenAddRole}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <AddIcon className="mr-2" />
                Add Role
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal for Adding a Role */}
        <Modal open={isAddRoleOpen} onClose={handleCloseAddRole}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white w-96 rounded-lg p-6 shadow-lg relative">
              {/* Close Button in Modal */}
              <IconButton
                onClick={handleCloseAddRole}
                className="absolute top-2 right-2"
                style={{ color: "black" }} // Set icon color to black in the modal
              >
                <CloseIcon />
              </IconButton>
              
              <Typography variant="h6" className="font-semibold mb-4">
                Add New Role
              </Typography>

              {/* Role Name Input */}
              <InputBase
                placeholder="Role Name"
                value={roleName}
                onChange={handleRoleNameChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              />

              {/* Operation Toggles */}
              <div>
                {Object.keys(operations).map((operation) => (
                  <div key={operation} className="flex justify-between items-center my-2">
                    <Typography variant="body2" className="text-gray-700">
                      {operation}
                    </Typography>
                    <Switch
                      checked={operations[operation]}
                      onChange={() => handleOperationToggle(operation)}
                      color="primary"
                    />
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleAddRole}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
              >
                Save Role
              </Button>
            </div>
          </div>
        </Modal>

        {/* Display Existing Roles */}
        <div className="flex justify-center items-center w-full my-4">
          <Card className="w-11/12">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Existing Roles
              </Typography>
              {roles.map((role, index) => (
                <div key={index} className="flex justify-between items-center mb-2 p-2 border-b">
                  <Typography variant="body1" className="font-medium">
                    {role.name}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleEditRole(index)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteRole(index)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TableDataKaryawan;
