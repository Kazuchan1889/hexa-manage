import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  };

  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length > 0 && !isFaceDetected) {
        setIsFaceDetected(true);
        Swal.fire({
          icon: "success",
          title: "Wajah terdeteksi!",
          text: "Sistem mendeteksi wajah.",
        });
      }

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext("2d").clearRect(0, 0, displaySize.width, displaySize.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "captured-image.jpg";
    link.click();
  };

  React.useEffect(() => {
    loadModels();
    const interval = setInterval(() => {
      detectFace();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Face Detection</h1>
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="rounded-lg border-4 border-blue-500"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 rounded-lg"
          style={{ width: "640px", height: "480px" }}
        />
      </div>
      {isFaceDetected && (
        <button
          onClick={captureImage}
          className="mt-4 bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600"
        >
          Ambil Gambar
        </button>
      )}
    </div>
  );
};

export default FaceDetection;
