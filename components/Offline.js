import React, { useContext } from 'react';
import {View,Text,StyleSheet,Image, TouchableOpacity} from 'react-native';
import { ThemeContext } from './context';

const Offline = (props) => {

    const theme = useContext(ThemeContext);

    const getStyles = (name)=>{
        return [styles[name], theme.color=='dark'? dark[name]:null];
    }

    return (
        <View style={styles.offline__wrap}>
            <Image style={styles.offline__image}
                source={require("./../assets/cloud.png")} />
            <Text style={getStyles('offline__title')}>No Internet Connection</Text>
            <Text style={getStyles('offline__desc')}>You are offline, check your connection.</Text>
            <TouchableOpacity style={styles.offline__btn} onPress={() => props.checkConnection()}><Text style={styles.offline__btn_text}>Reload</Text></TouchableOpacity>
        </View>
    )
}
const dark = StyleSheet.create({
    offline__title: {
        color:'#eee'
    },
    offline__desc: {
        color:'#ccc'
    }
});

const styles = StyleSheet.create({
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
    }
});

export default Offline;