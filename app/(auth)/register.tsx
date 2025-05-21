import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Mail, User, Phone, EyeOff, Eye } from 'lucide-react-native';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    // Simple validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // This will be replaced with actual API call
      // For now, we'll simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to login after successful registration
      router.replace('/login');
    } catch (err) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#1e3a8a', '#2563eb']}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SONABEL</Text>
          </View>
          <Text style={styles.headerText}>Créer un compte</Text>
          <Text style={styles.subHeaderText}>Inscrivez-vous pour accéder aux services de SONABEL</Text>
        </LinearGradient>
        
        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <User color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Mail color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Phone color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <EyeOff color="#64748b" size={20} /> : <Eye color="#64748b" size={20} />}
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Lock color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              {showConfirmPassword ? <EyeOff color="#64748b" size={20} /> : <Eye color="#64748b" size={20} />}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà inscrit? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#e0e7ff',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#b91c1c',
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
    color: '#334155',
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  registerButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    color: '#64748b',
  },
  loginLink: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2563eb',
  },
});