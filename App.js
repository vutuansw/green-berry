import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import ArticleScreen from './screens/Articles';
import { StyleSheet ,TouchableOpacity,Text} from 'react-native';
import { ThemeContext } from './components/context';
import Feather from 'react-native-vector-icons/Feather';

const Stack = createStackNavigator();

const MyStack = () => {

  //global.API_URL = 'https://vutuansw.github.io/hoctuvung/';

  let themeContext = {
    toggleImages: true,
    color: Appearance.getColorScheme(),
  };

  const [theme, setTheme] = useState(themeContext);

  const onToggleImages = () => {
    if (theme.toggleImages) {
      setTheme({
        toggleImages: false,
        color: Appearance.getColorScheme(),
      });

    } else {
      setTheme({
        toggleImages: true,
        color: Appearance.getColorScheme(),
      });
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationContainer>

        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Topics', headerShown: false }}
          />

          <Stack.Screen
            name="Articles"
            component={ArticleScreen}
            options={({ route }) => ({
              title: route.params.name,
              headerTintColor: '#fff',
              headerStyle: {
                backgroundColor: '#8dc54a'
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => onToggleImages()}
                  style={styles.header_button}>
                    {theme.toggleImages?
                    <Feather name="eye-off" color="#fff" size={19}/>:
                    <Feather name="eye" color="#fff" size={19}/>
                    }
                    
                </TouchableOpacity>
              ),

            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  )
};

const styles = StyleSheet.create({
    header_button:{
      paddingRight:15
    },
    header_button__text:{
      color:'#fff'
    }
});

export default MyStack;
