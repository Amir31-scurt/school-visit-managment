export function buildWhatsAppLink(phone: string, message: string): string {
  const clean = phone.replace(/[\s\-\(\)\+]/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string): void {
  window.open(buildWhatsAppLink(phone, message), '_blank');
}
