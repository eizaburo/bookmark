import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Card, Button, ListItem } from 'react-native-elements';

import Firebase, { db } from '../config/Firebase';
import moment from 'moment';
import lodash from 'lodash';

//redux
import { connect } from 'react-redux';
import { updateBookmark } from '../actions/userAction';

class NewsBookmark extends React.Component {

    state = {
        newsData: [],
        bookmarkJson: [],
    }

    handleOnPress = (item) => {

        //現在のbookmark状況をstoreから取得
        let newBookmark = lodash.cloneDeep(this.props.userData.bookmark);

        //bookmarkされているか確認
        if (lodash.filter(newBookmark, { 'newsId': item.newsId }).length >= 1) {
            console.log("include");
            //既にされていれば消す
            lodash.remove(newBookmark, (_item) => {
                return _item.newsId == item.newsId;
            })
        } else {
            console.log("not include");
            //されていなければ追加
            newBookmark.push(item);
        }

        //bookmarkに追加できる数を制限
        if (newBookmark.length > 4) {
            alert('これ以上Bookmar追加できません。')
        } else {
            this.props.updateBookmark(newBookmark);
        }

    }

    render() {

        const _data = this.props.userData.bookmark;
        //日付でソート（降順）
        _data.sort((a, b) => {
            let dateA = new Date(a.createdAt.seconds * 1000);
            let dateB = new Date(b.createdAt.seconds * 1000);
            return (dateA < dateB ? 1 : -1);
        });

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={_data}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item }) => {
                        return (
                            <ListItem
                                title={item.title}
                                subtitle={moment(item.createdAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')}
                                bottomDivider
                                onPress={() => this.handleOnPress(item)}
                            />
                        );
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => (
    {
        userData: state.userData,
    }
);

const mapDispatchToProps = dispatch => (
    {
        updateBookmark: bookmark => dispatch(updateBookmark(bookmark)),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(NewsBookmark);
