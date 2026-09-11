import { adminDb } from '../config/firebaseAdmin.js';

export const inquiryService = {
  // Submit Contact Form Inquiry
  async submitInquiry(inquiryData) {
    try {
      const docRef = await adminDb.collection('inquiries').add({
        ...inquiryData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id, message: 'Inquiry submitted successfully!' };
    } catch (error) {
      console.error('[InquiryService] Error submitting inquiry:', error);
      throw error;
    }
  },

  // Get All Inquiries
  async getAllInquiries() {
    try {
      const snapshot = await adminDb.collection('inquiries').get();
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      return { success: true, data: list };
    } catch (error) {
      console.error('[InquiryService] Error fetching inquiries:', error);
      throw error;
    }
  },

  // Update Inquiry Status
  async updateStatus(id, status) {
    try {
      await adminDb.collection('inquiries').doc(id).update({
        status,
        updatedAt: new Date().toISOString()
      });
      return { success: true, id, status };
    } catch (error) {
      console.error(`[InquiryService] Error updating inquiry ${id}:`, error);
      throw error;
    }
  }
};
