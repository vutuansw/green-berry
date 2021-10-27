import React, { useState, useEffect,useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Image } from "react-native";
import { Audio } from 'expo-av';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import Offline from './../components/Offline';
import Notfound from '../components/Notfound';
import { ThemeContext } from '../components/context';

const Articles = ({ navigation, route }) => {

    const API_URL = 'https://vutuansw.github.io/hoctuvung/';
    const API_DATA = API_URL + 'data/' + route.params.id + '.json';
    const API_IMAGE = API_URL + 'images/' + route.params.id + '/';
    const API_AUDIO = API_URL + 'audios/' + route.params.id + '/';
    const theme = useContext(ThemeContext);

    let [isLoading, setLoading] = useState(true);
    let [isRefresh, setRefresh] = useState(false);
    let [isOffline, setIsOffline] = useState(false);
    let [data, setData] = useState(null);
    let [sound, setSound] = React.useState();
    let [isPlaying, setIsPlaying] = useState(false);


    async function playSound(fileName) {

        if (isPlaying) {
            return;
        }

        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: true
        });

        const { sound } = await Audio.Sound.createAsync(
            { uri: API_AUDIO + fileName },
            { shouldPlay: false }
        );

        setSound(sound);
        setIsPlaying(true);
        await sound.playAsync().then(() => {
            setIsPlaying(false);
        });

    }

    let imageUrl = (image) => {
        return API_IMAGE + image;
    }

    const fetchData = (v) => {
        fetch(API_DATA + v)
            .then((response) => response.json())
            .then((json) => {
                setData(json)

            })
            .catch((error) => {
                console.error('Err:', error)
            })
            .finally(() => {
                setLoading(false);
                setRefresh(false);
            });
    }

    const checkConnection = () => {

        NetInfo.fetch().then(state => {
            setIsOffline(!state.isConnected);
            if (state.isConnected) {
                fetchData('?v=1.0.6');
            }
        });
    }

    const handleRefresh = () => {
        if (!isOffline) {
            setRefresh(true);
            fetchData('?v=' + new Date().getTime());
        }
    }

    const getStyles = (name) => {
        return [styles[name], theme.color=='dark'? dark[name]:null];
    }

    useEffect(() => {
        checkConnection();
    }, [sound]);

    return (

        <View style={getStyles('container')}>
            {!isOffline ? (
                <View>
                    {data != null ? (
                        <FlatList
                            style={[styles.article]}
                            data={data.data}
                            numColumns={1}
                            renderItem={({ item, index }) => <TouchableOpacity key={index} style={getStyles('article__item')}
                                onPress={() => playSound(item.audio)}>
                                <View style={styles.article__image_container}>
                                    <Image style={[styles.article__image,!theme.toggleImages?{opacity:0}:null]} source={{ uri: imageUrl(item.image) }} />
                                </View>
                                <Text style={getStyles('article__name')}>{item.name}</Text>
                                <Text style={getStyles('article__spelling')}>Spelling: {item.spelling}</Text>
                            </TouchableOpacity>}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefresh}
                                    onRefresh={handleRefresh}
                                    tintColor="#8dc54a" />
                            }
                        />
                    ) : !isLoading ? (
                        <Notfound></Notfound>) : <Spinner
                        visible={true}
                        color={'#8dc54a'}
                        animation={'fade'}
                        overlayColor={'rgba(255, 255, 255, .3)'}
                    />
                    }
                </View>
            ) :
                <Offline checkConnection={checkConnection}></Offline>
            }
        </View>
    )
}

const dark = StyleSheet.create({
    container: {
        backgroundColor: '#444444'
    },
    article: {
        color: '#eee',
        backgroundColor: '#444'
    },
    article__item: {
        backgroundColor: '#666'
    },
    article__name: {
        color: '#eee'
    },
    article__spelling: {
        color: '#ccc',
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
    },
    article: {
        width: '100%',
    },
    article__item: {
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 20,
        shadowColor: "#000",
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 6,
    },
    article__image_container:{
        backgroundColor: '#99b9b6'
    },
    article__image: {
        width: '100%',
        height: null,
        aspectRatio: 800 / 503,
        resizeMode: 'cover',
    },
    article__name: {
        marginTop: 10,
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    article__spelling: {
        color: '#444',
        textAlign: 'center'
    },
});

export default Articles;