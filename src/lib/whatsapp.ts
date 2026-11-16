export function normalizeWhatsAppPhone(phone: string): string {
  // Keep only digits
  let clean = phone.replace(/\D/g, '');

  // Strip leading 00 (international prefix)
  if (clean.startsWith('00')) {
    clean = clean.slice(2);
  }

  // Auto-prefix Senegal country code (221) for 9-digit local numbers starting with 7 or 3
  if (clean.length === 9 && (clean.startsWith('7') || clean.startsWith('3'))) {
    clean = '221' + clean;
  }

  return clean;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const clean = normalizeWhatsAppPhone(phone);
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    const query = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${clean}${query}`;
  }

  const textParam = message ? `&text=${encodeURIComponent(message)}` : '';
  return `https://web.whatsapp.com/send?phone=${clean}${textParam}`;
}

export function openWhatsApp(phone: string, message: string): void {
  window.open(buildWhatsAppLink(phone, message), '_blank');
}

