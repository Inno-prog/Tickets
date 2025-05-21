import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Search, FileText, Clock, CircleCheck as CheckCircle2, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function RequestsScreen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock request data
  const requestsData = [
    {
      id: '1',
      type: 'Branchement électrique',
      reference: 'REF-39201',
      date: '10 Mai 2023',
      status: 'completed',
    },
    {
      id: '2',
      type: 'Abonnement eau',
      reference: 'REF-39458',
      date: '22 Mai 2023',
      status: 'pending',
    },
    {
      id: '3',
      type: 'Réclamation facture',
      reference: 'REF-40012',
      date: '05 Juin 2023',
      status: 'in_progress',
    },
    {
      id: '4',
      type: 'Changement compteur',
      reference: 'REF-40123',
      date: '12 Juin 2023',
      status: 'rejected',
    },
  ];
  
  const getFilteredRequests = () => {
    let filtered = requestsData;
    
    // Apply search filter if any
    if (search) {
      filtered = filtered.filter(
        req => 
          req.type.toLowerCase().includes(search.toLowerCase()) ||
          req.reference.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(req => req.status === activeTab);
    }
    
    return filtered;
  };
  
  const getStatusDetails = (status) => {
    switch(status) {
      case 'completed':
        return {
          label: 'Terminé',
          color: '#10b981',
          bgColor: '#d1fae5',
          icon: <CheckCircle2 color="#10b981" size={18} />
        };
      case 'pending':
        return {
          label: 'En attente',
          color: '#f59e0b',
          bgColor: '#fef3c7',
          icon: <Clock color="#f59e0b" size={18} />
        };
      case 'in_progress':
        return {
          label: 'En cours',
          color: '#2563eb',
          bgColor: '#dbeafe',
          icon: <AlertCircle color="#2563eb" size={18} />
        };
      case 'rejected':
        return {
          label: 'Rejeté',
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: <XCircle color="#ef4444" size={18} />
        };
      default:
        return {
          label: 'Inconnu',
          color: '#6b7280',
          bgColor: '#f3f4f6',
          icon: <FileText color="#6b7280" size={18} />
        };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes demandes</Text>
        <Text style={styles.headerSubtitle}>Consultez et suivez l'état de vos demandes</Text>
      </View>
      
      <Animated.View 
        style={styles.searchContainer}
        entering={FadeInUp.delay(200).duration(700)}
      >
        <View style={styles.searchInputContainer}>
          <Search color="#64748b" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une demande..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </Animated.View>
      
      <Animated.View 
        style={styles.tabsContainer}
        entering={FadeInUp.delay(300).duration(700)}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Toutes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
              En attente
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'in_progress' && styles.activeTab]}
            onPress={() => setActiveTab('in_progress')}
          >
            <Text style={[styles.tabText, activeTab === 'in_progress' && styles.activeTabText]}>
              En cours
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Terminées
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
            onPress={() => setActiveTab('rejected')}
          >
            <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
              Rejetées
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      
      <Animated.View 
        style={styles.requestsContainer}
        entering={FadeInUp.delay(400).duration(700)}
      >
        {getFilteredRequests().length > 0 ? (
          getFilteredRequests().map((request) => {
            const statusDetails = getStatusDetails(request.status);
            
            return (
              <TouchableOpacity key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestType}>{request.type}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusDetails.bgColor }]}>
                    {statusDetails.icon}
                    <Text style={[styles.statusText, { color: statusDetails.color }]}>
                      {statusDetails.label}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.requestDetails}>
                  <View style={styles.requestDetail}>
                    <Text style={styles.requestDetailLabel}>Référence:</Text>
                    <Text style={styles.requestDetailValue}>{request.reference}</Text>
                  </View>
                  
                  <View style={styles.requestDetail}>
                    <Text style={styles.requestDetailLabel}>Date:</Text>
                    <Text style={styles.requestDetailValue}>{request.date}</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>Voir les détails</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyStateContainer}>
            <FileText color="#94a3b8" size={50} />
            <Text style={styles.emptyStateTitle}>Aucune demande trouvée</Text>
            <Text style={styles.emptyStateDescription}>
              Vous n'avez pas encore fait de demande ou aucune demande ne correspond à votre recherche.
            </Text>
            <TouchableOpacity style={styles.newRequestButton}>
              <Text style={styles.newRequestButtonText}>Nouvelle demande</Text>
            </TouchableOpacity>
          </View>
        )}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScrollContainer: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  requestsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestType: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
  requestDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  requestDetail: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  requestDetailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#64748b',
    width: 90,
  },
  requestDetailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#0f172a',
    flex: 1,
  },
  viewDetailsButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2563eb',
  },
  emptyStateContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  newRequestButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  newRequestButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
});