import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Chrome as Home, HeartHandshake, FileText, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
          headerTitle: 'SONABEL',
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => (
            <HeartHandshake color={color} size={size} />
          ),
          headerTitle: 'Services',
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Demandes',
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
          headerTitle: 'Mes demandes',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
          headerTitle: 'Mon profil',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: 65,
    paddingBottom: 10,
  },
  tabLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  header: {
    backgroundColor: '#ffffff',
    height: 90,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#0f172a',
  },
});