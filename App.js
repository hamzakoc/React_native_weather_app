

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';
import * as Location from 'expo-location';

const weatherAPIKey = '73e8da948b08b5759839dd89525db49c';
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${weatherAPIKey}`;



export default function App() {

  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  const loadForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestBackgroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);

    const data = await response.json();
    if (!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`);
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  }




  useEffect(() => {
    if (!forecast) {
      loadForecast();
    }
  })

  if (!forecast) {
    return <SafeAreaView>
      <ActivityIndicator size="large" />
    </SafeAreaView>;
  }



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => { loadForecast() }}
            refreshing={refreshing}
          />}
      >
        <Text style={styles.title}></Text>

        {forecast.daily.slice(0, 7).map(day => {
          const weather = day.weather[0];

          let weekday = new Date(day.dt * 1000).toLocaleString('en-us', {
            weekday: 'long'
          });

          return <View style={styles.day} key={day.dt}>
            <Image
              style={styles.smallIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
              }}
            />
            <View >
              <Text>{weekday}</Text>
              <Text>{weather.main}</Text>
            </View>
            <Text style={styles.dayTemp}>{day.temp.max}°C</Text>
          </View>
        })}
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 42,
    color: '#e96e50',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
    borderBottomColor: 'skyblue',
    borderBottomWidth: 1,
    width: '100%',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 20
  },
  smallIcon: {
    width: 100,
    height: 100,
  }
});