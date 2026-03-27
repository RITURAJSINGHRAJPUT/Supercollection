import { WHATSAPP_NUMBER } from './constants';

export const generateWhatsAppUrl = (productName: string, price: number): string => {
  const message = encodeURIComponent(
    `Hello 👋\nI want to order:\n📦 Product: ${productName}\n💰 Price: ₹${price}\n\nPlease confirm the order.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export const openWhatsApp = (productName: string, price: number): void => {
  const url = generateWhatsAppUrl(productName, price);
  window.open(url, '_blank');
};
