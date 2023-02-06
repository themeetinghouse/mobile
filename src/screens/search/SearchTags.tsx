import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import SearchBar from '../../../src/components/SearchBar';
import Theme from '../../../src/Theme.style';

const Styles = StyleSheet.create({
  Container: {
    width: '100%',
    marginLeft: 16,
  },
  Title: {
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
  },
  TagsContainer: {
    height: 34,
  },
  TagText: {
    color: '#000',
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
  },
  TagContainer: {
    height: 34,
    borderRadius: 2,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
});

export default function SearchTags() {
  const [tags, setTags] = React.useState<string[]>([]);
  React.useEffect(() => {
    const fetchTags = async () => {
      setTags([]);
    };
    fetchTags();
  }, []);
  if (tags.length === 0) return null;
  return (
    <View style={Styles.Container}>
      <Text style={Styles.Title}>My Tags</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={Styles.TagsContainer}
      >
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={tag}
            style={[
              Styles.TagContainer,
              index === 0 ? { marginLeft: 0 } : { marginLeft: 8 },
            ]}
          >
            <Text style={Styles.TagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
