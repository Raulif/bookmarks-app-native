import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const HearButton = ({
  playing,
  loading,
  onCancelPress,
  onStopPress,
  onHearPress,
}: {
  playing: boolean;
  loading: boolean;
  onCancelPress: () => void;
  onStopPress: () => void;
  onHearPress: () => void;
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.cancelButon }}
          onPress={onCancelPress}
        >
          <Text style={{ ...styles.buttonText, ...styles.cancelText }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (playing) {
    return (
      <TouchableOpacity
        style={{ ...styles.button, ...styles.playingButton }}
        onPress={onStopPress}
      >
        <Text style={{ ...styles.buttonText, ...styles.playingText }}>
          Stop
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={{ ...styles.button }}
      onPress={onHearPress}
    >
      <Text style={{ ...styles.buttonText }}>Hear</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: 'blueviolet',
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 8,
    minWidth: 68,
    alignItems: 'center',
    gap: 8,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 700,
    color: 'blueviolet',
  },
  playingButton: {
    backgroundColor: 'black',
  },
  playingText: {
    color: 'white',
  },
  cancelButon: {
    backgroundColor: 'black',
  },
  cancelText: {
    color: 'white',
  },
});
