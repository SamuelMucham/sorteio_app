'use client';

import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';

interface Participant {
  id: string;
  name: string;
}

interface Winner {
  id: string;
  name: string;
  date: string;
}

export default function SorteioScreen() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<Winner[]>([]);
  const [rolling, setRolling] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const totalParticipants = useMemo(
    () => participants.length,
    [participants]
  );

  const addParticipant = () => {
    if (!name.trim()) return;

    const newParticipant: Participant = {
      id: Math.random().toString(),
      name: name.trim(),
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setName('');
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const drawWinner = () => {
    if (participants.length === 0 || rolling) return;

    setWinner(null);
    setRolling(true);

    let count = 0;

    const animation = setInterval(() => {
      const random =
        participants[Math.floor(Math.random() * participants.length)];

      setHighlighted(random.name);

      count++;

      if (count > 20) {
        clearInterval(animation);

        const selected =
          participants[Math.floor(Math.random() * participants.length)];

        setHighlighted(selected.name);
        setWinner(selected.name);

        setHistory((prev) => [
          {
            id: Math.random().toString(),
            name: selected.name,
            date: new Date().toLocaleTimeString('pt-BR'),
          },
          ...prev,
        ]);

        setRolling(false);
      }
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.systemText}>Sistema</Text>

          <Text style={styles.logo}>
            Lucky<Text style={styles.logoAccent}>Draw</Text>
          </Text>
        </View>

        {/* INPUT */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons
              name="person-add"
              size={20}
              color="#22d3ee"
            />

            <Text style={styles.cardTitle}>
              Adicionar nomes
            </Text>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: João"
            placeholderTextColor="#64748b"
            style={styles.input}
            onSubmitEditing={addParticipant}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addParticipant}
          >
            <Text style={styles.addButtonText}>
              Adicionar participante
            </Text>
          </TouchableOpacity>
        </View>

        {/* PARTICIPANTES */}
        <View style={styles.participantsContainer}>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={styles.row}>
              <Ionicons
                name="people"
                size={20}
                color="#22d3ee"
              />

              <Text style={styles.cardTitle}>
                Participantes
              </Text>
            </View>

            <Text style={styles.counter}>
              {totalParticipants}
            </Text>
          </View>

          {participants.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Nenhum participante ainda
              </Text>
            </View>
          ) : (
            <FlatList
              data={participants}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: 10,
                paddingTop: 10,
              }}
              renderItem={({ item, index }) => (
                <View style={styles.participantCard}>
                  <View style={styles.row}>
                    <View style={styles.numberCircle}>
                      <Text style={styles.numberText}>
                        {index + 1}
                      </Text>
                    </View>

                    <Text style={styles.participantName}>
                      {item.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      removeParticipant(item.id)
                    }
                  >
                    <Ionicons
                      name="trash"
                      size={18}
                      color="#f87171"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* RESULTADO */}
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>
            Resultado
          </Text>

          <View style={styles.resultBox}>
            {highlighted ? (
              <Text
                style={[
                  styles.resultName,
                  rolling &&
                    styles.resultNameRolling,
                ]}
              >
                {highlighted}
              </Text>
            ) : (
              <Text style={styles.waitingText}>
                Aguardando sorteio...
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.drawButton,
              (participants.length === 0 ||
                rolling) &&
                styles.drawButtonDisabled,
            ]}
            disabled={
              participants.length === 0 || rolling
            }
            onPress={drawWinner}
          >
            <Ionicons
              name="play"
              size={18}
              color="#0f172a"
            />

            <Text style={styles.drawButtonText}>
              {rolling
                ? 'SORTEANDO...'
                : 'INICIAR SORTEIO'}
            </Text>
          </TouchableOpacity>

          {winner && !rolling && (
            <View style={styles.winnerCard}>
              <FontAwesome5
                name="trophy"
                size={40}
                color="#0f172a"
              />

              <Text style={styles.winnerLabel}>
                vencedor
              </Text>

              <Text style={styles.winnerName}>
                {winner}
              </Text>
            </View>
          )}
        </View>

        {/* HISTÓRICO */}
        <View style={styles.historyCard}>
          <View style={styles.row}>
            <Ionicons
              name="time"
              size={20}
              color="#22d3ee"
            />

            <Text style={styles.cardTitle}>
              Histórico
            </Text>
          </View>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum sorteio realizado ainda.
            </Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: 10,
                marginTop: 15,
              }}
              renderItem={({ item, index }) => (
                <View style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyName}>
                      #{index + 1} — {item.name}
                    </Text>

                    <Text style={styles.historyDate}>
                      {item.date}
                    </Text>
                  </View>

                  <FontAwesome5
                    name="trophy"
                    size={18}
                    color="#facc15"
                  />
                </View>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginBottom: 24,
  },

  systemText: {
    color: '#22d3ee',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 6,
    fontSize: 12,
  },

  logo: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
  },

  logoAccent: {
    color: '#22d3ee',
  },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  input: {
    marginTop: 16,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
  },

  addButton: {
    marginTop: 14,
    backgroundColor: '#22d3ee',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 16,
  },

  participantsContainer: {
    flex: 1,
    marginBottom: 20,
  },

  counter: {
    color: '#22d3ee',
    fontWeight: '700',
    fontSize: 16,
  },

  emptyBox: {
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 24,
    marginTop: 14,
    alignItems: 'center',
  },

  emptyText: {
    color: '#94a3b8',
  },

  participantCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#22d3ee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  numberText: {
    color: '#0f172a',
    fontWeight: '900',
  },

  participantName: {
    color: '#fff',
    fontSize: 16,
  },

  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
  },

  resultLabel: {
    textAlign: 'center',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 20,
  },

  resultBox: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 24,
    marginBottom: 24,
    padding: 20,
  },

  resultName: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
  },

  resultNameRolling: {
    color: '#67e8f9',
  },

  waitingText: {
    color: '#64748b',
    fontSize: 18,
  },

  drawButton: {
    backgroundColor: '#22d3ee',
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  drawButtonDisabled: {
    backgroundColor: '#475569',
  },

  drawButtonText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 16,
  },

  winnerCard: {
    marginTop: 24,
    backgroundColor: '#facc15',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },

  winnerLabel: {
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#0f172a',
    fontWeight: '700',
  },

  winnerName: {
    marginTop: 8,
    fontSize: 38,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },

  historyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 18,
  },

  historyItem: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  historyName: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },

  historyDate: {
    color: '#94a3b8',
    fontSize: 12,
  },
});