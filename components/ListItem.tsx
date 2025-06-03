import { formatDate } from '@/lib/helpers';
import { Bookmark } from '@/types/bookmark';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HearButton } from './HearButton';
import { ExternalPathString, Link } from 'expo-router';

type ListItemProps = {
  dateAdded: number;
  onCheckboxChange: (id: Bookmark['id'], isChecked: boolean) => void;
  onHearPress: (id: Bookmark['id']) => void;
  onStopPress: () => void;
  onCancelPress: () => void;
  playing: boolean;
  loading: boolean;
} & Partial<Bookmark>;
export const ListItem = memo(
  ({
    id,
    onCheckboxChange,
    dateAdded,
    consumed,
    url,
    title,
    onHearPress,
    onStopPress,
    loading,
    onCancelPress,
    playing,
    hearable,
  }: ListItemProps) => {
    if (!id) return;
    return (
      <View style={[styles.itemContainer, playing ? styles.playingItem : {}]}>
        <Text
          style={[
            styles.date,
            playing ? styles.active : {},
            consumed ? styles.consumed : {},
          ]}
        >
          {formatDate(dateAdded)}
        </Text>

        <Link
          href={url as ExternalPathString}
          style={[consumed ? styles.consumed : {}]}
        >
          <Text style={[styles.title, playing ? styles.active : {}]}>
            {title}
          </Text>
        </Link>

        <View
          style={[styles.actionsContainer, consumed ? styles.consumed : {}]}
        >
          {hearable ? (
            <HearButton
              playing={playing}
              loading={loading}
              onHearPress={() => onHearPress(id)}
              onStopPress={onStopPress}
              onCancelPress={onCancelPress}
            />
          ):<View></View>}
          <TouchableOpacity
            style={[styles.checkbox, playing ? styles.checkboxPlaying : {}]}
            onPress={() => onCheckboxChange(id, !consumed)}
          >
            <View
              style={[styles.checkboxInner, consumed ? styles.checked : {}]}
            ></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: 'Lora_400Regular',
    lineHeight: 24,
    width: '100%',
    flexWrap: 'wrap',
  },
  itemContainer: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    padding: 16,
  },
  active: {
    color: 'white',
  },
  date: {
    fontFamily: 'Lora_400Regular',
    fontSize: 13,
    marginBottom: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },

  checkbox: {
    width: 20,
    position: 'relative',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    height: 20,
    backgroundColor: 'white',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 1,
    left: 1,
    backgroundColor: 'blueviolet',
    transform: 'scale(0)',
    transitionProperty: 'transform',
    transitionDuration: '200',
    transitionTimingFunction: 'ease-in',
    transformOrigin: 'center',
  },
  checked: {
    transform: 'scale(1)',
  },
  actionsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  playingItem: {
    backgroundColor: 'blueviolet',
  },
  playingText: {
    color: 'white',
    fontWeight: 700,
    fontFamily: 'Lora_700Bold',
  },
  checkboxPlaying: {
    borderColor: 'white',
  },
  consumed: {
    opacity: 0.3,
  },
});
