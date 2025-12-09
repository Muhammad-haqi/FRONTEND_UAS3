const LS_KEY = "skyfly_orders";

export function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

export function saveOrderObj(order) {
  const arr = loadOrders();
  arr.push(order);
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export function updateOrderObj(order) {
  const arr = loadOrders().map((o) => (o.id === order.id ? order : o));
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export function deleteOrder(id) {
  const arr = loadOrders().filter((x) => x.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export function getRiwayat() {
  return JSON.parse(localStorage.getItem("riwayat") || "[]");
}

export function updateRiwayat(bookingCode, updateData) {
  const all = getRiwayat();
  const newData = all.map((item) =>
    item.bookingCode === bookingCode
      ? { ...item, ...updateData }
      : item
  );

  localStorage.setItem("riwayat", JSON.stringify(newData));
}


