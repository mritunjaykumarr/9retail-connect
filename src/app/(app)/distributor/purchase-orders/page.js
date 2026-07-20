"use client";

import { useState } from "react";
import { 
  FiShoppingBag, 
  FiSearch, 
  FiFileText,
  FiFilter, 
  FiCheck, 
  FiX, 
  FiPrinter, 
  FiRotateCcw, 
  FiMoreHorizontal,
  FiEye,
  FiTruck,
  FiAlertCircle,
  FiCornerDownLeft
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
  Checkbox,
  useToast,
  Card,
  CardBody,
  Tabs
} from "../../../../../components/ui";
import styles from "./page.module.scss";

// Initial orders list representing sales officer bookings
const initialOrders = [
  { id: "#ORD-250618", isNew: true, so: "Rohit Sharma", zone: "North Zone", date: "18 Jun, 2025", time: "10:30 AM", items: 24, value: "₹ 58,230", numericValue: 58230, status: "Pending", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=RS" },
  { id: "#ORD-250617", isNew: true, so: "Neha Patel", zone: "West Zone", date: "18 Jun, 2025", time: "09:15 AM", items: 18, value: "₹ 32,450", numericValue: 32450, status: "Accepted", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=NP" },
  { id: "#ORD-250616", isNew: true, so: "Arjun Mehta", zone: "South Zone", date: "17 Jun, 2025", time: "04:45 PM", items: 30, value: "₹ 76,850", numericValue: 76850, status: "In Transit", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AM" },
  { id: "#ORD-250615", isNew: true, so: "Priya Singh", zone: "East Zone", date: "17 Jun, 2025", time: "02:20 PM", items: 12, value: "₹ 19,800", numericValue: 19800, status: "Delivered", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PS" },
  { id: "#ORD-250614", isNew: true, so: "Kunal Verma", zone: "Central Zone", date: "16 Jun, 2025", time: "11:10 AM", items: 20, value: "₹ 41,300", numericValue: 41300, status: "Rejected", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=KV" },
  { id: "#ORD-250613", isNew: false, so: "Rohit Sharma", zone: "North Zone", date: "15 Jun, 2025", time: "01:15 PM", items: 15, value: "₹ 28,900", numericValue: 28900, status: "Delivered", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=RS" },
  { id: "#ORD-250612", isNew: false, so: "Neha Patel", zone: "West Zone", date: "15 Jun, 2025", time: "11:30 AM", items: 22, value: "₹ 49,100", numericValue: 49100, status: "Accepted", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=NP" }
];

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [orderToReject, setOrderToReject] = useState(null);
  const { toast } = useToast();

  const tabs = ["All Orders", "Pending", "Accepted", "In Transit", "Delivered", "Rejected"];

  const onBackToDashboard = () => {
    router.push("/distributor");
  };

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === "All Orders" || o.status === activeTab;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.so.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusTone = (status) => {
    switch(status) {
      case "Pending": return "warning";
      case "Accepted": return "success";
      case "In Transit": return "info";
      case "Delivered": return "success";
      case "Rejected": return "danger";
      default: return "neutral";
    }
  };

  // Stats calculation
  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const acceptedCount = orders.filter(o => o.status === "Accepted").length;
  const totalValue = orders.reduce((sum, o) => sum + o.numericValue, 0);

  const handleApproveOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Accepted", isNew: false } : o));
    if (toast) {
      toast({
        title: "Order Approved",
        description: `Order ${orderId} has been accepted and is ready for fulfillment.`,
        tone: "success"
      });
    }
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: "Accepted" }));
    }
  };

  const handleDispatchOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "In Transit" } : o));
    if (toast) {
      toast({
        title: "Order Dispatched",
        description: `Order ${orderId} has been handed off to transit.`,
        tone: "info"
      });
    }
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: "In Transit" }));
    }
  };

  const handleRejectOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderToReject) return;
    
    const orderId = orderToReject.id;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Rejected", isNew: false } : o));
    if (toast) {
      toast({
        title: "Order Rejected",
        description: `Order ${orderId} rejected. Reason: ${rejectionNote || 'Not specified'}`,
        tone: "danger"
      });
    }
    
    setRejectModalOpen(false);
    setRejectionNote("");
    setOrderToReject(null);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (v, row) => (
        <div className={styles.orderIdStack}>
          <strong>{v}</strong>
          {row.isNew && <span className={styles.newBadge}>New</span>}
        </div>
      ),
    },
    {
      key: "so",
      header: "Sales Officer",
      render: (v, row) => (
        <div className={styles.soProfile}>
          <Avatar name={v} src={row.avatar} size="sm" shape="rounded" />
          <div className={styles.soInfo}>
            <span className={styles.soName}>{v}</span>
            <span className={styles.soZone}>{row.zone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      render: (v, row) => (
        <div className={styles.datetime}>
          <span className={styles.date}>{v}</span>
          <span className={styles.time}>{row.time}</span>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items Count",
      align: "right",
      mono: true,
      render: (v) => <span>{v} SKUs</span>
    },
    {
      key: "value",
      header: "Order Value",
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
            onClick={() => setSelectedOrder(row)}
          >
            <FiEye />
          </button>
          {row.status === "Pending" && (
            <>
              <button 
                type="button" 
                className={`${styles.actionIconBtn} ${styles.actionAccept}`} 
                title="Accept Order"
                onClick={() => handleApproveOrder(row.id)}
              >
                <FiCheck />
              </button>
              <button 
                type="button" 
                className={`${styles.actionIconBtn} ${styles.actionReject}`} 
                title="Reject Order"
                onClick={() => {
                  setOrderToReject(row);
                  setRejectModalOpen(true);
                }}
              >
                <FiX />
              </button>
            </>
          )}
          {row.status === "Accepted" && (
            <button 
              type="button" 
              className={styles.actionIconBtn} 
              title="Dispatch Order"
              onClick={() => handleDispatchOrder(row.id)}
            >
              <FiTruck />
            </button>
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
            <FiFileText />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Fulfillment Center</span>
              <Badge tone="primary" variant="soft" size="sm">In build</Badge>
            </div>
            <h2>Purchase Orders Management</h2>
            <p>Review, accept, reject or stage sales officer bookings for delivery dispatch.</p>
          </div>
        </div>
        <Button variant="outline" leadingIcon={<FiCornerDownLeft />} onClick={onBackToDashboard}>
          Back to Dashboard
        </Button>
      </div>

      {/* Overview Stats */}
      <div className={styles.statsGrid}>
        <StatCard 
          label="Total Booked Value" 
          value={`₹ ${(totalValue / 1000).toFixed(1)}K`} 
          deltaLabel="Rolled up this month" 
          icon={<FiShoppingBag />} 
        />
        <StatCard 
          label="Pending Acceptance" 
          value={String(pendingCount)} 
          deltaLabel="Needs immediate action" 
          icon={<FiAlertCircle />} 
        />
        <StatCard 
          label="Accepted & Staged" 
          value={String(acceptedCount)} 
          deltaLabel="Ready for dispatch" 
          icon={<FiCheck />} 
        />
        <StatCard 
          label="Total Orders Handled" 
          value={String(totalOrders)} 
          deltaLabel="All active statuses" 
          icon={<FiMoreHorizontal />} 
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
                placeholder="Search orders (ID, Sales Officer, Zone)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table 
            columns={columns}
            data={filteredOrders}
            rowKey={(row) => row.id}
            onRowClick={(row) => setSelectedOrder(row)}
          />
        </CardBody>
      </Card>

      {/* Order detail drawer panel */}
      <Drawer
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details ${selectedOrder?.id}`}
        description="Fulfillment information and action panel"
        footer={
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            {selectedOrder?.status === "Pending" && (
              <>
                <Button 
                  onClick={() => handleApproveOrder(selectedOrder.id)} 
                  style={{ flex: 1 }}
                >
                  Accept Order
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setOrderToReject(selectedOrder);
                    setRejectModalOpen(true);
                  }}
                  style={{ flex: 1 }}
                >
                  Reject Order
                </Button>
              </>
            )}
            {selectedOrder?.status === "Accepted" && (
              <Button 
                onClick={() => handleDispatchOrder(selectedOrder.id)} 
                style={{ flex: 1 }}
              >
                Dispatch Order
              </Button>
            )}
            <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
              Close Panel
            </Button>
          </div>
        }
      >
        {selectedOrder && (
          <div className={styles.drawerBody}>
            <div className={styles.drawerStats}>
              <StatCard label="Order Value" value={selectedOrder.value} />
              <div className={styles.drawerStatusCard}>
                <span className={styles.drawerStatusLabel}>Status</span>
                <div className={styles.drawerStatusValue}>
                  <Badge tone={getStatusTone(selectedOrder.status)} variant="soft" size="md" dot>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>
            </div>

            <h4 className={styles.drawerSubTitle}>Order Information</h4>
            <ul className={styles.drawerList}>
              <li>
                <div className={styles.drawerListText}>
                  <span>Sales Officer</span>
                  <span>{selectedOrder.so} ({selectedOrder.zone})</span>
                </div>
              </li>
              <li>
                <div className={styles.drawerListText}>
                  <span>Booking Date</span>
                  <span>{selectedOrder.date} at {selectedOrder.time}</span>
                </div>
              </li>
            </ul>

            <h4 className={styles.drawerSubTitle}>Items Ordered</h4>
            <ul className={styles.drawerList}>
              <li>
                <div className={styles.drawerListText}>
                  <span>Maggi Noodles 12-Pack</span>
                  <span>5 cases ordered</span>
                </div>
              </li>
              <li>
                <div className={styles.drawerListText}>
                  <span>Tata Salt 1kg</span>
                  <span>10 cases ordered</span>
                </div>
              </li>
              <li>
                <div className={styles.drawerListText}>
                  <span>Nescafe Classic 50g</span>
                  <span>4 cases ordered</span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </Drawer>

      {/* Reject Order Reason modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reason for Rejection"
        description="Provide feedback to the sales officer about this rejection."
      >
        <form onSubmit={handleRejectOrderSubmit} className={styles.modalForm}>
          <Input 
            placeholder="E.g., Out of stock, credit limit exceeded..." 
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
              Reject Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
