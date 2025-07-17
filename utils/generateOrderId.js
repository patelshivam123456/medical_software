export function generateOrderId() {
    const part1 = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const part2 = Math.floor(1000 + Math.random() * 9000);     // 4 digits
    const part3 = "000";
    const part4 = Math.floor(1000 + Math.random() * 9000);     // 4 digits
  
    return `${part1}-${part2}-${part3}-${part4}`;
  }