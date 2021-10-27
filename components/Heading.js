import React from 'react';
import {View,Text,StyleSheet} from 'react-native';


const Heading = (props) => {
    return (
        <View style={styles.header}>
                <Text style={styles.header__text}>Green Berry</Text>
                <Text style={styles.header__text_secondary}>Learn English effectively for kids</Text>
            </View>
    )
}

const HEADER_TEXT = {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold'
};

const styles = StyleSheet.create({
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
});

export default Heading;