import React from 'react';
import { useMemo, useState } from 'react';
import { Eye, Plus, Search, ShieldCheck, UserCog } from 'lucide-react';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { users } from '../data/mockData';
import { emailRegex, validateAddress, validateName, validatePassword } from '../utils/validators';

const pageSize = 8;

const roleStyles = {
  ADMIN: 'bg-violet-500/15 text-violet-200 border-violet-400/30',
  USER: 'bg-teal-500/15 text-teal-200 border-teal-400/30',
  OWNER: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
};

export default function AdminUsers() {
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [errors, setErrors] = useState({});

  const filteredUsers = useMemo(() => {
    const query = Object.entries(filters).reduce((result, [key, value]) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return result;
      result[key] = normalized;
      return result;
    }, {});

    const rows = users.filter((user) => {
      const matchesName = !query.name || user.name.toLowerCase().includes(query.name);
      const matchesEmail = !query.email || user.email.toLowerCase().includes(query.email);
      const matchesAddress = !query.address || user.address.toLowerCase().includes(query.address);
      const matchesRole = !query.role || user.role === query.role;
      return matchesName && matchesEmail && matchesAddress && matchesRole;
    });

    rows.sort((a, b) => {
      const left = String(a[sortField] || '').toLowerCase();
      const right = String(b[sortField] || '').toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [filters, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    setPage(1);
    setSortField(field);
    setSortDirection((current) => (sortField === field && current === 'asc' ? 'desc' : 'asc'));
  };

  const validateForm = () => {
    const nextErrors = {
      name: !form.name ? 'Name is required' : !validateName(form.name) ? 'Name must be 6 to 60 characters' : '',
      email: !form.email ? 'Email is required' : !emailRegex.test(form.email) ? 'Email is invalid' : '',
      address: !form.address ? 'Address is required' : !validateAddress(form.address) ? 'Address must be 1 to 400 characters' : '',
      password: !form.password ? 'Password is required' : !validatePassword(form.password) ? 'Use 8–16 chars with uppercase and special char' : '',
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const submitNewUser = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      address: form.address,
      role: form.role,
      password: form.password,
    };

    users.unshift(newUser);
    setIsAddModalOpen(false);
    setForm({ name: '', email: '', password: '', address: '', role: 'USER' });
    setToast('User added successfully');
    setPage(1);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, active: sortField === 'name', direction: sortDirection, onSort: () => handleSort('name') },
    { key: 'email', label: 'Email', sortable: true, active: sortField === 'email', direction: sortDirection, onSort: () => handleSort('email') },
    { key: 'address', label: 'Address', sortable: true, active: sortField === 'address', direction: sortDirection, onSort: () => handleSort('address') },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      active: sortField === 'role',
      direction: sortDirection,
      onSort: () => handleSort('role'),
      render: (row) => (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleStyles[row.role]}`}>
          {row.role}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <button type="button" onClick={() => setSelectedUser(row)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-100 hover:bg-white/10">
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Management</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Users</h1>
        </div>

        <button type="button" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-2.5 font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      <GlassCard className="p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-5">
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
          <select
            value={filters.role}
            onChange={(event) => { setPage(1); setFilters((current) => ({ ...current, role: event.target.value })); }}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 hover:bg-white/10">
            <Search className="h-4 w-4" /> Search
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <DataTable columns={columns} rows={rows} emptyText="No users found" />
      </GlassCard>

      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Showing {rows.length} of {filteredUsers.length}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Prev</button>
          <span>{currentPage} / {totalPages}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </div>
      </div>

      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add user" size="lg">
        <form className="space-y-4" onSubmit={submitNewUser} noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} error={errors.name} placeholder="Full name" />
            <FormField label="Role" name="role" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} error={errors.role} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Email" name="email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} error={errors.email} placeholder="email@example.com" />
            <FormField label="Password" name="password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} error={errors.password} placeholder="Enter password" />
          </div>
          <FormField label="Address" name="address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} error={errors.address} placeholder="Street, city" textarea rows={3} />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-200">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-2.5 font-semibold text-slate-950">Save user</button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} title="User details" size="lg">
        {selectedUser && (
          <div className="space-y-4 text-sm text-slate-200">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/30 p-3">
              <div>
                <div className="text-slate-400">Name</div>
                <div className="mt-1 font-semibold text-white">{selectedUser.name}</div>
              </div>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleStyles[selectedUser.role]}`}>{selectedUser.role}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
                <div className="text-slate-400">Email</div>
                <div className="mt-1 text-white">{selectedUser.email}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
                <div className="text-slate-400">Store owner rating</div>
                <div className="mt-1 text-white">{selectedUser.role === 'OWNER' ? '4.8 / 5' : '—'}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
              <div className="text-slate-400">Address</div>
              <div className="mt-1 text-white">{selectedUser.address}</div>
            </div>
          </div>
        )}
      </Modal>

      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast('')} />
    </div>
  );
}
