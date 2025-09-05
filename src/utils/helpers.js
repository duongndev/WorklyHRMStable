
export const getMarkerColor = status => {
  switch (status) {
    case 'working':
      return 'blue';
    case 'leave':
      return 'orange';
    case 'ot':
      return 'green';
    default:
      return 'gray';
  }
};

export const getMarkerStatusText = status => {
  switch (status) {
    case 'working':
      return 'Làm việc';
    case 'leave':
      return 'Nghỉ phép';
    case 'ot':
      return 'Làm thêm giờ';
    default:
      return status;
  }
};

export const groupByDate = data => {
  const result = {};
  data.forEach(item => {
    const dateKey = new Date(item.date).toISOString().split('T')[0];
    if (!result[dateKey]) {
      result[dateKey] = [];
    }
    result[dateKey].push(item);
  });
  return result;
};

export const generateMarkedDates = groupedData => {
  const marked = {};
  for (const [date, items] of Object.entries(groupedData)) {
    marked[date] = {
      marked: true,
      dots: items.map(i => ({color: getMarkerColor(i.status)})),
    };
  }
  return marked;
};

export const generatePeriod = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const period = {};
  let currentDate = new Date(start);
  while (currentDate <= end) {
    const dateKey = currentDate.toISOString().split('T')[0];
    period[dateKey] = {
      marked: true,
      color: 'blue',
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return period;
};

export const getStatusColor = status => {
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

export const getStatusText = status => {
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
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
};
