import { create } from 'zustand';

const useDataStore = create((set, get) => ({
  datasets: [],
  activeDatasetId: null,

  // Add a new dataset
  addDataset: (dataset) => {
    const newDataset = {
      id: dataset.id || Math.random().toString(36).substr(2, 9),
      name: dataset.name,
      columns: dataset.columns || [],
      rowCount: dataset.rowCount || 0,
      tableName: dataset.tableName || `table_${Date.now()}`,
      data: dataset.data || [],
      fileType: dataset.fileType || 'csv',
      uploadedAt: dataset.uploadedAt || new Date().toISOString()
    };

    set((state) => ({
      datasets: [...state.datasets, newDataset],
      activeDatasetId: newDataset.id
    }));

    return newDataset.id;
  },

  // Remove a dataset
  removeDataset: (id) => {
    set((state) => {
      const newDatasets = state.datasets.filter(d => d.id !== id);
      const newActiveId = state.activeDatasetId === id 
        ? (newDatasets.length > 0 ? newDatasets[0].id : null)
        : state.activeDatasetId;
      
      return {
        datasets: newDatasets,
        activeDatasetId: newActiveId
      };
    });
  },

  // Set active dataset
  setActiveDataset: (id) => {
    set({ activeDatasetId: id });
  },

  // Get active dataset
  getActiveDataset: () => {
    const state = get();
    return state.datasets.find(d => d.id === state.activeDatasetId) || null;
  },

  // Get dataset by ID
  getDataset: (id) => {
    return get().datasets.find(d => d.id === id) || null;
  },

  // Update dataset
  updateDataset: (id, updates) => {
    set((state) => ({
      datasets: state.datasets.map(d => 
        d.id === id ? { ...d, ...updates } : d
      )
    }));
  },

  // Clear all datasets
  clearAll: () => {
    set({ datasets: [], activeDatasetId: null });
  }
}));

export default useDataStore;
