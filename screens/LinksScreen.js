import React from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default function LinksScreen(props) {
  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <ExpoLinksView />
      <Button color="blue" title="Click me!" onPress={() => {
              console.log('Navigating to details.  props.navigation = %o', props.navigation); 
              // Works:
              //props.navigation.navigate('Details');
              props.navigation.navigate({ routeName: 'Details2'});
              //NavigationActions.navigate({ routeName: 'Links' });
              
              // Doesnt' work
              //props.navigation.navigate({routeName: 'Links', params: {}, action: NavigationActions.navigate({ routeName: 'Details2' })});
              //props.navigation.navigate('Details2');
              //props.navigation.navigate({routeName: 'Links'});


              //xxxprops.navigation.navigate({routeName: 'Links2', params: {}, action: NavigationActions.navigate({ routeName: 'Details' })});
              //props.navigation.navigate('Home', {}, NavigationActions.navigate({ routeName: 'Details' }));
              //NavigationActions.navigate({ routeName: 'Details' });
              //props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Details' }));
              // NavigationActions.navigate(
              //   { routeName: "Home", 
              //     action: NavigationActions.navigate({routeName: 'Details'})
              //   }
              // );
          }}></Button>      
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
