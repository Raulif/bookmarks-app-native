import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HearButtonProps = {
  playing: boolean;
  loading: boolean;
  onCancelPress: () => void;
  onStopPress: () => void;
  onHearPress: () => void;
};

export const HearButton = ({
  playing,
  loading,
  onCancelPress,
  onStopPress,
  onHearPress,
}: HearButtonProps) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.cancelButon)}
          onPress={onCancelPress}
        >
          <Text
            style={StyleSheet.compose(styles.buttonText, styles.cancelText)}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (playing) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.playingButton)}
          onPress={onStopPress}
        >
          <Text
            style={StyleSheet.compose(styles.buttonText, styles.playingText)}
          >
            Stop
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onHearPress}
      >
        <Text style={styles.buttonText}>Hear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderColor: 'blueviolet',
    borderWidth: 1,
    alignSelf: 'flex-start',
    minWidth: 68,
    alignItems: 'center',
    gap: 8,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: 'Lora_400Regular',
    fontSize: 14,
    color: 'blueviolet',
  },
  playingButton: {
    backgroundColor: 'black',
    borderColor: 'white',
  },
  playingText: {
    color: 'white',
  },
  cancelButon: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  cancelText: {
    color: 'white',
  },
});
