"use client";

import React, { useState } from "react";
import { FiUploadCloud, FiCheck, FiAlertCircle, FiLoader } from "react-icons/fi";
import styles from "./FileUpload.module.scss";

export default function FileUpload({ 
  onUploadSuccess, 
  folder = "uploads", 
  accept, 
  label = "Click or Drag file here", 
  subtitle = "Any file type supported. Max 500MB.",
  compact = false
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(10);
    setUploadedUrl(null);

    try {
      // Step 1: Request Presigned URL from Backend API
      const res = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get upload URL");

      setProgress(40);

      // Step 2: Upload File directly to Cloudflare R2
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Direct upload to Cloudflare R2 failed.");

      setProgress(100);
      
      const fileData = {
        key: data.key,
        url: data.publicUrl,
        name: file.name,
        rawFile: file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
      };

      setUploadedUrl(fileData);

      if (onUploadSuccess) {
        onUploadSuccess(fileData);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={`${styles.dropZone} ${uploading ? styles.uploading : ""} ${compact ? styles.compact : ""}`}>
        <input type="file" accept={accept} onChange={handleFileChange} disabled={uploading} hidden />
        <div className={styles.content}>
          {uploading ? (
            <FiLoader className={styles.spinIcon} size={compact ? 24 : 48} />
          ) : uploadedUrl ? (
            <FiCheck className={styles.successIcon} size={compact ? 24 : 48} />
          ) : (
            <FiUploadCloud className={styles.uploadIcon} size={compact ? 24 : 48} />
          )}

          <div className={styles.textStack}>
            <h3 className={styles.labelTitle}>
              {uploading
                ? `Uploading... ${progress}%`
                : uploadedUrl
                ? "File Uploaded Successfully!"
                : label}
            </h3>
            {!compact && <p className={styles.subtitle}>
              {!uploading && !uploadedUrl && subtitle}
            </p>}
          </div>
        </div>
      </label>

      {error && (
        <div className={styles.errorMessage}>
          <FiAlertCircle /> <span>{error}</span>
        </div>
      )}

      {uploadedUrl && uploadedUrl.preview && !compact && (
        <div className={styles.previewContainer}>
          <img src={uploadedUrl.preview} alt="Preview" className={styles.previewImage} />
        </div>
      )}
    </div>
  );
};
