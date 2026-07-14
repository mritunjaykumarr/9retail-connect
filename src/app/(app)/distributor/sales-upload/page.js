"use client";

import { useState } from "react";
import { 
  FiUploadCloud, 
  FiFileText, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiInfo, 
  FiArrowRight, 
  FiPlay, 
  FiCornerDownLeft 
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Button, 
  Table, 
  Badge, 
  EmptyState,
  Checkbox,
  Select,
  useToast
} from "../../../../../components/ui";
import styles from "./page.module.scss";

export default function SalesUploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Validate, 4: Done
  const [uploadedFile, setUploadedFile] = useState(null);
  const [saveMapping, setSaveMapping] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const onBackToDashboard = () => {
    router.push("/distributor");
  };

  // Simulated columns from uploaded file
  const fileColumns = ["InvoiceNo", "Customer Name", "ProductCode", "Qty Booked", "Net Amount", "Booking Date"];
  
  // Mapping state
  const [mappings, setMappings] = useState({
    invoiceNumber: "InvoiceNo",
    retailerName: "Customer Name",
    skuCode: "ProductCode",
    quantity: "Qty Booked",
    value: "Net Amount",
    date: "Booking Date"
  });

  const systemFields = [
    { key: "invoiceNumber", label: "Invoice Number", required: true, description: "Unique identifier for transaction" },
    { key: "retailerName", label: "Retailer Name", required: true, description: "Shop or retailer title" },
    { key: "skuCode", label: "SKU Code / Product", required: true, description: "Unique catalog code" },
    { key: "quantity", label: "Quantity", required: true, description: "Number of cases/units sold" },
    { key: "value", label: "Invoice Value", required: true, description: "Total value (pre-tax or net)" },
    { key: "date", label: "Order Date", required: false, description: "Date of transaction" }
  ];

  const validationErrors = [
    { row: 14, field: "SKU Code", value: "NULL", issue: "Missing product code mapping", action: "Row skipped" },
    { row: 42, field: "Quantity", value: "-12", issue: "Quantity must be positive", action: "Autocorrected to 12" },
    { row: 89, field: "Order Date", value: "2026/13/45", issue: "Invalid date format", action: "Fallback to current date" }
  ];

  const handleFileDrop = (e) => {
    e?.preventDefault();
    setUploadedFile({
      name: "distributor_sales_june_2026.xlsx",
      size: "142 KB",
      rows: 124
    });
    if (toast) {
      toast({
        title: "File uploaded successfully",
        description: "distributor_sales_june_2026.xlsx loaded successfully.",
        tone: "success"
      });
    }
    setStep(2);
  };

  const startValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setStep(3);
      if (toast) {
        toast({
          title: "Validation completed",
          description: "File contains 3 validation warnings.",
          tone: "warning"
        });
      }
    }, 1500);
  };

  const finalizeImport = () => {
    if (toast) {
      toast({
        title: "Import successful",
        description: "121 records staged and de-duplicated. 3 invalid rows skipped.",
        tone: "success"
      });
    }
    setStep(4);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Inventory &amp; Sales Data Manual Upload</h2>
          <p>Import and map your secondary sales data into the RetailConnect network.</p>
        </div>
        <Button variant="outline" leadingIcon={<FiCornerDownLeft />} onClick={onBackToDashboard}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stepper tracker */}
      <div className={styles.stepper}>
        {[
          { label: "Upload File", s: 1 },
          { label: "Column Mapping", s: 2 },
          { label: "Validation & Deduplication", s: 3 },
          { label: "Import Complete", s: 4 },
        ].map((item) => (
          <div 
            key={item.s} 
            className={`${styles.step} ${step === item.s ? styles.active : ""} ${step > item.s ? styles.completed : ""}`}
          >
            <div className={styles.stepNum}>
              {step > item.s ? <FiCheckCircle /> : item.s}
            </div>
            <span className={styles.stepLabel}>{item.label}</span>
            {item.s < 4 && <div className={styles.stepConnector} />}
          </div>
        ))}
      </div>

      {/* STEP 1: UPLOAD FILE */}
      {step === 1 && (
        <div className={styles.uploadView}>
          <div 
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => handleFileDrop()}
          >
            <FiUploadCloud className={styles.uploadIcon} />
            <h3>Drag &amp; drop your sales spreadsheet here</h3>
            <p>Supports Excel (.xlsx, .xls) or CSV files from Tally, SAP, or local systems</p>
            <Button size="md" variant="secondary">Browse files</Button>
          </div>

          <div className={styles.uploadGuideGrid}>
            <Card>
              <CardHeader title="Download standard template" subtitle="Skip column mapping completely" />
              <CardBody>
                <p className={styles.cardText}>
                  Use our standardized Excel workbook template. When you upload this template, RetailConnect will auto-detect all columns without requiring manual alignment.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="outline" trailingIcon={<FiArrowRight />}>
                  Download Excel Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader title="How manual upload works" subtitle="Distributor brief v1 requirements" />
              <CardBody>
                <ul className={styles.guideList}>
                  <li><strong>Column Mapping:</strong> Map headers from your ERP file to RetailConnect database fields once.</li>
                  <li><strong>Validation check:</strong> Our system validates every row for syntax, numeric limits, and constraints.</li>
                  <li><strong>Staging &amp; Deduplication:</strong> Identical records containing the same distributor code, date, and invoice are safely de-duplicated.</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {step === 2 && (
        <Card className={styles.mappingCard}>
          <CardHeader 
            title="Map Column Headers" 
            subtitle={`File: ${uploadedFile?.name} (${uploadedFile?.rows} rows detected)`} 
          />
          <CardBody>
            <p className={styles.infoText}>
              <FiInfo className={styles.infoIcon} /> Align columns from your uploaded file to the system database requirements. We have pre-filled matching titles where possible.
            </p>

            <div className={styles.mappingGrid}>
              <div className={styles.mappingTableHeader}>
                <span>System Field</span>
                <span>File Column Target</span>
              </div>

              {systemFields.map((field) => (
                <div key={field.key} className={styles.mappingRow}>
                  <div className={field.required ? styles.requiredField : styles.optionalField}>
                    <span className={styles.fieldLabel}>
                      {field.label}
                      {field.required && <span className={styles.reqMark}>*</span>}
                    </span>
                    <span className={styles.fieldDesc}>{field.description}</span>
                  </div>
                  <div className={styles.fieldSelector}>
                    <Select
                      options={[
                        { value: "", label: "-- Choose Column --" },
                        ...fileColumns.map(col => ({ value: col, label: col }))
                      ]}
                      value={mappings[field.key]}
                      onChange={(e) => setMappings({ ...mappings, [field.key]: e.target.value })}
                      size="md"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.mappingOptions}>
              <Checkbox 
                label="Save column mapping configuration for next upload" 
                checked={saveMapping}
                onChange={(e) => setSaveMapping(e.target.checked)}
              />
            </div>
          </CardBody>
          <CardFooter className={styles.cardFooterActions}>
            <Button variant="ghost" onClick={() => setStep(1)}>
              Upload different file
            </Button>
            <Button 
              leadingIcon={isValidating ? null : <FiPlay />} 
              onClick={startValidation}
              disabled={isValidating}
            >
              {isValidating ? "Validating & Deduplicating..." : "Run Validation & Import"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: VALIDATION & ERRORS */}
      {step === 3 && (
        <div className={styles.validationView}>
          <Card>
            <CardHeader 
              title="Validation and Deduplication Review" 
              subtitle="Verification checks complete" 
            />
            <CardBody>
              <div className={styles.summaryStatsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>124</span>
                  <span className={styles.statLabel}>Total Rows Analyzed</span>
                </div>
                <div className={styles.statBox}>
                  <span className={`${styles.statVal} ${styles.successColor}`}>121</span>
                  <span className={styles.statLabel}>Valid Rows Ready</span>
                </div>
                <div className={styles.statBox}>
                  <span className={`${styles.statVal} ${styles.warningColor}`}>3</span>
                  <span className={styles.statLabel}>Warnings / Errors</span>
                </div>
                <div className={styles.statBox}>
                  <span className={`${styles.statVal} ${styles.infoColor}`}>0</span>
                  <span className={styles.statLabel}>Duplicate Invoices Skipped</span>
                </div>
              </div>

              <div className={styles.warningsTitleRow}>
                <FiAlertTriangle className={styles.warningSectionIcon} />
                <h4>Validation Warnings Report</h4>
              </div>

              <Table
                columns={[
                  { key: "row", header: "Row", width: "80px", align: "center", mono: true },
                  { key: "field", header: "Column Field" },
                  { key: "value", header: "Value Found", mono: true },
                  { key: "issue", header: "Issue Detected" },
                  { 
                    key: "action", 
                    header: "System Corrective Action",
                    render: (v) => (
                      <Badge tone={v === "Row skipped" ? "danger" : "warning"} variant="soft" dot>
                        {v}
                      </Badge>
                    )
                  }
                ]}
                data={validationErrors}
                rowKey={(row) => row.row}
              />
            </CardBody>
            <CardFooter className={styles.cardFooterActions}>
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back to Mapping
              </Button>
              <Button onClick={finalizeImport}>
                Proceed and Import 121 Rows
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 4 && (
        <div className={styles.successView}>
          <EmptyState
            tone="success"
            icon={<FiCheckCircle />}
            title="Import Complete &amp; De-duplicated"
            description="Your secondary sales and inventory items have been staged and loaded successfully. Metrics dashboards are automatically updated."
            actions={
              <div className={styles.successActions}>
                <Button onClick={onBackToDashboard}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Upload Another File
                </Button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
