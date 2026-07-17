"use client";

import React from "react";
import { FiAlertTriangle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Table, Badge, Card, CardBody, Button } from "../../../../../components/ui";
import styles from "./page.module.scss";

export default function UploadErrorsPage() {
  const router = useRouter();

  const onBackToUpload = () => {
    router.push("/distributor/sales-upload");
  };

  const errors = [
    { row: "Row 12", field: "Secondary SKU", value: "MAG-NOD-100X", message: "SKU code does not exist in master catalog database." },
    { row: "Row 45", field: "Net Booked Value", value: "-₹ 1,200.00", message: "Field cannot contain a negative numeric currency amount." },
    { row: "Row 78", field: "Invoice Date", value: "2026-15-08", message: "Value does not match expected ISO date pattern (YYYY-MM-DD)." },
    { row: "Row 102", field: "Retailer Phone", value: "98765", message: "Mobile number must contain exactly 10 digits without prefix." }
  ];

  const columns = [
    {
      key: "row",
      header: "Row Index",
      mono: true,
      render: (v) => <span className={styles.rowLabel}>{v}</span>
    },
    {
      key: "field",
      header: "Column / Field Name",
      render: (v) => <span className={styles.fieldName}>{v}</span>
    },
    {
      key: "value",
      header: "Submitted Value",
      mono: true,
      render: (v) => <code className={styles.badValue}>{v}</code>
    },
    {
      key: "message",
      header: "Validation Issue Description",
      render: (v) => <span className={styles.errorDescription}>{v}</span>
    },
    {
      key: "severity",
      header: "Severity",
      align: "center",
      render: () => (
        <Badge tone="danger" variant="soft" dot>
          Fatal Error
        </Badge>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiAlertTriangle />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Upload Diagnostics</span>
              <Badge tone="primary" variant="soft" size="sm">In build</Badge>
            </div>
            <h2>Upload Validation Errors</h2>
            <p className={styles.subtitle}>Please resolve these data integrity warnings before committing records.</p>
          </div>
        </div>
        <Button variant="outline" leadingIcon={<FiRefreshCw />} onClick={onBackToUpload}>
          Retry Upload
        </Button>
      </div>

      <div className={styles.alertBanner}>
        <FiAlertTriangle className={styles.alertIcon} size={20} />
        <div>
          <strong>4 validation errors identified</strong>
          <p>Your file has not been committed. Correct the row entries listed below in your Excel sheet and re-upload.</p>
        </div>
      </div>

      <Card>
        <CardBody className={styles.cardBodyPaddingNone}>
          <Table 
            columns={columns}
            data={errors}
            rowKey={(row) => row.row}
          />
        </CardBody>
      </Card>
    </div>
  );
}
