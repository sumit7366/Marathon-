// Generate unique registration ID like BR-XXXXXX
export function generateRegistrationId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BR-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time for display
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate countdown
export function getCountdown(targetDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

// Get QR code URL
export function getVerifyUrl(registrationId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bareillyrunners.vercel.app';
  return `${baseUrl}/verify?id=${registrationId}`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone (Indian format)
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

// Admin credentials verification
export function verifyAdmin(password: string, pin: string): boolean {
  return password === 'deepeshpathak' && pin === '197277';
}

// Category colors
export function getCategoryColor(category: string): string {
  switch (category) {
    case '5KM': return '#22c55e';
    case '10KM': return '#3b82f6';
    case '21KM': return '#a855f7';
    default: return '#6b7280';
  }
}

// Category gradient
export function getCategoryGradient(category: string): string {
  switch (category) {
    case '5KM': return 'linear-gradient(135deg, #22c55e, #16a34a)';
    case '10KM': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    case '21KM': return 'linear-gradient(135deg, #a855f7, #7c3aed)';
    default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
  }
}
