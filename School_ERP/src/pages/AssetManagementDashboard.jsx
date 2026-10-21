import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import assetService from '../api/assetService';

import AssetTabs from './asset/AssetTabs';
import AssetOverviewTab from './asset/AssetOverviewTab';
import AssetRegisterTab from './asset/AssetRegisterTab';
import AssetCategoriesTab from './asset/AssetCategoriesTab';
import AssetAllocationsTab from './asset/AssetAllocationsTab';
import AssetDepreciationTab from './asset/AssetDepreciationTab';
import AssetMaintenanceTab from './asset/AssetMaintenanceTab';
import AssetDisposalsTab from './asset/AssetDisposalsTab';
import AssetAuditsTab from './asset/AssetAuditsTab';
import AssetReportsTab from './asset/AssetReportsTab';
import AssetGuideTab from './asset/AssetGuideTab';

import {
  AssetFormModal,
  AssetDetailModal,
  CategoryModal,
  IssueAssetModal,
  ReturnAssetModal,
  LogMaintenanceModal,
  CompleteMaintenanceModal,
  DisposeAssetModal,
  RecordAuditModal
} from './asset/AssetModals';

export default function AssetManagementDashboard() {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Active Tab mapping
  const activeTab = (tab || 'dashboard').toLowerCase() === 'allocations' ? 'assignments' : (tab || 'dashboard').toLowerCase();

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [disposals, setDisposals] = useState([]);
  const [audits, setAudits] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Modal states
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returningAllocation, setReturningAllocation] = useState(null);

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isCompleteMaintenanceOpen, setIsCompleteMaintenanceOpen] = useState(false);
  const [completingMaintenance, setCompletingMaintenance] = useState(null);

  const [isDisposeModalOpen, setIsDisposeModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Fetch all live data
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [
        statsRes,
        assetsRes,
        catsRes,
        allocsRes,
        maintsRes,
        dispsRes,
        auditsRes,
        staffRes
      ] = await Promise.allSettled([
        assetService.getStats(),
        assetService.getAssets(),
        assetService.getCategories(),
        assetService.getAllocations(),
        assetService.getMaintenances(),
        assetService.getDisposals(),
        assetService.getAudits(),
        assetService.getStaff()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data || {});
      }
      if (assetsRes.status === 'fulfilled' && assetsRes.value?.success) {
        setAssets(assetsRes.value.data || []);
      }
      if (catsRes.status === 'fulfilled' && catsRes.value?.success) {
        setCategories(catsRes.value.data || []);
      }
      if (allocsRes.status === 'fulfilled' && allocsRes.value?.success) {
        setAllocations(allocsRes.value.data || []);
      }
      if (maintsRes.status === 'fulfilled' && maintsRes.value?.success) {
        setMaintenances(maintsRes.value.data || []);
      }
      if (dispsRes.status === 'fulfilled' && dispsRes.value?.success) {
        setDisposals(dispsRes.value.data || []);
      }
      if (auditsRes.status === 'fulfilled' && auditsRes.value?.success) {
        setAudits(auditsRes.value.data || []);
      }
      if (staffRes.status === 'fulfilled') {
        const staffData = staffRes.value?.data || staffRes.value || [];
        setStaffList(Array.isArray(staffData) ? staffData : staffData.data || []);
      }
    } catch (err) {
      console.error('Failed to load asset management data:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to synchronize live asset data from the school server.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigate Tab helper
  const handleNavigateTab = (tabName) => {
    navigate(`/asset-management/${tabName}`);
  };

  // Toast notification helper
  const showToast = (title, icon = 'success') => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2000
    });
  };

  // 1. Asset CRUD Handlers
  const handleOpenRegister = () => {
    setEditingAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleOpenEditAsset = (asset) => {
    setEditingAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleViewAsset = (asset) => {
    setViewingAsset(asset);
    setIsDetailModalOpen(true);
  };

  const handleSaveAsset = async (assetData) => {
    try {
      if (editingAsset) {
        await assetService.updateAsset(editingAsset._id, assetData);
        showToast('Asset updated successfully');
      } else {
        await assetService.addAsset(assetData);
        showToast('New asset registered successfully');
      }
      fetchData(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save asset';
      Swal.fire('Error', msg, 'error');
      throw error;
    }
  };

  const handleDeleteAsset = (asset) => {
    if (asset.status === 'Assigned') {
      Swal.fire('Action Blocked', 'Cannot delete an asset that is currently assigned to staff. Return it first.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Delete Asset?',
      html: `Are you sure you want to delete <strong>${asset.assetName}</strong> (${asset.assetCode})? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete Asset'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await assetService.deleteAsset(asset._id);
          showToast('Asset deleted successfully');
          fetchData(true);
        } catch (error) {
          Swal.fire('Delete Failed', error.response?.data?.message || 'Server error deleting asset', 'error');
        }
      }
    });
  };

  // 2. Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (catData) => {
    try {
      if (editingCategory) {
        await assetService.updateCategory(editingCategory._id, catData);
        showToast('Category updated');
      } else {
        await assetService.addCategory(catData);
        showToast('New category added');
      }
      fetchData(true);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to save category', 'error');
      throw error;
    }
  };

  const handleDeleteCategory = (cat) => {
    Swal.fire({
      title: 'Delete Category?',
      text: `Delete classification "${cat.name}"? Only categories with 0 assets can be deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await assetService.deleteCategory(cat._id);
          showToast('Category removed');
          fetchData(true);
        } catch (error) {
          Swal.fire('Action Blocked', error.response?.data?.message || 'Could not delete category', 'error');
        }
      }
    });
  };

  // 3. Allocation Handlers
  const handleOpenIssue = () => {
    setIsIssueModalOpen(true);
  };

  const handleIssueAsset = async (issueData) => {
    try {
      await assetService.issueAsset(issueData);
      showToast('Asset successfully issued to staff');
      fetchData(true);
    } catch (error) {
      Swal.fire('Allocation Failed', error.response?.data?.message || 'Error issuing asset', 'error');
      throw error;
    }
  };

  const handleOpenReturn = (alloc) => {
    setReturningAllocation(alloc);
    setIsReturnModalOpen(true);
  };

  const handleReturnAsset = async (returnData) => {
    try {
      await assetService.returnAsset(returnData);
      showToast('Asset returned and restored to store inventory');
      fetchData(true);
    } catch (error) {
      Swal.fire('Return Failed', error.response?.data?.message || 'Error returning asset', 'error');
      throw error;
    }
  };

  // 4. Maintenance Handlers
  const handleOpenAddMaintenance = () => {
    setIsMaintenanceModalOpen(true);
  };

  const handleSaveMaintenance = async (maintData) => {
    try {
      await assetService.addMaintenance(maintData);
      showToast('Maintenance work order logged');
      fetchData(true);
    } catch (error) {
      Swal.fire('Failed', error.response?.data?.message || 'Could not log maintenance', 'error');
      throw error;
    }
  };

  const handleOpenCompleteMaintenance = (maint) => {
    setCompletingMaintenance(maint);
    setIsCompleteMaintenanceOpen(true);
  };

  const handleCompleteMaintenance = async (id, completeData) => {
    try {
      await assetService.completeMaintenance(id, completeData);
      showToast('Maintenance marked as completed');
      fetchData(true);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Could not close maintenance ticket', 'error');
      throw error;
    }
  };

  // 5. Disposal Handlers
  const handleOpenDispose = () => {
    setIsDisposeModalOpen(true);
  };

  const handleDisposeAsset = async (disposeData) => {
    try {
      await assetService.disposeAsset(disposeData);
      showToast('Asset retired and recorded in disposal ledger');
      fetchData(true);
    } catch (error) {
      Swal.fire('Disposal Error', error.response?.data?.message || 'Could not record disposal', 'error');
      throw error;
    }
  };

  // 6. Audit Handlers
  const handleOpenRecordAudit = () => {
    setIsAuditModalOpen(true);
  };

  const handleSaveAudit = async (auditData) => {
    try {
      await assetService.addAudit(auditData);
      showToast('Physical verification audit logged successfully');
      fetchData(true);
    } catch (error) {
      Swal.fire('Audit Error', error.response?.data?.message || 'Could not record audit', 'error');
      throw error;
    }
  };

  // Available in-store assets (unassigned & not under repair/disposed)
  const availableAssets = assets.filter((a) => a.status === 'Active' && a.available > 0);

  // Tab badge counts
  const tabCounts = {
    totalAssets: assets.length,
    categories: categories.length,
    allocations: allocations.filter((a) => a.status === 'Issued').length,
    inMaintenance: maintenances.filter((m) => m.status === 'In Progress').length,
    disposals: disposals.length,
    audits: audits.length
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] font-sans p-4 sm:p-6 pb-24">
      {/* Page Title & Breadcrumb */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fixed Asset Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional asset register, custody tracking, WDV depreciation engine & lifecycle audits
          </p>
        </div>
      </div>

      {/* Pill-Style Tabs */}
      <AssetTabs
        activeTab={activeTab}
        counts={tabCounts}
        onRefresh={() => fetchData(false)}
        loading={loading}
      />

      {/* Tab Content Renderer */}
      {activeTab === 'dashboard' && (
        <AssetOverviewTab
          stats={stats}
          onNavigateTab={handleNavigateTab}
          onOpenRegister={handleOpenRegister}
          onOpenIssue={handleOpenIssue}
          onOpenMaintenance={handleOpenAddMaintenance}
          onOpenCategory={handleOpenAddCategory}
        />
      )}

      {activeTab === 'register' && (
        <AssetRegisterTab
          assets={assets}
          categories={categories}
          onOpenRegister={handleOpenRegister}
          onOpenEdit={handleOpenEditAsset}
          onViewAsset={handleViewAsset}
          onDeleteAsset={handleDeleteAsset}
          loading={loading}
        />
      )}

      {activeTab === 'categories' && (
        <AssetCategoriesTab
          categories={categories}
          onOpenAddCategory={handleOpenAddCategory}
          onOpenEditCategory={handleOpenEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === 'assignments' && (
        <AssetAllocationsTab
          allocations={allocations}
          onOpenIssue={handleOpenIssue}
          onOpenReturn={handleOpenReturn}
        />
      )}

      {activeTab === 'depreciation' && (
        <AssetDepreciationTab
          assets={assets}
          categories={categories}
        />
      )}

      {activeTab === 'maintenance' && (
        <AssetMaintenanceTab
          maintenances={maintenances}
          onOpenAddMaintenance={handleOpenAddMaintenance}
          onOpenCompleteMaintenance={handleOpenCompleteMaintenance}
        />
      )}

      {activeTab === 'disposals' && (
        <AssetDisposalsTab
          disposals={disposals}
          onOpenDispose={handleOpenDispose}
        />
      )}

      {activeTab === 'audits' && (
        <AssetAuditsTab
          audits={audits}
          onOpenRecordAudit={handleOpenRecordAudit}
        />
      )}

      {activeTab === 'reports' && (
        <AssetReportsTab
          assets={assets}
          categories={categories}
          allocations={allocations}
          maintenances={maintenances}
          disposals={disposals}
        />
      )}

      {activeTab === 'guide' && (
        <AssetGuideTab />
      )}

      {/* MODALS */}
      <AssetFormModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSave={handleSaveAsset}
        asset={editingAsset}
        categories={categories}
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        asset={viewingAsset}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <IssueAssetModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssue={handleIssueAsset}
        availableAssets={availableAssets}
        staffList={staffList}
      />

      <ReturnAssetModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onReturn={handleReturnAsset}
        allocation={returningAllocation}
      />

      <LogMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onSave={handleSaveMaintenance}
        assets={assets.filter((a) => a.status !== 'Disposed')}
      />

      <CompleteMaintenanceModal
        isOpen={isCompleteMaintenanceOpen}
        onClose={() => setIsCompleteMaintenanceOpen(false)}
        onComplete={handleCompleteMaintenance}
        maintenance={completingMaintenance}
      />

      <DisposeAssetModal
        isOpen={isDisposeModalOpen}
        onClose={() => setIsDisposeModalOpen(false)}
        onDispose={handleDisposeAsset}
        assets={assets.filter((a) => a.status !== 'Disposed')}
      />

      <RecordAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSave={handleSaveAudit}
      />
    </div>
  );
}
