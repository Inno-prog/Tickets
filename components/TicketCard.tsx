import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';

interface TicketCardProps {
  ticket: {
    id: string;
    date: string;
    time: string;
    queuePosition: number;
    status: string;
    estimatedWaitTime: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TicketCard({ ticket, onConfirm, onCancel }: TicketCardProps) {
  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>Ticket de paiement actif</Text>
        <View style={styles.ticketBadge}>
          <Text style={styles.ticketBadgeText}>{ticket.status}</Text>
        </View>
      </View>
      
      <View style={styles.ticketDetails}>
        <View style={styles.ticketDetail}>
          <Calendar color="#64748b" size={18} />
          <Text style={styles.ticketDetailText}>{ticket.date}</Text>
        </View>
        <View style={styles.ticketDetail}>
          <Clock color="#64748b" size={18} />
          <Text style={styles.ticketDetailText}>{ticket.time}</Text>
        </View>
      </View>
      
      <View style={styles.queueInfo}>
        <View style={styles.positionContainer}>
          <Text style={styles.positionLabel}>Position</Text>
          <Text style={styles.positionNumber}>{ticket.queuePosition}</Text>
        </View>
        <View style={styles.waitTimeContainer}>
          <Text style={styles.waitTimeLabel}>Temps d'attente</Text>
          <Text style={styles.waitTimeValue}>{ticket.estimatedWaitTime}</Text>
        </View>
      </View>
      
      <View style={styles.ticketActions}>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Je serai présent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Je ne pourrai pas venir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  ticketTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
  },
  ticketBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  ticketBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#1e40af',
  },
  ticketDetails: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ticketDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  ticketDetailText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
    marginLeft: 6,
  },
  queueInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  positionContainer: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  positionLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
  },
  positionNumber: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#2563eb',
    marginTop: 5,
  },
  waitTimeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  waitTimeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
  },
  waitTimeValue: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#0f172a',
    marginTop: 5,
  },
  ticketActions: {
    flexDirection: 'column',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ef4444',
  },
});