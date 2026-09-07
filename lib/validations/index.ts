export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith("91"));
}
