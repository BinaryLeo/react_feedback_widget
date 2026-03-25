// Presentation ViewModel Hook
// Manages UI state and orchestrates use cases
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import type { Feedback } from '../../domain/entities/Feedback';
import type { DashboardStats } from '../../domain/entities/DashboardStats';
import type { Status, FeedbackType } from '../../types';
import type { Language } from '../../i18n';
import {
  getDashboardDataUseCase,
  updateFeedbackStatusUseCase,
  updateFeedbackTypeUseCase,
  filterFeedbacksUseCase,
} from '../../container';

export type TabType = 'stats' | 'feedbacks';
export type StatusFilter = 'ALL' | Status;

export interface DashboardViewModelState {
  // Data
  stats: DashboardStats | null;
  feedbacks: Feedback[];
  filteredFeedbacks: Feedback[];
  selectedFeedback: Feedback | null;
  
  // UI State
  activeTab: TabType;
  statusFilter: StatusFilter;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  showStatusModal: boolean;
  showFilterModal: boolean;
  isUpdating: boolean;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setSelectedFeedback: (feedback: Feedback | null) => void;
  setShowStatusModal: (show: boolean) => void;
  setShowFilterModal: (show: boolean) => void;
  
  // Operations
  fetchData: (isRefresh?: boolean) => Promise<void>;
  handleRefresh: () => void;
  handleStatusUpdate: (newStatus: Status) => Promise<void>;
  handleTypeUpdate: (newType: FeedbackType) => Promise<void>;
  handleFeedbackPress: (feedback: Feedback) => void;
  
  // Computed
  totalFeedbacks: number;
  filteredCount: number;
}

export function useDashboardViewModel(lang: Language): DashboardViewModelState {
  // Data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch data
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getDashboardDataUseCase.execute();
      setStats(data.stats);
      setFeedbacks(data.feedbacks);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.message || 'Unable to connect to server. Make sure the backend is running on port 3333.');
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter feedbacks when filter or feedbacks change
  const filteredFeedbacks = useMemo(() => {
    const result = filterFeedbacksUseCase.execute(feedbacks, statusFilter);
    return result.filteredFeedbacks;
  }, [feedbacks, statusFilter]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Handle feedback press
  const handleFeedbackPress = useCallback((feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowStatusModal(true);
  }, []);

  // Handle status update
  const handleStatusUpdate = useCallback(async (newStatus: Status) => {
    if (!selectedFeedback || isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await updateFeedbackStatusUseCase.execute(selectedFeedback.id, newStatus);
      
      if (result.success && result.feedback && result.stats) {
        // Update local state
        setFeedbacks(prev => prev.map(f => 
          f.id === selectedFeedback.id ? result.feedback! : f
        ));
        setSelectedFeedback(result.feedback);
        setStats(result.stats);
      } else {
        Alert.alert('Error', result.error || 'Failed to update status');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  }, [selectedFeedback, isUpdating]);

  // Handle type update
  const handleTypeUpdate = useCallback(async (newType: FeedbackType) => {
    if (!selectedFeedback || isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await updateFeedbackTypeUseCase.execute(selectedFeedback.id, newType);
      
      if (result.success && result.feedback && result.stats) {
        // Update local state
        setFeedbacks(prev => prev.map(f => 
          f.id === selectedFeedback.id ? result.feedback! : f
        ));
        setSelectedFeedback(result.feedback);
        setStats(result.stats);
      } else {
        Alert.alert('Error', result.error || 'Failed to update type');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update type');
    } finally {
      setIsUpdating(false);
    }
  }, [selectedFeedback, isUpdating]);

  return {
    // Data
    stats,
    feedbacks,
    filteredFeedbacks,
    selectedFeedback,
    
    // UI State
    activeTab,
    statusFilter,
    isLoading,
    isRefreshing,
    error,
    showStatusModal,
    showFilterModal,
    isUpdating,
    
    // Actions
    setActiveTab,
    setStatusFilter,
    setSelectedFeedback,
    setShowStatusModal,
    setShowFilterModal,
    
    // Operations
    fetchData,
    handleRefresh,
    handleStatusUpdate,
    handleTypeUpdate,
    handleFeedbackPress,
    
    // Computed
    totalFeedbacks: feedbacks.length,
    filteredCount: filteredFeedbacks.length,
  };
}
