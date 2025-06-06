import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExternalPathString, Link } from 'expo-router';

import { formatDate } from '@/lib/helpers';
import { Bookmark } from '@/types/bookmark';

type ListItemProps = {
  onToggleConsumed: (id: Bookmark['id'], isChecked: boolean) => void;
  children: React.ReactNode;
  isPlaying: boolean;
} & Partial<Bookmark>;

export const ListItem = ({
  id,
  onToggleConsumed,
  dateAdded,
  consumed,
  url,
  title,
  isPlaying,
  children,
}: ListItemProps) => {
  if (!id) return;

  return (
    <View style={[styles.itemContainer, isPlaying ? styles.playingItem : {}]}>
      <View style={[{ padding: 16 }]}>
        <Text
          style={[
            styles.date,
            isPlaying ? styles.active : {},
            consumed ? styles.consumed : {},
          ]}
        >
          {formatDate(dateAdded as number)}
        </Text>

        <View style={[styles.titleContainer]}>
          <Link
            href={url as ExternalPathString}
            style={[{}, consumed ? styles.consumed : {}]}
          >
            <Text style={[styles.title, isPlaying ? styles.active : {}]}>
              {title}
            </Text>
          </Link>
        </View>

        <View style={[styles.actionsContainer]}>
          <TouchableOpacity
            style={[
              styles.button,
              isPlaying ? styles.activeButton : {},
              consumed ? styles.consumed : {},
            ]}
            onPress={() => onToggleConsumed(id, !consumed)}
          >
            <Text
              style={[styles.buttonText, isPlaying ? styles.playingText : {}]}
            >
              {!consumed ? 'Mark as read' : 'Mark as unread'}
            </Text>
          </TouchableOpacity>
          {!isPlaying ? children : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Lora_400Regular',
    lineHeight: 24,
  },
  itemContainer: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
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
  actionsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  playingItem: {
    backgroundColor: 'blueviolet',
  },
  playingText: {
    color: 'white',
  },
  consumed: {
    opacity: 0.3,
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
  activeButton: {
    borderColor: 'white',
  },
});
