import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.js';
import { apiClient } from './api.js';

/**
 * Convert any accepted image (PNG, JPG, JPEG, WEBP) to WebP format in client browser
 * @param {File} file - Original image file
 * @param {number} quality - WebP compression quality (0.1 to 1.0, default 0.85)
 * @returns {Promise<File>} WebP converted File object
 */
export const convertImageToWebP = (file, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for conversion'));
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const hasValidType = file.type && validTypes.includes(file.type.toLowerCase());
    const hasValidExt = /\.(png|jpe?g|webp)$/i.test(file.name);

    if (!hasValidType && !hasValidExt) {
      return reject(new Error('Invalid image format. Only PNG, JPG, JPEG, and WEBP formats are accepted.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for WebP conversion.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('WebP canvas conversion failed.'));
            }
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const cleanBaseName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_');
            const webpFile = new File([blob], `${cleanBaseName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const storageService = {
  // Upload photo to Firebase Storage staging folder (`temp_uploads/`)
  async uploadTempPhoto(file) {
    if (!file) return { success: false, error: 'No file selected' };

    // Automatically convert PNG, JPG, JPEG, or WEBP to WebP format in browser
    let fileToUpload = file;
    try {
      fileToUpload = await convertImageToWebP(file, 0.85);
      console.log(`[StorageService] Converted image to WebP: ${file.name} (${(file.size / 1024).toFixed(1)} KB) -> ${fileToUpload.name} (${(fileToUpload.size / 1024).toFixed(1)} KB)`);
    } catch (convErr) {
      console.warn('[StorageService] Client WebP conversion warning, fallback to original:', convErr.message);
    }

    // 1. Try Direct Client Upload using Firebase Web SDK
    try {
      const cleanFileName = fileToUpload.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `temp_uploads/temp_${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(storageRef, fileToUpload, {
        contentType: 'image/webp'
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        tempUrl: downloadUrl,
        storagePath: storagePath
      };
    } catch (clientError) {
      console.warn('[StorageService] Client SDK direct upload permission blocked (storage/unauthorized). Using Admin API fallback:', clientError.message);
    }

    // 2. Seamless Fallback: Upload via Express Backend API using Firebase Admin SDK (Full Admin Access)
    try {
      const formData = new FormData();
      formData.append('photo', fileToUpload);
      const response = await apiClient.post('/profiles/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000  // 30s timeout for file uploads (overrides default 5s)
      });
      if (response.data && response.data.success) {
        return {
          success: true,
          tempUrl: response.data.url,
          storagePath: response.data.storagePath
        };
      }
    } catch (apiError) {
      console.error('[StorageService] Express API upload error:', apiError.response?.data || apiError.message);
    }

    return {
      success: false,
      error: 'Failed to upload photo to Firebase Storage. Please check storage rules or try again.'
    };
  }
};
