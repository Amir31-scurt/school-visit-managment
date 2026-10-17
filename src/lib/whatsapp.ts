export function buildWhatsAppLink(phone: string, message: string): string {
  // Strip everything except digits and leading +, then remove the + since wa.me uses digits only
  const clean = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string): void {
  window.open(buildWhatsAppLink(phone, message), '_blank');
}
