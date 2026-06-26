import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';

interface OrderDetails {
  name: string;
  phone: string;
  flavor: string;
  weight: string;
  message: string;
  instructions: string;
  price: number;
}

export const sendWhatsAppOrder = async (
  details: OrderDetails,
  imageBlob: Blob
) => {
  try {
    // 1. Upload to Firebase Storage
    const filename = `custom-cakes/${Date.now()}-${details.phone}.jpg`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytes(storageRef, imageBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. Format WhatsApp Message
    const whatsappNumber = '917703870170';
    const message = `*NEW CUSTOM CAKE REQUEST* 🎂
---------------------------
*Customer Details:*
👤 Name: ${details.name}
📱 Phone: ${details.phone}

*Cake Details:*
🍰 Flavor: ${details.flavor}
⚖️ Weight: ${details.weight}
✍️ Message: ${details.message}
📝 Instructions: ${details.instructions || 'N/A'}

*Total Est. Price:* ₹${details.price}

*Design Preview:*
🖼️ ${downloadURL}
---------------------------
Please confirm my order.`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    // 3. Open WhatsApp
    window.open(whatsappURL, '_blank');

  } catch (error) {
    console.error('WhatsApp service failed:', error);
    throw error;
  }
};
