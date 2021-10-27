import React, { useState, useEffect,useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import Offline from './../components/Offline';
import Notfound from '../components/Notfound';
import Heading from '../components/Heading';
import { ThemeContext } from '../components/context';

const Home = ({ navigation,route }) => {
    
    const API_URL = 'https://vutuansw.github.io/hoctuvung/';
    const API_DATA = API_URL + 'data/topics.json';
    const API_IMAGE = API_URL + 'images/topics/';

    let [isLoading, setLoading] = useState(true);
    let [isRefresh, setRefresh] = useState(false);
    let [data, setData] = useState(null);
    let [isOffline, setIsOffline] = useState(false);
    const theme = useContext(ThemeContext);

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
            if(state.isConnected){
                fetchTopics('?v=1.0.6');
            }
        });
    }

    const getStyles = (name)=>{
        return [styles[name],theme.color=='dark'?dark[name]:null];
    }
    
    useEffect(() => {
        checkConnection();
    },[isOffline]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Heading/>
            
            {!isOffline ? (
                <View style={getStyles('content')}>
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
                                            <Text style={getStyles('topics__name')}>{item.title}</Text>
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
                        <View style={{marginTop:150}}><Notfound/></View>
                    ) : <Spinner
                        visible={true}
                        color={'#8dc54a'}
                        animation={'fade'}
                        overlayColor={'rgba(255, 255, 255, .3)'}
                    />}
                </View>
            ) :  <View style={getStyles('content')}>
                <Offline checkConnection={checkConnection}></Offline>
            </View>
            }
        </View>
    )
}

const PRIMARY_COLOR = '#8dc54a';

const dark = StyleSheet.create({
    content:{
        backgroundColor: '#444444',
    },
    topics__name:{
        color: '#eee',
        backgroundColor: '#666',
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
        paddingTop: 55
    },
    content: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#f1f1f1',
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
    topics__footer:{
        height:20
    }
});


export default Home;