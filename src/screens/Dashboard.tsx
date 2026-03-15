import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
// 'Settings' को 'GearIcon' की तरह इम्पोर्ट किया गया है ताकि कोड में एरर न आए
import { 
  Users, 
  AlertCircle, 
  UserMinus, 
  IndianRupee, 
  ChevronRight, 
  TrendingUp, 
  Settings as GearIcon 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// gymName अब App.tsx से यहाँ पास होगा
export default function Dashboard({ members, onNavigate, gymName }: any) {
  // --- लॉजिक और कैलकुलेशन ---
  const todayDate = new Date().getDate();

  // 1. वो मेंबर्स जो अभी जिम में हैं (Active)
  const activeMembers = members.filter((m: any) => m.status !== 'Left');

  // 2. वो एक्टिव मेंबर्स जिनकी फीस की तारीख निकल चुकी है
  const expiredMembersCount = activeMembers.filter((m: any) => todayDate > Number(m.dueDate)).length;

  // 3. वो मेंबर्स जो जिम छोड़ चुके हैं
  const leftMembersCount = members.filter((m: any) => m.status === 'Left').length;

  // 4. सिर्फ एक्टिव मेंबर्स से होने वाली कमाई
  const totalRevenue = activeMembers.reduce((acc: number, curr: any) => acc + (Number(curr.fee) || 0), 0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Header - यहाँ अब आपके जिम का नाम दिखेगा */}
      <Text style={styles.pageTitle}>{gymName || 'Royal Gym'}</Text>
      <Text style={styles.subText}>Gym Overview & Analytics</Text>

      {/* Stats Grid */}
      <View style={styles.grid}>
        <StatCard 
          title="Active Members" 
          value={activeMembers.length.toString()} 
          icon={Users} 
          color="#2563eb" 
        />
        <StatCard 
          title="Expired Fees" 
          value={expiredMembersCount.toString()} 
          icon={AlertCircle} 
          color="#f43f5e" 
        />
        <StatCard 
          title="Left Members" 
          value={leftMembersCount.toString()} 
          icon={UserMinus} 
          color="#475569" 
        />
        <StatCard 
          title="Revenue" 
          value={`₹${totalRevenue}`} 
          icon={IndianRupee} 
          color="#10b981" 
        />
      </View>
      
      {/* Quick Actions Section */}
      <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
      
      <ActionBtn 
        title="Manage Active Members" 
        icon={Users} 
        color="#2563eb" 
        onPress={() => onNavigate('Members')} 
      />
      
      <ActionBtn 
        title="View Overdue Fees" 
        icon={AlertCircle} 
        color="#f43f5e" 
        onPress={() => onNavigate('Expired')} 
      />
      
      <ActionBtn 
        title="Left Members Record" 
        icon={UserMinus} 
        color="#475569" 
        onPress={() => onNavigate('Left')} 
      />

      <ActionBtn 
        title="Settings & Configuration" 
        icon={GearIcon} 
        color="#264c83" 
        onPress={() => onNavigate('Settings')} 
      />

    </ScrollView>
  );
}

// --- छोटी Stat Card के लिए Component ---
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={styles.statLabel}>{title}</Text>
    <View style={styles.valRow}>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.trendIcon}><TrendingUp size={10} color="#10b981" /></View>
    </View>
  </View>
);

// --- Quick Action Button के लिए Component ---
const ActionBtn = ({ title, icon: Icon, color, onPress }: any) => (
  <TouchableOpacity style={styles.mainActionBtn} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIconCircle, { backgroundColor: color }]}>
      <Icon size={20} color="white" />
    </View>
    <Text style={styles.mainActionText}>{title}</Text>
    <ChevronRight size={18} color="#cbd5e1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 150, paddingTop: 60 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1, textTransform: 'uppercase' },
  subText: { fontSize: 14, color: '#64748b', marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  statCard: { 
    width: (width - 64) / 2, 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 28, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  valRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#000' },
  trendIcon: { padding: 4, backgroundColor: '#f0fdf4', borderRadius: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: '#94a3b8', marginTop: 25, marginBottom: 15, letterSpacing: 1 },
  mainActionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#f1f5f9', 
    gap: 15, 
    backgroundColor: '#fff', 
    marginBottom: 12,
    elevation: 1
  },
  actionIconCircle: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  mainActionText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#000' },
});