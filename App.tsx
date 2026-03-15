import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Text, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
// टच और जेस्चर को स्मूथ बनाने के लिए ज़रूरी
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { 
  LayoutDashboard, 
  Users, 
  AlertCircle, 
  UserMinus, 
  Plus, 
  X, 
  Settings as GearIcon 
} from 'lucide-react-native';

// Firebase Config
import { db } from './src/config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Screens
import Auth from './src/screens/Auth'; 
import Dashboard from './src/screens/Dashboard';
import Members from './src/screens/Members';
import ExpiredMembers from './src/screens/ExpiredMembers';
import LeftMembers from './src/screens/LeftMembers';
import Settings from './src/screens/Settings';

const { width } = Dimensions.get('window');

export default function App() {
  // --- States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [gymName, setGymName] = useState('Royal Gym'); // जिम का नाम यहाँ स्टोर होगा
  const [screen, setScreen] = useState('Dashboard');
  const [members, setMembers] = useState<any[]>([]);
  const [isFabOpen, setFabOpen] = useState(false);

  // --- Firebase Sync (Real-time डेटा लोड करना) ---
  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firebase Sync Error: ", error);
    });
    return () => unsubscribe();
  }, []);

  // लॉगिन सफल होने पर जिम का नाम सेट करने वाला फंक्शन
  const handleLoginSuccess = (name: string) => {
    setGymName(name); 
    setIsLoggedIn(true);
  };

  // नेविगेशन फंक्शन
  const navigateTo = (screenName: string) => {
    setScreen(screenName);
    setFabOpen(false); 
  };

  // --- अगर लॉगिन नहीं है, तो लॉगिन स्क्रीन दिखाओ ---
  if (!isLoggedIn) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#020617" />
        <Auth onLoginSuccess={handleLoginSuccess} />
      </GestureHandlerRootView>
    );
  }

  // --- लॉगिन होने के बाद मुख्य ऐप ---
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* --- मुख्य स्क्रीन एरिया (Navigation Logic) --- */}
        <View style={{ flex: 1 }}>
          {screen === 'Dashboard' && (
            <Dashboard members={members} onNavigate={setScreen} gymName={gymName} />
          )}
          {screen === 'Members' && (
            <Members members={members.filter((m: any) => m.status !== 'Left')} />
          )}
          {screen === 'Expired' && (
            <ExpiredMembers members={members} />
          )}
          {screen === 'Left' && (
            <LeftMembers members={members} />
          )}
          {screen === 'Settings' && (
            <Settings />
          )}
        </View>

        {/* --- फ्लोटिंग प्रीमियम बॉटम नेविगेशन (Touch Fix के साथ) --- */}
        <View style={styles.navWrapper} pointerEvents="box-none">
          <View style={styles.floatingNav}>
            
            {/* Dashboard */}
            <TouchableOpacity onPress={() => setScreen('Dashboard')} style={styles.navItem}>
              <LayoutDashboard color={screen === 'Dashboard' ? "#2563eb" : "#94a3b8"} size={24} />
              {screen === 'Dashboard' && <View style={styles.activeDot} />}
            </TouchableOpacity>
            
            {/* Members */}
            <TouchableOpacity onPress={() => setScreen('Members')} style={styles.navItem}>
              <Users color={screen === 'Members' ? "#2563eb" : "#94a3b8"} size={24} />
              {screen === 'Members' && <View style={styles.activeDot} />}
            </TouchableOpacity>

            {/* Premium Center Floating Plus Button */}
            <TouchableOpacity 
              style={styles.premiumFab} 
              onPress={() => setFabOpen(true)}
              activeOpacity={0.8}
            >
              <Plus color="white" size={32} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Expired/Overdue Alerts */}
            <TouchableOpacity onPress={() => setScreen('Expired')} style={styles.navItem}>
              <AlertCircle color={screen === 'Expired' ? "#f43f5e" : "#94a3b8"} size={24} />
              {screen === 'Expired' && <View style={[styles.activeDot, {backgroundColor: '#f43f5e'}]} />}
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity onPress={() => setScreen('Settings')} style={styles.navItem}>
              <GearIcon color={screen === 'Settings' ? "#2563eb" : "#94a3b8"} size={24} />
              {screen === 'Settings' && <View style={styles.activeDot} />}
            </TouchableOpacity>

          </View>
        </View>

        {/* --- Quick Actions FAB Modal --- */}
        <Modal 
          visible={isFabOpen} 
          transparent 
          animationType="fade"
          onRequestClose={() => setFabOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.menuCard}>
              <Text style={styles.menuTitle}>Gym Quick Actions</Text>
              
              <TouchableOpacity style={styles.menuOption} onPress={() => navigateTo('Members')}>
                <View style={[styles.optionIconCircle, {backgroundColor: '#eff6ff'}]}>
                  <Plus color="#2563eb" size={22} />
                </View>
                <Text style={styles.optionText}>Add New Member</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuOption} onPress={() => navigateTo('Left')}>
                <View style={[styles.optionIconCircle, {backgroundColor: '#f8fafc'}]}>
                  <UserMinus color="#475569" size={22} />
                </View>
                <Text style={styles.optionText}>Mark Member as Left</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeFab} onPress={() => setFabOpen(false)}>
                <X color="white" size={24} />
                <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 8}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  navWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  floatingNav: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    width: width * 0.9,
    height: 75, 
    borderRadius: 30, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 50, height: 50 },
  activeDot: { width: 5, height: 5, backgroundColor: '#2563eb', borderRadius: 3, marginTop: 4 },
  premiumFab: { 
    width: 65, 
    height: 65, 
    backgroundColor: '#0F172A', 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -45, 
    borderWidth: 5, 
    borderColor: '#F8FAFC',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  menuCard: { 
    backgroundColor: 'white', 
    width: '85%', 
    borderRadius: 35, 
    padding: 25, 
    alignItems: 'center',
    elevation: 20
  },
  menuTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#0F172A', 
    marginBottom: 20 
  },
  menuOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    padding: 18, 
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  optionIconCircle: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  optionText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  closeFab: { 
    marginTop: 10, 
    backgroundColor: '#0F172A', 
    paddingHorizontal: 20,
    paddingVertical: 12, 
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center'
  }
});