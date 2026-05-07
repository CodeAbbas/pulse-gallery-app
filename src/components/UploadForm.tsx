"use client";

import { useState } from "react";

export default function UploadForm() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [progress, setProgress] =
    useState(0);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "audio/mpeg",
    "audio/wav",
  ];

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage("");

    if (
      event.target.files &&
      event.target.files.length > 0
    ) {
      const file = event.target.files[0];

      // File type validation
      if (
        !allowedTypes.includes(file.type)
      ) {
        setMessage(
          "Invalid file type selected."
        );
        return;
      }

      // File size validation
      if (file.size > MAX_FILE_SIZE) {
        setMessage(
          "File size exceeds 10MB limit."
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage(
        "Please select a file."
      );
      return;
    }

    try {
      setLoading(true);
      setProgress(20);
      setMessage("");

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      setProgress(50);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      setProgress(80);

      const data = await response.json();

      if (data.success) {
        setProgress(100);

        setMessage(
          "File uploaded successfully!"
        );

        setSelectedFile(null);
      } else {
        setMessage(
          "Upload failed."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="card shadow border-0">
      <div className="card-body p-4">
        <h2 className="mb-4 text-center">
          Upload Media
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Choose Image or Audio File
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/*,audio/*"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="alert alert-info">
              <strong>Selected:</strong>{" "}
              {selectedFile.name}
            </div>
          )}

          {progress > 0 && (
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${progress}%`,
                }}
              >
                {progress}%
              </div>
            </div>
          )}

          {message && (
            <div className="alert alert-secondary">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
}