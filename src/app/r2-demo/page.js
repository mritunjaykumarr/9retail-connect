"use client";

import React, { useState } from "react";
import { FiUploadCloud, FiCheck, FiAlertCircle, FiLoader } from "react-icons/fi";
import styles from "./page.module.scss";

export default function R2DemoPage() {
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
          folder: "demo-uploads",
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

      if (!uploadRes.ok) throw new Error("Direct upload to Cloudflare R2 failed. Did you configure CORS?");

      setProgress(100);
      
      // We don't have a public domain yet in .env, so we generate a direct Object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setUploadedUrl({
        preview: objectUrl,
        key: data.key,
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cloudflare R2 Storage Demo</h1>
        <p>Direct browser-to-bucket uploads using S3 Presigned URLs.</p>
      </div>

      <div className={styles.card}>
        <label className={`${styles.dropZone} ${uploading ? styles.uploading : ""}`}>
          <input type="file" onChange={handleFileChange} disabled={uploading} hidden />
          <div className={styles.content}>
            {uploading ? (
              <FiLoader className={styles.spinIcon} size={48} />
            ) : uploadedUrl ? (
              <FiCheck className={styles.successIcon} size={48} />
            ) : (
              <FiUploadCloud className={styles.uploadIcon} size={48} />
            )}

            <h3>
              {uploading
                ? `Uploading to R2... ${progress}%`
                : uploadedUrl
                ? "File Uploaded Successfully!"
                : "Click or Drag file here"}
            </h3>
            <p className={styles.subtitle}>
              {!uploading && !uploadedUrl && "Any file type supported. Max 500MB."}
            </p>
          </div>
        </label>

        {error && (
          <div className={styles.errorMessage}>
            <FiAlertCircle /> <span>{error}</span>
          </div>
        )}

        {uploadedUrl && (
          <div className={styles.successMessage}>
            <p><strong>Bucket Key:</strong> {uploadedUrl.key}</p>
            <div className={styles.previewContainer}>
              <img src={uploadedUrl.preview} alt="Preview" className={styles.previewImage} />
            </div>
            <p className={styles.note}>
              Check your Cloudflare Dashboard under <code>retailconnect-uploads / demo-uploads</code> to see the file!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
