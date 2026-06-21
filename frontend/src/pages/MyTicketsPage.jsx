import { useCallback } from "react";
import TicketList from "../components/tickets/TicketList";
import { useAuth } from "../context/AuthContext";

export default function MyTicketsPage() {
  const { user } = useAuth();
  
  const filterUserTickets = useCallback(
    (t) => t.auteur === user?.nom,
    [user?.nom]
  );
  
  // Dans le mock, on compare avec le nom de l'utilisateur. 
  // Dans une vraie application, on comparerait les IDs.
  return (
    <TicketList 
      title="Mes tickets" 
      showCreateButton={true} 
      filterTickets={filterUserTickets}
    />
  );
}
