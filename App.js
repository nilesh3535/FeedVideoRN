import React, {useRef, useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather';
import Antd from 'react-native-vector-icons/AntDesign';
import Oct from 'react-native-vector-icons/Octicons';
import Ion from 'react-native-vector-icons/Ionicons';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {data} from './src/constants/data';

const {height, width} = Dimensions.get('window');
const App = () => {
  const videoRef = useRef(null);
  const [text, onChangeText] = useState('');
  const [currentIndex, setIndex] = useState(0);
  const [alldata, setData] = useState(null);
  axios.get('https://api.socialverseapp.com/feed?page=2').then(response => {
    //console.log('data_______________', response.data.posts);
    let alldata = [];
    response.data.posts.map(id => {
      console.log('title:', id.title);
      console.log('Desp:', id.category.description);
      console.log('user:', id.username);
      console.log('Pic url:', id.picture_url);
      console.log('Like cnt:', id.category.count);
      console.log('comment cnt:', id.comment_count);
      console.log('share cnt:', id.share_count);
      console.log('Thumb url:', id.thumbnail_url);
      console.log('Video url:', id.video_link);
      alldata.push({
        title: id.title,
        description: id.category.description,
        username: id.username,
        userpic: id.picture_url,
        like_count: id.category.count,
        comment_count: id.comment_count,
        share_count: id.share_count,
        thumburl: id.thumbnail_url,
        videourl: id.video_link,
      });
    });
    setData(alldata);
  });

  const onBuffer = e => {
    console.log('buffering...', e);
  };
  const onError = e => {
    console.log('error raised', e);
  };

  useEffect(() => {
    //console.log('VideoRef', videoRef);
    if (!!videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currentIndex]);

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, height: height, width: width}}>
        <Video
          source={{
            uri: item.videourl,
          }}
          poster={item.thumburl}
          posterResizeMode="cover"
          ref={videoRef}
          resizeMode="cover"
          repeat
          paused={currentIndex !== index}
          //paused={true}
          onBuffer={onBuffer}
          onError={onError}
          style={styles.backgroundVideo}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
          style={styles.bottomView}>
          <View style={{flexDirection: 'row-reverse'}}>
            <View style={{flexDirection: 'column'}}>
              <TouchableOpacity style={styles.opebtn}>
                <Antd name="heart" color={'white'} size={20} />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                {item.like_count}
              </Text>
              <TouchableOpacity style={styles.opebtn}>
                <Oct name="comment" color={'white'} size={20} />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                {item.comment_count}
              </Text>
              <TouchableOpacity style={styles.opebtn}>
                <Feather name="share-2" color={'white'} size={20} />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Share
              </Text>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                {item.share_count}
              </Text>
              <TouchableOpacity style={styles.opebtn}>
                <Oct name="screen-full" color={'white'} size={20} />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                View
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: item.userpic,
              }}
              style={styles.profileImg}
            />
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              @{item.username}
            </Text>
            <TouchableOpacity style={styles.subscribebtn}>
              <Text style={{color: 'white'}}>subscribe</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: 'white', marginLeft: 42}}>{item.title}|</Text>
            <Text style={{color: 'white', marginLeft: 10}}>#Tags</Text>
          </View>
          <View
            style={{backgroundColor: '#36454F', padding: 12, marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                onChangeText={onChangeText}
                value={text}
                style={{width: width / 1.3, color: 'white'}}
                multiline={false}
              />
              <TouchableOpacity>
                <Ion name="send" color={'white'} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const onChangeIndex = ({index}) => {
    setIndex(index);
  };
  return (
    <View style={{flex: 1, backgroundColor: 'gray'}}>
      <StatusBar barStyle={'light-content'} />
      <SwiperFlatList
        vertical={true}
        data={alldata}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onChangeIndex={onChangeIndex}
      />
      <View style={{position: 'absolute', top: 15, left: 10}}>
        <Text style={styles.textStyle}>Feeds</Text>
      </View>
      <View style={{position: 'absolute', top: 5, right: 10}}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderRadius: 20,
            padding: 8,
            marginTop: 10,
            height: 38,
            borderWidth: 0.3,
            borderColor: 'white',
            marginRight: 10,
          }}>
          <Feather name="camera" color={'white'} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    height: height,
    width: width,
  },
  flexHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 16,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  profileImg: {
    marginLeft: 15,
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
  subscribebtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginLeft: 10,
    padding: 5,
    height: 30,
    borderWidth: 0.3,
    borderColor: 'white',
  },
  opebtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 10,
    marginTop: 12,
    height: 40,
    borderWidth: 0.3,
    borderColor: 'white',
    marginRight: 10,
  },
});
