import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Card } from 'react-native-paper';
import * as Location from 'expo-location';
// const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
import { WEATHER_API_KEY } from '@env';
export default function App() {
  // let latitude = 45.5152;
  // let longitude = -122.6784;

  const [data, setData] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);
  console.log(WEATHER_API_KEY);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    let latitude = location?.latitude;
    let longitude = location?.longitude;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=3&key=${WEATHER_API_KEY}`;
    if (location) {
      getWeather(url);
    }
  }, [location]);

  async function getWeather(url) {
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      console.log(responseJson);
      setData(responseJson.data);
      setCity(responseJson.city_name);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require('./assets/background.jpg')}
        resizeMode="cover"
      >
        <Text style={styles.city}>{city}</Text>
        {data.map((weather, idx) => (
          <Card style={styles.paragraph} key={idx}>
            <Card.Title
              titleStyle={{
                textAlign: 'center',
                color: 'white',
              }}
              title={weather.valid_date}
            />
            <Text style={styles.weather}>
              {Math.floor((weather.max_temp * 9) / 5 + 32)} /{' '}
              {Math.floor((weather.min_temp * 9) / 5 + 32)}
            </Text>
            <Text style={styles.weather}>{weather.weather.description}</Text>
          </Card>
        ))}

        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#000000c0',
    margin: '5%',
    color: 'white',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  city: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weather: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
