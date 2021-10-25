import { StatusBar } from 'expo-status-bar';
import React,{ useState,useEffect }  from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import ArticleScreen from './screens/Articles';

const Stack = createStackNavigator();

const MyStack = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{ title: 'Chủ đề',headerShown:false,params:{id:'df'}}}
          
        />
        <Stack.Screen name="Articles" 
        component={ArticleScreen} 
        options={({ route }) => ({ title: route.params.name, headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#8dc54a'
          },})}
        
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;