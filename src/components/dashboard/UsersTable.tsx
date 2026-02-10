import { useState } from "react";

interface User {
    id: string;
    username: string;
    avatar: string | null;
    role: string;
}

interface Props {
    initialUsers: User[];
}

export default function UsersTable({ initialUsers }: Props) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateRole = async (newRole: string) => {
        if (!selectedUser) return;
        
        setIsUpdating(true);
        try {
            const response = await fetch("/api/users/update-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.id, role: newRole })
            });

            if (response.ok) {
                setUsers(users.map(u => 
                    u.id === selectedUser.id ? { ...u, role: newRole } : u
                ));
                setSelectedUser(null);
            } else {
                alert("Failed to update role");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating role");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="users-table-wrapper">
            <div className="users-table-island">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>ID</th>
                            <th>Role</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="avatar-cell">
                                    <img src={u.avatar || ''} alt={u.username} className="user-avatar-table" referrerPolicy="no-referrer" />
                                </td>
                                <td className="username-cell">
                                    <strong>{u.username}</strong>
                                </td>
                                <td className="id-cell">
                                    <code>{u.id}</code>
                                </td>
                                <td className="role-cell">
                                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                                </td>
                                <td className="actions-cell text-right">
                                    <button 
                                        className="btn-icon" 
                                        title="Change Role"
                                        onClick={() => setSelectedUser(u)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Update User Role</h3>
                            <button className="close-btn" onClick={() => setSelectedUser(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="user-preview">
                                <img src={selectedUser.avatar || ''} alt="" className="avatar-preview" referrerPolicy="no-referrer" />
                                <div className="user-preview-text">
                                    <strong>{selectedUser.username}</strong>
                                    <span>{selectedUser.id}</span>
                                </div>
                            </div>
                            
                            <div className="role-options">
                                <p className="label">Select new role:</p>
                                <div className="role-grid">
                                    <button 
                                        className={`role-opt user ${selectedUser.role === 'user' ? 'active' : ''}`}
                                        onClick={() => handleUpdateRole('user')}
                                        disabled={isUpdating}
                                    >
                                        <strong>User</strong>
                                        <span>Standard access</span>
                                    </button>
                                    <button 
                                        className={`role-opt admin ${selectedUser.role === 'admin' ? 'active' : ''}`}
                                        onClick={() => handleUpdateRole('admin')}
                                        disabled={isUpdating}
                                    >
                                        <strong>Admin</strong>
                                        <span>Full dashboard access</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {isUpdating && <div className="updating-loader">Updating...</div>}
                    </div>
                </div>
            )}

            <style>{`
                .users-table-island {
                    background: #1e1e1e;
                    border: 1px solid #333;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                }
                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .users-table thead th {
                    padding: 1rem;
                    background: #000;
                    color: #888;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 700;
                    border-bottom: 2px solid #333;
                }
                .users-table tbody tr {
                    border-bottom: 1px solid #222;
                    background: #161616;
                    transition: background 0.2s;
                }
                .users-table tbody tr:hover {
                    background: #222;
                }
                .users-table td {
                    padding: 0.75rem 1rem;
                    vertical-align: middle;
                    color: #ccc;
                    font-size: 0.9rem;
                }
                .user-avatar-table {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid #444;
                    object-fit: cover;
                }
                .role-badge {
                    display: inline-block;
                    padding: 0.2rem 0.6rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .role-badge.admin {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                .role-badge.user {
                    background: rgba(255, 255, 255, 0.05);
                    color: #888;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .btn-icon {
                    background: none;
                    border: none;
                    color: #555;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .btn-icon:hover {
                    background: #333;
                    color: #fff;
                }
                .text-right { text-align: right; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: #1e1e1e;
                    border: 1px solid #333;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 450px;
                    padding: 1.5rem;
                    position: relative;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .modal-header h3 { margin: 0; color: #fff; }
                .close-btn {
                    background: none; border: none; color: #666; font-size: 1.5rem; cursor: pointer;
                }
                .user-preview {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #141414;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                }
                .avatar-preview {
                    width: 48px; height: 48px; border-radius: 50%; border: 2px solid #3b82f6;
                }
                .user-preview-text {
                    display: flex; flex-direction: column;
                }
                .user-preview-text strong { color: #fff; }
                .user-preview-text span { color: #666; font-size: 0.8rem; font-family: monospace; }

                .role-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;
                }
                .role-opt {
                    display: flex; flex-direction: column; text-align: left; padding: 1rem;
                    background: #0a0a0a; border: 1px solid #333; border-radius: 8px; cursor: pointer;
                    transition: all 0.2s;
                }
                .role-opt:hover:not(:disabled) { border-color: #444; background: #111; }
                .role-opt.active { border-color: #3b82f6; background: #3b82f61a; }
                .role-opt strong { color: #eee; margin-bottom: 0.25rem; font-size: 0.9rem; }
                .role-opt span { color: #666; font-size: 0.75rem; }
                .role-opt.active strong { color: #3b82f6; }

                .updating-loader {
                    margin-top: 1rem; text-align: center; font-size: 0.8rem; color: #3b82f6; font-weight: 600;
                }
            `}</style>
        </div>
    );
}
