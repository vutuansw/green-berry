import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import {Appearance} from 'react-native-appearance';


const Home = ({ navigation,route }) => {

    const API_URL = 'https://vutuansw.github.io/hoctuvung/';
    const API_DATA = API_URL + 'data/topics.json';
    const API_IMAGE = API_URL + 'images/topics/';

    let [isLoading, setLoading] = useState(true);
    let [isRefresh, setRefresh] = useState(false);
    let [data, setData] = useState(null);
    let [isOffline, setIsOffline] = useState(false);
    const [theme,setTheme] = useState(Appearance.getColorScheme);

    let imageUrl = (image) => {
        return API_IMAGE + image;
    }

    const fetchTopics = (v) => {
        fetch(API_DATA + v)
            .then((response) => response.json())
            .then((json) => {
                setData(json);
            })
            .catch((error) => {
                console.error('Err:', error)
            })
            .finally(() => {
                setLoading(false);
                setRefresh(false);
            });
    }

    const handleRefresh = () => {
        if (!isOffline) {
            setRefresh(true);
            fetchTopics('?v=' + new Date().getTime());
        }
    }

    const checkConnection = ()=>{
      
        NetInfo.fetch().then(state => {
            setIsOffline(!state.isConnected);
        });
    }
    
    useEffect(() => {
       // checkConnection();
       // console.log('isOffline:',isOffline);
       // if(!isOffline){
            fetchTopics('?v=1.0.6');
        //}
    },[isOffline]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.header__text}>Green Berry</Text>
                <Text style={styles.header__text_secondary}>Learn English effectively for kids</Text>
            </View>
            
            {!isOffline ? (
                <View style={[styles.content,theme=='dark'?styles.bgDark:null]}>
                    {data != null ? (
                        <View style={styles.content__scroller}>
                            <FlatList
                                data={data}
                                style={styles.topics}
                                numColumns={2}
                                horizontal={false}
                                renderItem={({ item, index }) => <View key={index} style={styles.topics__item}>
                                    <View style={styles.topics__inner}>
                                        <TouchableOpacity style={styles.topics__content} onPress={() => navigation.navigate('Articles', { name: item.title, id: item.name, theme: theme })}>
                                            <Image style={styles.topics__image} source={{ uri: imageUrl(item.image) }} />
                                            <Text style={[styles.topics__name,theme=='dark'?styles.topics__name_dark:null]}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefresh}
                                        onRefresh={handleRefresh}
                                        tintColor="#8dc54a" />
                                }
                                ListFooterComponent={
                                    <View style={styles.topics__footer}></View>
                                }
                            />
                        </View>
                    ) : !isLoading ? (
                        <View style={styles.notfound}>
                            <Text style={styles.notfound__heading}>
                                :-\
                            </Text>
                            <Text style={styles.notfound__desc}>
                                404 Not Found.
                            </Text>
                        </View>
                    ) : <Spinner
                        visible={true}
                        color={'#8dc54a'}
                        animation={'fade'}
                        overlayColor={'rgba(255, 255, 255, .3)'}
                    />}
                </View>
            ) : <View style={styles.content}>
                <View style={styles.offline__wrap}>
                    <Image style={styles.offline__image}
                        source={require("./../assets/cloud.png")} />
                    <Text style={styles.offline__title}>No Internet Connection</Text>
                    <Text style={styles.offline__desc}>You are offline, check your connection.</Text>
                    <TouchableOpacity style={styles.offline__btn}  onPress={() => checkConnection()}><Text style={styles.offline__btn_text}>Reload</Text></TouchableOpacity>
                </View>
            </View>
            }
        </View>
    )
}

const HEADER_TEXT = {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold'
};

const PRIMARY_COLOR = '#8dc54a';
let BG_COLOR = '#f1f1f1';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
        paddingTop: 55
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    header__text_top: {
        ...HEADER_TEXT,
        fontSize: 25
    },
    header__text: {
        ...HEADER_TEXT,
        marginTop:20
    },
    header__text_secondary: {
        ...HEADER_TEXT,
        fontWeight: '500',
        fontSize: 19,
        marginTop: 0
    },
    content: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#f1f1f1',
    },
    bgLight:{
        backgroundColor: '#f1f1f1',
    },
    bgDark:{
        backgroundColor: '#444444',
    },
    content__scroller: {
        flex: 1,
    },
    topics: {
        paddingTop:20,
        paddingHorizontal: 10,
    },
    topics__item: {
        width: '50%',
        paddingBottom: 20,
    },
    topics__inner: {
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.20,
        shadowRadius: 3,
        elevation: 8,
        paddingHorizontal:10
    },
    topics__content: {
        overflow: 'hidden',
        borderRadius: 6,
    },
    topics__image: {
        height: null,
        width: '100%',
        height: 170,
        resizeMode: 'cover',
        backgroundColor: '#99b9b6'
    },
    topics__name: {
        textAlign: 'center',
        fontSize: 18,
        paddingVertical:10,
        color: '#000',
        backgroundColor: '#fff',
    },
    topics__name_dark:{
        color: '#eee',
        backgroundColor: '#666',
    },
    notfound: {
        marginTop: 150
    },
    notfound__heading: {
        fontSize: 70,
        fontWeight: '900',
        color: PRIMARY_COLOR,
        textAlign: 'center'
    },
    notfound__desc: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
    offline__wrap: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    offline__image: {
        marginBottom: 20,
    },
    offline__title: {
        fontWeight: 'bold',
        fontSize: 28,
        marginBottom: 5
    },
    offline__desc: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20
    },
    offline__btn: {
        borderRadius: 20,
        backgroundColor: '#8dc54a'
    },
    offline__btn_text: {
        color: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    topics__footer:{
        height:20
    }
});


export default Home;