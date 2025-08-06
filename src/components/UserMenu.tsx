'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="position-relative">
      <button
        className="btn btn-link text-white p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User size={20} />
      </button>
      
      {isOpen && (
        <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-sm" style={{ minWidth: '200px', zIndex: 1000 }}>
          <div className="p-3 border-bottom">
            <div className="fw-bold">{user.name || user.email}</div>
            <small className="text-muted">{user.email}</small>
          </div>
          <div className="p-2">
            <a
              href="/api/auth/logout"
              className="btn btn-outline-danger btn-sm w-100"
            >
              <LogOut size={16} className="me-2" />
              Sign Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 