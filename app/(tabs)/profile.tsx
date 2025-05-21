import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { User, Bell, LogOut, ChevronRight, Shield, Key, CircleHelp as HelpCircle, Settings, Smartphone } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    // TODO: Implement actual logout logic
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>Innocent DEMBELE</Text>
          <Text style={styles.userEmail}>innocent.dembelle@example.com</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Animated.View 
        style={styles.section}
        entering={FadeInUp.delay(200).duration(700)}
      >
        <Text style={styles.sectionTitle}>Compte</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <User color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Informations personnelles</Text>
          </View>
          <ChevronRight color="#94a3b8" size={18} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Shield color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Sécurité et confidentialité</Text>
          </View>
          <ChevronRight color="#94a3b8" size={18} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Key color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Changer le mot de passe</Text>
          </View>
          <ChevronRight color="#94a3b8" size={18} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View 
        style={styles.section}
        entering={FadeInUp.delay(300).duration(700)}
      >
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Bell color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
            thumbColor={notificationsEnabled ? '#2563eb' : '#f1f5f9'}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            value={notificationsEnabled}
          />
        </View>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Smartphone color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Préférences de notification</Text>
          </View>
          <ChevronRight color="#94a3b8" size={18} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View 
        style={styles.section}
        entering={FadeInUp.delay(400).duration(700)}
      >
        <Text style={styles.sectionTitle}>Autres</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <HelpCircle color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Aide et support</Text>
          </View>
          <ChevronRight color="#94a3b8" size={18} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Settings color="#2563eb" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Paramètres de l'application</Text>
          </View>
          <ChevronRight color="#94a3b8" size={18} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
            <LogOut color="#ef4444" size={20} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuItemText, styles.logoutText]}>Déconnexion</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2023 SONABEL. Tous droits réservés</Text>
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
    backgroundColor: '#2563eb',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingTop: 30,
    paddingBottom: 35,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 15,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#dbeafe',
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    marginTop: 15,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#334155',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutIconContainer: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#94a3b8',
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#94a3b8',
    marginTop: 5,
  },
});