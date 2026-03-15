import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Settings as Gear, Building2, Calendar, ShieldCheck, Info, Save } from 'lucide-react-native';

export default function Settings() {
  const [gymName, setGymName] = useState('Royal Health Club');
  const [duration, setDuration] = useState('30');

  const handleSave = () => {
    Alert.alert("Saved", "Settings updated successfully!");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}><Gear size={28} color="#2563eb" /></View>
        <View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your gym configuration</Text>
        </View>
      </View>

      {/* Configuration Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gym Configuration</Text>
        
        <Text style={styles.label}>GYM NAME</Text>
        <View style={styles.inputContainer}>
          <Building2 size={18} color="#94a3b8" />
          <TextInput style={styles.input} value={gymName} onChangeText={setGymName} />
        </View>

        <Text style={styles.label}>DEFAULT SUBSCRIPTION (DAYS)</Text>
        <View style={styles.inputContainer}>
          <Calendar size={18} color="#94a3b8" />
          <TextInput style={styles.input} value={duration} keyboardType="numeric" onChangeText={setDuration} />
        </View>

        <View style={styles.infoBox}>
          <Info size={16} color="#2563eb" />
          <Text style={styles.infoText}>New members will default to {duration} days expiry.</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Save size={20} color="white" />
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.aboutCard}>
        <View style={styles.row}>
          <ShieldCheck size={20} color="#10b981" />
          <Text style={styles.aboutText}>App Version 1.0.0 (Pro)</Text>
        </View>
        <Text style={styles.footerText}>Royal Health Manager - Premium SaaS for Gyms</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#F8FAFC', paddingTop: 60, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
  headerIcon: { width: 50, height: 50, backgroundColor: '#eff6ff', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, color: '#1e293b' },
  label: { fontSize: 10, fontWeight: '800', color: '#94a3b8', marginBottom: 8, letterSpacing: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 15, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10, fontWeight: '600', color: '#1e293b' },
  infoBox: { flexDirection: 'row', backgroundColor: '#eff6ff', padding: 15, borderRadius: 15, gap: 10, marginBottom: 25 },
  infoText: { flex: 1, color: '#2563eb', fontSize: 12, fontWeight: '600' },
  saveBtn: { backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 20, gap: 10 },
  saveBtnText: { color: 'white', fontWeight: '900', fontSize: 16 },
  aboutCard: { marginTop: 30, alignItems: 'center', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aboutText: { fontWeight: '700', color: '#10b981' },
  footerText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' }
});