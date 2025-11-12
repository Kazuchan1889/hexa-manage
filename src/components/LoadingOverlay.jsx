import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const LoadingOverlay = ({ message = "Loading data...", fullscreen = true }) => {
  const containerClasses = fullscreen
    ? "min-h-[240px] h-full w-full"
    : "w-full";

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClasses} py-6`}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={56} thickness={4} />
      <Typography variant="body1" className="mt-4 text-gray-600">
        {message}
      </Typography>
    </div>
  );
};

export default LoadingOverlay;

