import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ticket, Zap, Droplet, Construction, CreditCard, ArrowRight, Clock } from 'lucide-react-native';

export default function ServicesScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = [
    { id: '1', day: 'Lun', date: '12', month: 'Juin' },
    { id: '2', day: 'Mar', date: '13', month: 'Juin' },
    { id: '3', day: 'Mer', date: '14', month: 'Juin' },
    { id: '4', day: 'Jeu', date: '15', month: 'Juin' },
    { id: '5', day: 'Ven', date: '16', month: 'Juin' },
    { id: '6', day: 'Sam', date: '17', month: 'Juin' },
  ];

  const timeSlots = [
    { id: '1', time: '08:00', available: true },
    { id: '2', time: '09:00', available: true },
    { id: '3', time: '10:00', available: true },
    { id: '4', time: '11:00', available: false },
    { id: '5', time: '12:00', available: true },
    { id: '6', time: '14:00', available: true },
    { id: '7', time: '15:00', available: true },
    { id: '8', time: '16:00', available: false },
  ];

  const services = [
    { 
      id: '1',
      title: 'Paiement de factures',
      icon: <CreditCard color="#2563eb" size={24} />,
      description: 'Payez vos factures d\'eau et d\'électricité',
    },
    {
      id: '2',
      title: 'Demande de branchement',
      icon: <Construction color="#2563eb" size={24} />,
      description: 'Demander un nouveau branchement électrique',
    },
    {
      id: '3',
      title: 'Services eau',
      icon: <Droplet color="#2563eb" size={24} />,
      description: 'Services liés à la distribution d\'eau',
    },
    {
      id: '4',
      title: 'Services électricité',
      icon: <Zap color="#2563eb" size={24} />,
      description: 'Services liés à la distribution électrique',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services SONABEL</Text>
        <Text style={styles.headerSubtitle}>Sélectionnez un service ou prenez un ticket</Text>
      </View>
      
      <Animated.View 
        style={styles.ticketSection}
        entering={FadeInUp.delay(200).duration(700)}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ticket color="#2563eb" size={20} />
            <Text style={styles.sectionTitle}>Prendre un ticket</Text>
          </View>
        </View>
        
        <View style={styles.ticketContent}>
          <Text style={styles.ticketContentTitle}>Sélectionnez une date</Text>
          
          <FlatList
            data={dates}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateList}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.dateItem,
                  selectedDate === item.id && styles.selectedDateItem
                ]}
                onPress={() => setSelectedDate(item.id)}
              >
                <Text 
                  style={[
                    styles.dateDay,
                    selectedDate === item.id && styles.selectedDateText
                  ]}
                >
                  {item.day}
                </Text>
                <Text 
                  style={[
                    styles.dateNumber,
                    selectedDate === item.id && styles.selectedDateText
                  ]}
                >
                  {item.date}
                </Text>
                <Text 
                  style={[
                    styles.dateMonth,
                    selectedDate === item.id && styles.selectedDateText
                  ]}
                >
                  {item.month}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
          
          <Text style={styles.ticketContentTitle}>Sélectionnez une heure</Text>
          
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeItem,
                  !slot.available && styles.unavailableTimeItem,
                  selectedTime === slot.id && styles.selectedTimeItem
                ]}
                onPress={() => slot.available && setSelectedTime(slot.id)}
                disabled={!slot.available}
              >
                <Clock
                  size={16}
                  color={
                    !slot.available
                      ? '#94a3b8'
                      : selectedTime === slot.id
                      ? '#ffffff'
                      : '#64748b'
                  }
                />
                <Text
                  style={[
                    styles.timeText,
                    !slot.available && styles.unavailableTimeText,
                    selectedTime === slot.id && styles.selectedTimeText
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              (!selectedDate || !selectedTime) && styles.disabledButton
            ]}
            disabled={!selectedDate || !selectedTime}
          >
            <Text style={styles.confirmButtonText}>Confirmer le ticket</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.View
        style={styles.servicesSection}
        entering={FadeInUp.delay(300).duration(700)}
      >
        <Text style={styles.servicesTitle}>Nos services</Text>
        
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceIconContainer}>
              {service.icon}
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
            <ArrowRight color="#64748b" size={20} />
          </TouchableOpacity>
        ))}
        
        <LinearGradient
          colors={['#1e40af', '#3b82f6']}
          style={styles.supportCard}
        >
          <Text style={styles.supportTitle}>Besoin d'aide ?</Text>
          <Text style={styles.supportDescription}>
            Notre équipe de support est disponible pour répondre à toutes vos questions
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contacter le support</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    padding: 20,
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
    marginTop: 5,
  },
  ticketSection: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginLeft: 8,
  },
  ticketContent: {
    padding: 15,
  },
  ticketContentTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#334155',
    marginBottom: 10,
  },
  dateList: {
    marginBottom: 20,
  },
  dateItem: {
    width: 70,
    height: 90,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 10,
  },
  selectedDateItem: {
    backgroundColor: '#2563eb',
  },
  dateDay: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#64748b',
  },
  dateNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0f172a',
    marginVertical: 4,
  },
  dateMonth: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
  },
  selectedDateText: {
    color: '#ffffff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeItem: {
    width: '23%',
    height: 45,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  unavailableTimeItem: {
    backgroundColor: '#f1f5f9',
    opacity: 0.7,
  },
  selectedTimeItem: {
    backgroundColor: '#2563eb',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#334155',
    marginLeft: 5,
  },
  unavailableTimeText: {
    color: '#94a3b8',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  servicesSection: {
    padding: 20,
  },
  servicesTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 15,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
  },
  supportCard: {
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  supportTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  supportDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#e0e7ff',
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  supportButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2563eb',
  },
});