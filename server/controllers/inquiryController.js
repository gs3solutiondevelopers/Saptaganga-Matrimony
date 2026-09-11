import { inquiryService } from '../services/inquiryService.js';

export const inquiryController = {
  // POST /api/inquiries
  async submitInquiry(req, res, next) {
    try {
      const inquiryData = req.body;
      if (!inquiryData.name || !inquiryData.phone) {
        return res.status(400).json({ success: false, error: 'Name and Phone are required' });
      }
      const result = await inquiryService.submitInquiry(inquiryData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/inquiries
  async getAllInquiries(req, res, next) {
    try {
      const result = await inquiryService.getAllInquiries();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/inquiries/:id/status
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await inquiryService.updateStatus(id, status);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
