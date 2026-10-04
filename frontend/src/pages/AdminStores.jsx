import React from 'react';
import { useMemo, useState } from 'react';
import { Building2, Plus, Search, Star, Store } from 'lucide-react';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { stores, users } from '../data/mockData';
import { emailRegex, validateAddress, validateName } from '../utils/validators';

const pageSize = 8;

export default function AdminStores() {
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [errors, setErrors] = useState({});

  const owners = users.filter((user) => user.role === 'OWNER');

  const filteredStores = useMemo(() => {
    const query = Object.entries(filters).reduce((result, [key, value]) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return result;
      result[key] = normalized;
      return result;
    }, {});

    const rows = stores.filter((store) => {
      const matchesName = !query.name || store.name.toLowerCase().includes(query.name);
      const matchesEmail = !query.email || store.email.toLowerCase().includes(query.email);
      const matchesAddress = !query.address || store.address.toLowerCase().includes(query.address);
      return matchesName && matchesEmail && matchesAddress;
    });

    rows.sort((a, b) => {
      const left = String(a[sortField] || '').toLowerCase();
      const right = String(b[sortField] || '').toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return rows.map((store) => ({
      ...store,
      rating: Number((store.rating ?? 0).toFixed(1)),
    }));
  }, [filters, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(filteredStores.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filteredStores.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const validateForm = () => {
    const nextErrors = {
      name: !form.name ? 'Store name is required' : !validateName(form.name) ? 'Name must be 6–60 chars' : '',
      email: !form.email ? 'Email is required' : !emailRegex.test(form.email) ? 'Email is invalid' : '',
      address: !form.address ? 'Address is required' : !validateAddress(form.address) ? 'Address must be 1–400 chars' : '',
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSort = (field) => {
    setPage(1);
    setSortField(field);
    setSortDirection((current) => (sortField === field && current === 'asc' ? 'desc' : 'asc'));
  };

  const submitNewStore = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    stores.unshift({
      id: Date.now(),
      name: form.name,
      email: form.email,
      address: form.address,
      ownerId: form.ownerId ? Number(form.ownerId) : null,
      rating: 4.5,
    });
    setIsAddModalOpen(false);
    setForm({ name: '', email: '', address: '', ownerId: '' });
    setToast('Store added successfully');
    setPage(1);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, active: sortField === 'name', direction: sortDirection, onSort: () => handleSort('name') },
    { key: 'email', label: 'Email', sortable: true, active: sortField === 'email', direction: sortDirection, onSort: () => handleSort('email') },
    { key: 'address', label: 'Address', sortable: true, active: sortField === 'address', direction: sortDirection, onSort: () => handleSort('address') },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      active: sortField === 'rating',
      direction: sortDirection,
      onSort: () => handleSort('rating'),
      render: (row) => (
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-1 text-xs text-teal-200">
          <Star className="h-3 w-3 fill-current" /> {row.rating}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-300">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Stores</h1>
        </div>

        <button type="button" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-2.5 font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Add Store
        </button>
      </div>

      <GlassCard className="p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={filters.name}
            onChange={(event) => { setPage(1); setFilters((current) => ({ ...current, name: event.target.value })); }}
            placeholder="Name"
            className="rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <input
            value={filters.email}
            onChange={(event) => { setPage(1); setFilters((current) => ({ ...current, email: event.target.value })); }}
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <input
            value={filters.address}
            onChange={(event) => { setPage(1); setFilters((current) => ({ ...current, address: event.target.value })); }}
            placeholder="Address"
            className="rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 hover:bg-white/10">
            <Search className="h-4 w-4" /> Search
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <DataTable columns={columns} rows={rows} emptyText="No stores found" />
      </GlassCard>

      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Showing {rows.length} of {filteredStores.length}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Prev</button>
          <span>{currentPage} / {totalPages}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </div>
      </div>

      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add store" size="lg">
        <form className="space-y-4" onSubmit={submitNewStore} noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Store name" name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} error={errors.name} placeholder="Store name" />
            <FormField label="Email" name="email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} error={errors.email} placeholder="store@example.com" />
          </div>
          <FormField label="Address" name="address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} error={errors.address} placeholder="Street, city" textarea rows={3} />
          <label className="block text-sm text-slate-200">
            <span className="mb-2 inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> Owner</span>
            <select
              value={form.ownerId}
              onChange={(event) => setForm((current) => ({ ...current, ownerId: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">No owner assigned</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>{owner.name}</option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-200">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-2.5 font-semibold text-slate-950">Save store</button>
          </div>
        </form>
      </Modal>

      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast('')} />
    </div>
  );
}
