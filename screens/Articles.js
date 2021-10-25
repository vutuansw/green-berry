import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl,StyleSheet, Image } from "react-native";
import { Audio } from 'expo-av';
import Spinner from 'react-native-loading-spinner-overlay';

const Articles = ({ navigation, route }) => {

    const API_URL = 'https://vutuansw.github.io/hoctuvung/';
    const API_DATA = API_URL+'data/'+route.params.id+'.json';
    const API_IMAGE = API_URL+'images/'+route.params.id+'/';
    const API_AUDIO = API_URL+'audios/'+route.params.id+'/';

    let [isLoading, setLoading] = useState(true);
    let [isRefresh, setRefresh] = useState(false);
    let [data, setData] = useState(null);
    let [sound, setSound] = React.useState();
    let [isPlaying, setIsPlaying] = useState(false);
    

    async function playSound(fileName) {

        if(isPlaying){
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
        await sound.playAsync().then(()=>{
            setIsPlaying(false);
        });
       
    }

    let imageUrl = (image) => {
        return API_IMAGE + image;
    }

    const fetchData = (v)=>{
        fetch(API_DATA + v)
            .then((response) => response.json())
            .then((json) => {
                setData(json)
               
            })
            .catch((error) => {
                console.error('Err:',error)
            })
            .finally(() => {
                setLoading(false);
                setRefresh(false);
            });
    }
    
    const handleRefresh = () => {
        setRefresh(true);
        fetchData('?v=' + new Date().getTime());
    }

    useEffect(() => {
        fetchData('?v=1.0.6');
    }, [sound]);


    return (
        <View style={[styles.container,route.params.theme=='dark'?styles.article_dark:null]}>
           
            {data!=null ? (
                <FlatList
                    style={[styles.article]}
                    data={data.data}
                    renderItem={({ item, index }) => <TouchableOpacity key={index} style={[styles.article__item,route.params.theme=='dark'?styles.article__item_dark:null]}
                        onPress={() => playSound(item.audio)}>
                        <Image style={styles.article__image} source={{ uri: imageUrl(item.image) }} />
                        <Text style={[styles.article__name,route.params.theme=='dark'?styles.colorLight:null]}>{item.name}</Text>
                        <Text style={[styles.article__spelling,route.params.theme=='dark'?styles.colorSecondLight:null]}>Spelling: {item.spelling}</Text>
                    </TouchableOpacity>}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefresh}
                            onRefresh={handleRefresh}
                            tintColor="#8dc54a" />
                    }
                />
            ) :!isLoading?(
                <View style={styles.notfound}>
                    <Text style={styles.notfound__heading}>
                        :-\
                    </Text>
                    <Text style={styles.notfound__desc}>
                        404 Not Found
                    </Text>
                </View>):<Spinner 
           visible={true} 
           color={'#8dc54a'} 
           animation={'fade'} 
           overlayColor={'rgba(255, 255, 255, .3)'} 
           />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',  
    },
    notfound:{
        marginTop:-150
    },
    notfound__heading: {
        fontSize: 70,
        fontWeight:'900',
        color: '#8dc54a',
        textAlign:'center'
    },
    notfound__desc: {
        fontSize: 16,
        color: '#8dc54a',
        textAlign:'center',
        marginTop:20,
        fontWeight:'bold',
    },
    article: {
        width: '100%',
          
    },
    article_dark:{
        backgroundColor: '#444',        
    },
    article__item: {
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 6,
    },
    article__item_dark:{
        backgroundColor: '#666',
    },
    colorLight:{
        color:'#eee'
    },
    colorSecondLight:{
        color:'#ccc'
    },
    article__image: {
        width: '100%',
        height: null,
        aspectRatio: 800 / 503,
        resizeMode: 'cover',
        backgroundColor:'#99b9b6'
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
    }
});

export default Articles;