import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, CircleAlert as AlertCircle, Ticket, Zap, Droplet } from 'lucide-react-native';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching data
    loadData();
  }, []);

  const loadData = () => {
    // Mock active ticket data
    const ticket = {
      id: 'TK-12345',
      date: '15 Juin 2023',
      time: '10:30',
      queuePosition: 5,
      status: 'En attente',
      estimatedWaitTime: '25 min',
    };
    
    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        title: 'Paiement va commencer',
        message: 'Les paiements commenceront dans 10 minutes à l\'agence centrale',
        time: '09:20',
        read: false,
      },
      {
        id: 2,
        title: 'Facture disponible',
        message: 'Votre facture de Mai 2023 est disponible',
        time: 'Hier',
        read: true,
      }
    ];
    
    setActiveTicket(ticket);
    setNotifications(mockNotifications);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1500);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
      }
    >
      <LinearGradient
        colors={['#1e40af', '#3b82f6']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(700)}>
          <Text style={styles.welcome}>Bienvenue</Text>
          <Text style={styles.userName}>Amadou Diallo</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.quickActions}
          entering={FadeInUp.delay(300).duration(700)}
        >
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ticket color="#1e40af" size={22} />
            </View>
            <Text style={styles.actionText}>Nouveau ticket</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Zap color="#1e40af" size={22} />
            </View>
            <Text style={styles.actionText}>Électricité</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Droplet color="#1e40af" size={22} />
            </View>
            <Text style={styles.actionText}>Eau</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
      
      <View style={styles.content}>
        {activeTicket ? (
          <Animated.View 
            style={styles.ticketCard}
            entering={FadeInUp.delay(400).duration(700)}
          >
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>Ticket de paiement actif</Text>
              <View style={styles.ticketBadge}>
                <Text style={styles.ticketBadgeText}>{activeTicket.status}</Text>
              </View>
            </View>
            
            <View style={styles.ticketDetails}>
              <View style={styles.ticketDetail}>
                <Calendar color="#64748b" size={18} />
                <Text style={styles.ticketDetailText}>{activeTicket.date}</Text>
              </View>
              <View style={styles.ticketDetail}>
                <Clock color="#64748b" size={18} />
                <Text style={styles.ticketDetailText}>{activeTicket.time}</Text>
              </View>
            </View>
            
            <View style={styles.queueInfo}>
              <View style={styles.positionContainer}>
                <Text style={styles.positionLabel}>Position</Text>
                <Text style={styles.positionNumber}>{activeTicket.queuePosition}</Text>
              </View>
              <View style={styles.waitTimeContainer}>
                <Text style={styles.waitTimeLabel}>Temps d'attente</Text>
                <Text style={styles.waitTimeValue}>{activeTicket.estimatedWaitTime}</Text>
              </View>
            </View>
            
            <View style={styles.ticketActions}>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Je serai présent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Je ne pourrai pas venir</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            style={styles.noTicketCard}
            entering={FadeInUp.delay(400).duration(700)}
          >
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg' }}
              style={styles.noTicketImage}
              resizeMode="contain"
            />
            <Text style={styles.noTicketTitle}>Aucun ticket actif</Text>
            <Text style={styles.noTicketDescription}>
              Prenez un ticket pour vous mettre en file d'attente pour vos paiements
            </Text>
            <TouchableOpacity style={styles.getTicketButton}>
              <Text style={styles.getTicketButtonText}>Prendre un ticket</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <Animated.View 
          style={styles.sectionContainer}
          entering={FadeInUp.delay(500).duration(700)}
        >
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <TouchableOpacity 
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification
                ]}
              >
                <View style={styles.notificationIcon}>
                  <AlertCircle 
                    color={!notification.read ? '#2563eb' : '#94a3b8'} 
                    size={20} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyNotifications}>
              <Text style={styles.emptyNotificationsText}>
                Aucune notification pour le moment
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcome: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#e0e7ff',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
  },
  content: {
    padding: 20,
    marginTop: -25,
  },
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
  noTicketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    alignItems: 'center',
  },
  noTicketImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  noTicketTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 8,
  },
  noTicketDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  getTicketButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  getTicketButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  notificationIcon: {
    marginRight: 15,
    paddingTop: 3,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#94a3b8',
  },
  emptyNotifications: {
    padding: 30,
    alignItems: 'center',
  },
  emptyNotificationsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94a3b8',
  },
});