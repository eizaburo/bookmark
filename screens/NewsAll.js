import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Card, Input, Button, ListItem } from 'react-native-elements';

import Firebase, { db } from '../config/Firebase';
import moment from 'moment';
import lodash from 'lodash';

//redux
import { connect } from 'react-redux';
import { updateBookmark } from '../actions/userAction';

class NewsAll extends React.Component {

    state = {
        newsData: [], //newsの一覧
    }

    getNewsData = async () => {

        //firebaseからデータ取得
        const snapshots = await db.collection('news')
            .orderBy('createdAt', 'desc').get();
        const newsData = snapshots.docs.map(doc => doc.data());

        //newsデータをstateにセット
        this.setState({
            newsData: newsData,
        });
    }

    componentDidMount = async () => {
        try {
            //リモートDB(Firebase）からデータ取得
            await this.getNewsData();
        } catch (e) {
            console.log(e);
        }
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
        // console.log(this.props.userData.bookmark);
        return (
            <View style={{ flex: 1 }}>
                <Button
                    title="中身確認"
                    onPress={() => {
                        // console.log(this.state.bookmarkJson);
                        console.log(this.props.userData.bookmark);
                    }}
                />
                <FlatList
                    data={this.state.newsData}
                    extraData={this.props.userData.bookmark} //これが無いとFlatlist内の情報がsetStateでupdateされない
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item }) => (
                        <ListItem
                            title={item.title}
                            subtitle={moment(item.createdAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')}
                            bottomDivider
                            onPress={() => this.handleOnPress(item)}
                            // onLongPress={() => this.handleOnPress(item)}
                            // bookmarkの状態により背景色を変更
                            containerStyle={lodash.filter(this.props.userData.bookmark, { 'newsId': item.newsId }).length == 1 ? { backgroundColor: "#f00" } : { backgroundColor: "#0f0" }}
                        />
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewsAll);
