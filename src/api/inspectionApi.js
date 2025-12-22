/**
 * Inspection API Service for Admin Portal
 * Handles fetching and displaying real inspection data from the database
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Fetch inspection by ID with all related data
 */
export const getInspectionById = async (inspectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inspection: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inspection:', error);
    throw error;
  }
};

/**
 * Fetch inspections with filters
 */
export const getInspections = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.plateNumber) queryParams.append('plateNumber', filters.plateNumber);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.centerId) queryParams.append('centerId', filters.centerId);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters.inspectorId) queryParams.append('inspectorId', filters.inspectorId);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const url = `${API_BASE_URL}/inspections?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inspections: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inspections:', error);
    throw error;
  }
};

/**
 * Fetch machine results for an inspection
 */
export const getMachineResults = async (inspectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/machine-results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch machine results: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching machine results:', error);
    throw error;
  }
};

/**
 * Fetch visual results for an inspection
 */
export const getVisualResults = async (inspectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/visual-results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch visual results: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching visual results:', error);
    throw error;
  }
};

/**
 * Fetch photos for an inspection
 */
export const getInspectionPhotos = async (inspectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/photos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch photos: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

/**
 * Get photo URL (for displaying)
 */
export const getPhotoUrl = (inspectionId, photoId) => {
  return `${API_BASE_URL}/inspections/${inspectionId}/photos/${photoId}`;
};

/**
 * Sync endpoint (receives data from client)
 * This would typically be handled by the backend, but we'll create a mock handler
 */
export const syncInspection = async (inspectionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inspections/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inspectionData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to sync inspection: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error syncing inspection:', error);
    throw error;
  }
};











