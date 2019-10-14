import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Firebase, { db } from './config/Firebase';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

//screens
import NewsAll from './screens/NewsAll';
import NewsBookmark from './screens/NewsBookmark';

//redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer';
//persist
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; これがあるとエラーになる
import { PersistGate } from 'redux-persist/integration/react';
import { AsyncStorage } from 'react-native';

//stacks
const NewsAllStack = createStackNavigator(
    {
        NewsAll: { screen: NewsAll }
    }
);

const NewsBookmarkStack = createStackNavigator(
    {
        NewsBookmark: { screen: NewsBookmark }
    }
);

const HomeTab = createBottomTabNavigator(
    {
        NewsAll: { screen: NewsAllStack },
        NewsBookmark: { screen: NewsBookmarkStack }
    },
);

const AppContainer = createAppContainer(HomeTab);

//persist
const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist:['userData'],
}

const rootReducer = combineReducers({
    userData: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(
    //thunk
));

const persistor = persistStore(store);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppContainer />
                </PersistGate>
            </Provider>
        );
    }
}
