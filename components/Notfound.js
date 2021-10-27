import React, { useContext } from 'react';
import {View,Text,StyleSheet,Image, TouchableOpacity} from 'react-native';
import { ThemeContext } from './context';

const Notfound = (props) => {

    const theme = useContext(ThemeContext);

    const getStyles = (name)=>{
        return [styles[name], theme.color=='dark'? dark[name]:null];
    }

    return (
        <View style={styles.notfound}>
            <Text style={getStyles('notfound__heading')}>
                :-\
            </Text>
            <Text style={getStyles('notfound__desc')}>
                404 Not Found.
            </Text>
        </View>
    )
}
const dark = StyleSheet.create({
    notfound__heading:{
        color:'#eee'
    },
    notfound__desc:{
        color:'#ccc'
    }
});

const PRIMARY_COLOR = '#8dc54a';

const styles = StyleSheet.create({
    notfound: {
       
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
    }
});

export default Notfound;