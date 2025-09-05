export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'approved':
      return '#4CAF50';
    case 'rejected':
      return '#F44336';
    default:
      return '#666666';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Chờ duyệt';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    default:
      return status;
  }
};
