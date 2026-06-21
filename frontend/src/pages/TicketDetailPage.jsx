import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicketStatus, addTicketComment } from '../data/mockTickets';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const STATUS_OPTIONS = ['Nouveau', 'En cours', 'En attente', 'Résolu', 'Fermé'];

  useEffect(() => {
    const fetchedTicket = getTicketById(id);
    if (fetchedTicket) {
      setTicket(fetchedTicket);
    } else {
      // If ticket not found, we could redirect or show error
    }
  }, [id]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const updatedTicket = updateTicketStatus(id, newStatus);
    if (updatedTicket) {
      setTicket({ ...updatedTicket });
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const updatedTicket = addTicketComment(id, commentText);
    if (updatedTicket) {
      setTicket({ ...updatedTicket });
      setCommentText(''); // Clear input
    }
  };

  if (!ticket) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Chargement du ticket...</div>;
  }

  return (
    <div className="ticket-detail-page" style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/assigned')}
        style={{ marginBottom: '16px', padding: '8px 16px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9' }}
      >
        &larr; Retour aux tickets
      </button>

      <div className="ticket-header" style={{ borderBottom: '2px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 12px 0', color: '#333' }}>{ticket.title} <span style={{ color: '#888', fontSize: '18px' }}>#{ticket.id}</span></h1>
        
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="status-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="status" style={{ fontWeight: 'bold', color: '#555' }}>Statut :</label>
            <select 
              id="status" 
              value={ticket.status} 
              onChange={handleStatusChange}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: '14px', color: '#666' }}><strong>Priorité:</strong> {ticket.priority}</span>
          <span style={{ fontSize: '14px', color: '#666' }}><strong>Créateur:</strong> {ticket.creator}</span>
          <span style={{ fontSize: '14px', color: '#666' }}><strong>Créé le:</strong> {new Date(ticket.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="ticket-description" style={{ backgroundColor: '#f5f7fa', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Description</h3>
        <p style={{ whiteSpace: 'pre-wrap', color: '#444', lineHeight: '1.5' }}>{ticket.description}</p>
      </div>

      <div className="ticket-history-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ margin: 0, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Historique et Commentaires</h3>
        
        <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {ticket.history.map((entry) => (
            <div 
              key={entry.id} 
              className={`history-entry type-${entry.type}`}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: entry.type === 'comment' ? '1px solid #bbdefb' : '1px solid #eee',
                backgroundColor: entry.type === 'comment' ? '#e3f2fd' : '#fff',
                marginLeft: entry.type === 'system' ? '20px' : '0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                <strong>{entry.author}</strong>
                <span>{new Date(entry.date).toLocaleString()}</span>
              </div>
              <div style={{ color: '#333' }}>
                {entry.type === 'system' ? (
                  <i>{entry.action}</i>
                ) : (
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{entry.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="comment-form" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="commentText" style={{ fontWeight: 'bold' }}>Ajouter un commentaire :</label>
          <textarea
            id="commentText"
            rows="4"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tapez votre message ici..."
            style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
          <button 
            type="submit" 
            disabled={!commentText.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: commentText.trim() ? '#0056b3' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: commentText.trim() ? 'pointer' : 'not-allowed',
              alignSelf: 'flex-end',
              fontWeight: 'bold'
            }}
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
