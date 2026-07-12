import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import {
  RiCalendarLine, RiCheckLine, RiTimeLine, RiAddLine, RiListUnordered,
  RiGroupLine, RiDeleteBinLine, RiEyeLine,
  RiShieldLine, RiCloseCircleLine, RiArrowUpLine, RiArrowDownLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import { adminAPI, type AdminStatsResponse } from '../services/api';
import type { User } from '../types';

const PIE_COLORS = ['#FBBF24', '#10B981', '#F87171'];

export default function DashboardPage() {
  const { user, updateUserRole, updateUserStatus, getAllUsers } = useAuth();
  const { getMyEvents, events, fetchAllEvents, updateEventStatus } = useEvents();
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);

  const isAdmin = user?.role === 'admin';

  const activeTab = (() => {
    const path = location.pathname;
    if (path.includes('/manage-events')) return 'manage-events';
    if (path.includes('/manage-users')) return 'manage-users';
    return 'overview';
  })();

  if (!isAdmin && activeTab !== 'overview') {
    return <Navigate to="/forbidden" replace />;
  }

  const setActiveTab = (tab: string) => {
    if (tab === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${tab}`);
  };

  // User stats
  const myEvents = getMyEvents(user!.id);
  const myApproved = myEvents.filter((e) => e.status === 'approved').length;
  const myPending = myEvents.filter((e) => e.status === 'pending').length;
  const myRejected = myEvents.filter((e) => e.status === 'rejected').length;
  const myRecent = [...myEvents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Admin stats
  const allEvents = events;
  const pendingEvents = allEvents.filter((e) => e.status === 'pending');
  const approvedEvents = allEvents.filter((e) => e.status === 'approved');
  const rejectedEvents = allEvents.filter((e) => e.status === 'rejected');

  const statusData = [
    { name: 'Pending', value: pendingEvents.length },
    { name: 'Approved', value: approvedEvents.length },
    { name: 'Rejected', value: rejectedEvents.length },
  ];

  const refreshUsers = useCallback(async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch {
      toast.error('Failed to load users.');
    }
  }, [getAllUsers]);

  const refreshStats = useCallback(async () => {
    try {
      const s = await adminAPI.getStats();
      setStats(s);
    } catch {}
  }, []);

  useEffect(() => {
    if (isAdmin) {
      refreshUsers();
      refreshStats();
      fetchAllEvents();
    }
  }, [isAdmin, refreshUsers, refreshStats, fetchAllEvents]);

  const handleRoleChange = async (userId: string, name: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const result = await Swal.fire({
      title: `${newRole === 'admin' ? 'Promote' : 'Demote'} User?`,
      html: `<p style="color:rgba(240,238,255,0.55);font-size:0.9rem">Change <strong style="color:#f0eeff">${name}</strong>'s role to <strong style="color:#F9A8D4">${newRole}</strong>?</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change role',
      background: '#111118', color: '#f0eeff', confirmButtonColor: '#EC4899', cancelButtonColor: 'rgba(255,255,255,0.08)',
    });
    if (result.isConfirmed) {
      try {
        await updateUserRole(userId, newRole as 'user' | 'admin');
        refreshUsers();
        toast.success(`${name} is now a ${newRole}.`);
      } catch {
        toast.error('Failed to update role.');
      }
    }
  };

  const handleStatusChange = async (userId: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const result = await Swal.fire({
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} User?`,
      html: `<p style="color:rgba(240,238,255,0.55);font-size:0.9rem">${newStatus === 'suspended' ? 'This will prevent' : 'This will restore'} <strong style="color:#f0eeff">${name}</strong>'s access.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus === 'suspended' ? 'suspend' : 'activate'}`,
      background: '#111118', color: '#f0eeff', confirmButtonColor: newStatus === 'suspended' ? '#F43F5E' : '#10B981', cancelButtonColor: 'rgba(255,255,255,0.08)',
    });
    if (result.isConfirmed) {
      try {
        await updateUserStatus(userId, newStatus as 'active' | 'suspended');
        refreshUsers();
        toast.success(`${name}'s account has been ${newStatus}.`);
      } catch {
        toast.error('Failed to update status.');
      }
    }
  };

  const handleApprove = async (id: string, title: string) => {
    const r = await Swal.fire({ title: 'Approve Event?', text: `"${title}" will become publicly visible.`, icon: 'question', showCancelButton: true, confirmButtonText: 'Approve', background: '#111118', color: '#f0eeff', confirmButtonColor: '#10B981', cancelButtonColor: 'rgba(255,255,255,0.08)' });
    if (r.isConfirmed) { await updateEventStatus(id, 'approved'); toast.success('Event approved and published!'); }
  };

  const handleReject = async (id: string, title: string) => {
    const r = await Swal.fire({ title: 'Reject Event?', text: `"${title}" will be hidden from public.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Reject', background: '#111118', color: '#f0eeff', confirmButtonColor: '#F43F5E', cancelButtonColor: 'rgba(255,255,255,0.08)' });
    if (r.isConfirmed) { await updateEventStatus(id, 'rejected'); toast.success('Event rejected.'); }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    const r = await Swal.fire({ title: 'Delete Event?', text: `Permanently delete "${title}"?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', background: '#111118', color: '#f0eeff', confirmButtonColor: '#F43F5E', cancelButtonColor: 'rgba(255,255,255,0.08)' });
    if (r.isConfirmed) {
      try {
        await adminAPI.deleteEvent(id);
        fetchAllEvents();
        toast.success('Event deleted.');
      } catch {
        toast.error('Failed to delete event.');
      }
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected', active: 'badge-approved', suspended: 'badge-rejected' };
    return <span className={`badge ${map[status] ?? ''}`}>{status}</span>;
  };

  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; } };

  const tabs = isAdmin
    ? [{ id: 'overview', label: 'Overview' }, { id: 'manage-events', label: 'Manage Events' }, { id: 'manage-users', label: 'Manage Users' }]
    : [{ id: 'overview', label: 'Overview' }];

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="section-tag">{isAdmin ? '⚡ Admin Dashboard' : 'My Dashboard'}</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Welcome back, {user!.name.split(' ')[0]}
        </h1>
      </div>

      {/* Tabs */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '0.3rem', width: 'fit-content' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                background: activeTab === tab.id ? 'rgba(236,72,153,0.15)' : 'transparent',
                color: activeTab === tab.id ? '#F9A8D4' : 'rgba(240,238,255,0.5)',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {(isAdmin ? [
              { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: <RiGroupLine />, color: '#EC4899' },
              { label: 'Total Events', value: stats?.totalEvents ?? allEvents.length, icon: <RiCalendarLine />, color: '#8B5CF6' },
              { label: 'Pending Events', value: stats?.pendingEvents ?? pendingEvents.length, icon: <RiTimeLine />, color: '#FBBF24' },
              { label: 'Approved Events', value: stats?.approvedEvents ?? approvedEvents.length, icon: <RiCheckLine />, color: '#10B981' },
            ] : [
              { label: 'Total Events', value: myEvents.length, icon: <RiCalendarLine />, color: '#EC4899' },
              { label: 'Approved', value: myApproved, icon: <RiCheckLine />, color: '#10B981' },
              { label: 'Pending', value: myPending, icon: <RiTimeLine />, color: '#FBBF24' },
              { label: 'Rejected', value: myRejected, icon: <RiCloseCircleLine />, color: '#F87171' },
            ]).map((s) => (
              <div key={s.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.625rem', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin charts */}
          {isAdmin && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.8rem', fontFamily: 'DM Mono', color: 'rgba(240,238,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Events by Status</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f0eeff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {statusData.map((s, i) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PIE_COLORS[i] }} />
                      <span style={{ color: 'rgba(240,238,255,0.5)' }}>{s.name} ({s.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.8rem', fontFamily: 'DM Mono', color: 'rgba(240,238,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Events by Category</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={(stats?.eventsByCategory || []).slice(0, 5)} margin={{ left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="category" tick={{ fill: 'rgba(240,238,255,0.35)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(240,238,255,0.35)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f0eeff' }} />
                    <Bar dataKey="count" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent events table */}
          <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Events</h3>
              <Link to="/my-events" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>View all</Link>
            </div>
            {myRecent.length === 0 ? (
              <p style={{ color: 'rgba(240,238,255,0.3)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No events created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {myRecent.map((e) => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.025)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <img src={e.bannerImage} alt={e.title} style={{ width: '44px', height: '34px', borderRadius: '0.375rem', objectFit: 'cover', flexShrink: 0, background: '#1a1a24' }} onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.35)' }}>{formatDate(e.eventDate)}</div>
                    </div>
                    {statusBadge(e.status)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/add-event" className="btn-primary" style={{ fontSize: '0.875rem' }}><RiAddLine /> Add New Event</Link>
            <Link to="/my-events" className="btn-secondary" style={{ fontSize: '0.875rem' }}><RiListUnordered /> View My Events</Link>
          </div>
        </div>
      )}

      {/* MANAGE EVENTS TAB (admin) */}
      {activeTab === 'manage-events' && isAdmin && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>All Events ({allEvents.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr>
                  {['Event', 'Organizer', 'Category', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '0 0.875rem 0.75rem', fontSize: '0.72rem', fontFamily: 'DM Mono', fontWeight: 500, color: 'rgba(240,238,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allEvents.map((ev) => (
                  <tr key={ev.id}>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.625rem', margin: '0 0 0.375rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                          <img src={ev.bannerImage} alt="" style={{ width: '46px', height: '34px', borderRadius: '0.25rem', objectFit: 'cover', flexShrink: 0, background: '#1a1a24' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.45)' }}>{ev.organizerName}</span>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.45)' }}>{ev.category}</span>
                        <div>{statusBadge(ev.status)}</div>
                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                          <Link to={`/events/${ev.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.625rem', borderRadius: '0.375rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#C4B5FD', fontSize: '0.72rem', textDecoration: 'none' }}><RiEyeLine /></Link>
                          {ev.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(ev.id, ev.title)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.625rem', borderRadius: '0.375rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}><RiCheckLine /> Approve</button>
                              <button onClick={() => handleReject(ev.id, ev.title)} style={{ display: 'flex', alignItems: 'center', padding: '0.35rem 0.625rem', borderRadius: '0.375rem', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#FDA4AF', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>Reject</button>
                            </>
                          )}
                          {ev.status === 'rejected' && <button onClick={() => handleApprove(ev.id, ev.title)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.625rem', borderRadius: '0.375rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}><RiCheckLine /> Approve</button>}
                          <button onClick={() => handleDeleteEvent(ev.id, ev.title)} style={{ display: 'flex', alignItems: 'center', padding: '0.35rem 0.6rem', borderRadius: '0.375rem', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', color: '#FDA4AF', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}><RiDeleteBinLine /></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MANAGE USERS TAB (admin) */}
      {activeTab === 'manage-users' && isAdmin && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Registered Users ({users.length})</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {users.map((u) => (
              <div key={u.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <img src={u.image} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#1a1a24' }} onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=EC4899&color=fff`; }} />
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.35)' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'DM Mono', padding: '0.2rem 0.6rem', borderRadius: '999px', background: u.role === 'admin' ? 'rgba(236,72,153,0.12)' : 'rgba(139,92,246,0.12)', color: u.role === 'admin' ? '#F9A8D4' : '#C4B5FD', border: `1px solid ${u.role === 'admin' ? 'rgba(236,72,153,0.2)' : 'rgba(139,92,246,0.2)'}` }}>{u.role}</span>
                  {statusBadge(u.status)}
                </div>
                {u.id !== user!.id && (
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => handleRoleChange(u.id, u.name, u.role)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: '0.375rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#C4B5FD', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {u.role === 'admin' ? <><RiArrowDownLine /> Demote</> : <><RiArrowUpLine /> Promote</>}
                    </button>
                    <button onClick={() => handleStatusChange(u.id, u.name, u.status)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: '0.375rem', background: u.status === 'active' ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${u.status === 'active' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}`, color: u.status === 'active' ? '#FDA4AF' : '#6EE7B7', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {u.status === 'active' ? <><RiCloseCircleLine /> Suspend</> : <><RiShieldLine /> Activate</>}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
