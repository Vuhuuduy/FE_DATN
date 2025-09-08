// ================== ORDER STATUS ==================
export const ORDER_STATUS = [
  { key: "Chờ xác nhận", label: "Chờ xác nhận" },
  { key: "Đã xác nhận", label: "Đã xác nhận" },
  { key: "Đang giao hàng", label: "Đang giao hàng" },
  { key: "Đã hoàn thành", label: "Đã hoàn thành" },
  { key: "Đã hủy", label: "Đã hủy" },
  // { key: 'Đã hoàn tiền', label: 'Đã hoàn tiền' },
];

export const ORDER_STATUS_FLOW = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao hàng",
  "Đã hoàn thành",
  // 'Đã hoàn tiền',
  "Đã hủy",
];

export const getStatusTagColor = (status: string) => {
  switch (status) {
    case "Chờ xác nhận":
      return "default";
    case "Đã xác nhận":
      return "cyan";
    case "Đang giao hàng":
      return "blue"; // ✅ sửa đúng với ORDER_STATUS
    case "Đã hoàn thành":
      return "green";
    case "Đã hủy":
      return "red";
    // case 'Đã hoàn tiền':
    //   return 'orange';
    default:
      return "default";
  }
};

// ================== PAYMENT STATUS ==================
export const getPaymentStatusTagColor = (status: string) => {
  switch (status) {
    case "Chưa thanh toán":
      return "red";
    case "Đã thanh toán":
      return "green";
    default:
      return "default";
  }
};
