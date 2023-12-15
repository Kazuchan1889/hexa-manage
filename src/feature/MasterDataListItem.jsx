import React from 'react';
import {
  Typography,
  ListItem,
  ListItemIcon,
  Button,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Link, useNavigate, useLocation } from "react-router-dom";

const MasterDataListItem = ({
    to,
    buttonWidth,
    isActive,
    labelText,
    userOperation,
    operationNeed,
}) => {
    if(!userOperation.includes(operationNeed)) return null
    return (
    <ListItem className="text-black py-2 ml-4 my-2">
      <div style={{ width: buttonWidth }}>
        <Link to={to}>
          <Button
            size="small"
            variant={isActive ? "contained" : "text"}
            style={{
              cursor: "pointer",
              width: buttonWidth,
              justifyContent: "flex-start",
            }}
          >
            <ListItemIcon>
              <RadioButtonUncheckedIcon
                style={{
                  fontSize: "0.8rem",
                  marginRight: "5px",
                  color: isActive ? "white" : "black",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="caption"
              style={{
                color: isActive ? "white" : "black",
              }}
            >
              {labelText}
            </Typography>
          </Button>
        </Link>
      </div>
    </ListItem>
    );
};

export default MasterDataListItem;
