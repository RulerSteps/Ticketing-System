import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../data/mockTickets';

export default function AssignedTicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    setTickets(getTickets());
  }, []);

  return (
    <div className="assigned-tickets-page" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '24px', color: '#333' }}>Tickets Assignés</h1>
        <p style={{ color: '#666' }}>Voici la liste des tickets qui vous sont actuellement assignés.</p>
      </header>

      <div className="ticket-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tickets.length === 0 ? (
          <p>Aucun ticket assigné.</p>
        ) : (
          tickets.map(ticket => (
            <Link 
              key={ticket.id} 
              to={`/tickets/${ticket.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div 
                className="ticket-card" 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#0056b3' }}>{ticket.title}</h3>
                  <span 
                    className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: ticket.status === 'Nouveau' ? '#e3f2fd' : 
                                      ticket.status === 'En cours' ? '#fff3e0' : 
                                      ticket.status === 'Résolu' ? '#e8f5e9' : '#f5f5f5',
                      color: ticket.status === 'Nouveau' ? '#1565c0' : 
                             ticket.status === 'En cours' ? '#e65100' : 
                             ticket.status === 'Résolu' ? '#2e7d32' : '#616161',
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#555', fontSize: '14px' }}>
                  {ticket.description.substring(0, 100)}...
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888' }}>
                  <span><strong>Priorité:</strong> {ticket.priority}</span>
                  <span><strong>Créateur:</strong> {ticket.creator}</span>
                  <span><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
