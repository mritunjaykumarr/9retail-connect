"use client";

import { useState } from "react";
import { 
  FiCornerDownLeft, 
  FiSearch, 
  FiFilter, 
  FiCheck, 
  FiX, 
  FiPrinter, 
  FiEye,
  FiFileText,
  FiAlertCircle,
  FiClipboard
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { 
  Table, 
  Badge, 
  Drawer, 
  Button, 
  StatCard, 
  Avatar, 
  Modal, 
  Input, 
  useToast,
  Card,
  CardBody,
  Tabs
} from "../../../../../components/ui";
import styles from "./page.module.scss";

// Initial returns list representing retailer damage/expiry returns
const initialReturns = [
  { id: "#RET-250801", isNew: true, retailer: "Balaji Supermarket", so: "Rohit Sharma", date: "18 Jun, 2025", items: 12, value: "₹ 4,320", numericValue: 4320, status: "Pending", reason: "Expired Product", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=RS" },
  { id: "#RET-250802", isNew: true, retailer: "Krishna Groceries", so: "Neha Patel", date: "18 Jun, 2025", items: 8, value: "₹ 2,450", numericValue: 2450, status: "Approved", reason: "Damaged in Transit", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=NP" },
  { id: "#RET-250803", isNew: true, retailer: "AP Traders", so: "Arjun Mehta", date: "17 Jun, 2025", items: 25, value: "₹ 8,900", numericValue: 8900, status: "Pending", reason: "Wrong SKU Delivered", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AM" },
  { id: "#RET-250804", isNew: false, retailer: "Balaji Supermarket", so: "Priya Singh", date: "16 Jun, 2025", items: 6, value: "₹ 1,800", numericValue: 1800, status: "Approved", reason: "Near Expiry Stock", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PS" },
  { id: "#RET-250805", isNew: false, retailer: "Pooja Mart", so: "Kunal Verma", date: "15 Jun, 2025", items: 15, value: "₹ 5,100", numericValue: 5100, status: "Rejected", reason: "Unsanctioned Return", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=KV" },
  { id: "#RET-250806", isNew: false, retailer: "Verma Retail", so: "Rohit Sharma", date: "14 Jun, 2025", items: 10, value: "₹ 3,200", numericValue: 3200, status: "Approved", reason: "Expired Product", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=RS" }
];

export default function ReconciliationPage() {
  const router = useRouter();
  const [returns, setReturns] = useState(initialReturns);
  const [activeTab, setActiveTab] = useState("All Returns");
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [returnToReject, setReturnToReject] = useState(null);
  const { toast } = useToast();

  const tabs = ["All Returns", "Pending", "Approved", "Rejected"];

  const onBackToDashboard = () => {
    router.push("/distributor");
  };

  // Filter returns
  const filteredReturns = returns.filter(r => {
    const matchesTab = activeTab === "All Returns" || r.status === activeTab;
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.retailer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.so.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusTone = (status) => {
    switch(status) {
      case "Pending": return "warning";
      case "Approved": return "success";
      case "Rejected": return "danger";
      default: return "neutral";
    }
  };

  // Stats calculation
  const totalCount = returns.length;
  const pendingCount = returns.filter(r => r.status === "Pending").length;
  const approvedValue = returns.filter(r => r.status === "Approved").reduce((sum, r) => sum + r.numericValue, 0);

  const handleApproveReturn = (returnId) => {
    setReturns(prev => prev.map(r => r.id === returnId ? { ...r, status: "Approved", isNew: false } : r));
    if (toast) {
      toast({
        title: "Return Approved",
        description: `Credit Note issued for ${returnId}. Stock level corrected automatically.`,
        tone: "success"
      });
    }
    if (selectedReturn?.id === returnId) {
      setSelectedReturn(prev => ({ ...prev, status: "Approved" }));
    }
  };

  const handleRejectReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnToReject) return;
    
    const returnId = returnToReject.id;
    setReturns(prev => prev.map(r => r.id === returnId ? { ...r, status: "Rejected", isNew: false } : r));
    if (toast) {
      toast({
        title: "Return Claim Rejected",
        description: `Return ${returnId} rejected. Reason: ${rejectionNote || 'Not specified'}`,
        tone: "danger"
      });
    }
    
    setRejectModalOpen(false);
    setRejectionNote("");
    setReturnToReject(null);
    if (selectedReturn?.id === returnId) {
      setSelectedReturn(null);
    }
  };

  const columns = [
    {
      key: "id",
      header: "Return ID",
      render: (v, row) => (
        <div className={styles.idStack}>
          <strong>{v}</strong>
          {row.isNew && <span className={styles.newBadge}>New</span>}
        </div>
      ),
    },
    {
      key: "retailer",
      header: "Retailer Shop",
      render: (v) => <strong>{v}</strong>,
    },
    {
      key: "so",
      header: "Sales Officer",
      render: (v, row) => (
        <div className={styles.soProfile}>
          <Avatar name={v} src={row.avatar} size="sm" shape="rounded" />
          <span className={styles.soName}>{v}</span>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason Category",
      render: (v) => (
        <span className={styles.reasonLabel}>
          <FiFileText />
          {v}
        </span>
      )
    },
    {
      key: "date",
      header: "Filed Date",
    },
    {
      key: "items",
      header: "Quantity",
      align: "right",
      mono: true,
      render: (v) => <span>{v} units</span>
    },
    {
      key: "value",
      header: "Estimated Value",
      align: "right",
      mono: true,
      render: (v) => <strong>{v}</strong>
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (v) => (
        <Badge tone={getStatusTone(v)} variant="soft" dot>
          {v}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (_, row) => (
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button 
            type="button" 
            className={styles.actionIconBtn} 
            title="View Details"
            onClick={() => setSelectedReturn(row)}
          >
            <FiEye />
          </button>
          {row.status === "Pending" && (
            <>
              <button 
                type="button" 
                className={`${styles.actionIconBtn} ${styles.actionAccept}`} 
                title="Approve &amp; issue Credit Note"
                onClick={() => handleApproveReturn(row.id)}
              >
                <FiCheck />
              </button>
              <button 
                type="button" 
                className={`${styles.actionIconBtn} ${styles.actionReject}`} 
                title="Reject Return Claim"
                onClick={() => {
                  setReturnToReject(row);
                  setRejectModalOpen(true);
                }}
              >
                <FiX />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiClipboard />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Claims Settlement</span>
              <Badge tone="primary" variant="soft" size="sm">In build</Badge>
            </div>
            <h2>Returns &amp; Claims Reconciliation</h2>
            <p>Verify retailer damage/expiry returns and issue settled credit notes.</p>
          </div>
        </div>
        <Button variant="outline" leadingIcon={<FiCornerDownLeft />} onClick={onBackToDashboard}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className={styles.statsGrid}>
        <StatCard 
          label="Total Return Items Claimed" 
          value={String(totalCount)} 
          deltaLabel="Claims filed this period" 
          icon={<FiFileText />} 
        />
        <StatCard 
          label="Claims Pending Audit" 
          value={String(pendingCount)} 
          deltaLabel="Needs claim confirmation" 
          icon={<FiAlertCircle />} 
        />
        <StatCard 
          label="Settled Credit Issued" 
          value={`₹ ${(approvedValue / 1000).toFixed(1)}K`} 
          deltaLabel="Credited back to retailers" 
          icon={<FiCheck />} 
        />
      </div>

      <Card>
        <CardBody className={styles.cardBodyPaddingNone}>
          {/* Tab filter lists */}
          <div className={styles.tabsWrap}>
            <Tabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
          </div>

          <div className={styles.filtersArea}>
            <div className={styles.searchBox}>
              <Input
                leading={<FiSearch />}
                placeholder="Search returns (ID, Retailer, Sales Officer, Reason)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table 
            columns={columns}
            data={filteredReturns}
            rowKey={(row) => row.id}
            onRowClick={(row) => setSelectedReturn(row)}
          />
        </CardBody>
      </Card>

      {/* Return details drawer panel */}
      <Drawer
        open={!!selectedReturn}
        onClose={() => setSelectedReturn(null)}
        title={`Return Details ${selectedReturn?.id}`}
        description="Claim validation and credit processing details"
        footer={
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            {selectedReturn?.status === "Pending" && (
              <>
                <Button 
                  onClick={() => handleApproveReturn(selectedReturn.id)} 
                  style={{ flex: 1 }}
                >
                  Approve Claim
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setReturnToReject(selectedReturn);
                    setRejectModalOpen(true);
                  }}
                  style={{ flex: 1 }}
                >
                  Reject Claim
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={() => setSelectedReturn(null)}>
              Close Panel
            </Button>
          </div>
        }
      >
        {selectedReturn && (
          <div className={styles.drawerBody}>
            <div className={styles.drawerStats}>
              <StatCard label="Estimated Value" value={selectedReturn.value} />
              <StatCard label="Status" value={selectedReturn.status} />
            </div>

            <h4 className={styles.drawerSubTitle}>Claim Details</h4>
            <ul className={styles.drawerList}>
              <li>
                <div className={styles.drawerListText}>
                  <span>Retailer Shop</span>
                  <span>{selectedReturn.retailer}</span>
                </div>
              </li>
              <li>
                <div className={styles.drawerListText}>
                  <span>Assigned Sales Officer</span>
                  <span>{selectedReturn.so}</span>
                </div>
              </li>
              <li>
                <div className={styles.drawerListText}>
                  <span>Claim Reason Category</span>
                  <span>{selectedReturn.reason}</span>
                </div>
              </li>
              <li>
                <div className={styles.drawerListText}>
                  <span>Claim Filed Date</span>
                  <span>{selectedReturn.date}</span>
                </div>
              </li>
            </ul>

            <h4 className={styles.drawerSubTitle}>Damaged / Expired Items List</h4>
            <ul className={styles.drawerList}>
              <li>
                <div className={styles.drawerListText}>
                  <span>Maggi Noodles 12-Pack</span>
                  <span>{selectedReturn.items} units returned</span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </Drawer>

      {/* Reject modal for return claim */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reason for Claim Rejection"
        description="Provide feedback to the retailer about this rejection."
      >
        <form onSubmit={handleRejectReturnSubmit} className={styles.modalForm}>
          <Input 
            placeholder="E.g., Claim window expired, items missing..." 
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            required
            autoFocus
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
            <Button type="button" variant="ghost" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Reject Claim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
