/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  BackHandler,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {AudioUtils, AudioRecorder} from 'react-native-audio';
import axios from 'axios';
import Mic from './micComponent';

import {RootStackParamList} from '../App';

type PlayingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Playing1'
>;
type PlayingScreenRouterProp = RouteProp<RootStackParamList, 'Playing1'>;

type Props = {
  navigation: PlayingScreenNavigationProp;
  route: PlayingScreenRouterProp;
};

type ScriptType = {
  content: string;
  level: string;
};

const {width, height} = Dimensions.get('window');

const getRandomElements = <T,>(array: T[], count: number): T[] => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PlayingScreen1: React.FunctionComponent<Props> = ({
  navigation,
  route,
}) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [scripts, setScripts] = useState<ScriptType[]>([]);
  const [scores, setScores] = useState<number[]>([]); // 점수를 저장할 상태
  const {hasPermission} = route.params;
  const [recording, setRecording] = useState(false);
  const [recordingFinished, setRecordingFinished] = useState(false);
  const [audioPath] = useState(`${AudioUtils.DocumentDirectoryPath}/test.aac`);
  const [timerFinished, setTimerFinished] = useState(false);
  const [base64String, setBase64String] = useState('');
  const [isCancelled, setIsCancelled] = useState(false); // 녹음이 취소되었는지 여부를 나타내는 상태 변수

  const getScript = async () => {
    try {
      const response = await axios.get('http://143.248.219.68:3000/scripts');
      const filteredScripts = response.data.map((script: any) => ({
        content: script.content,
        level: script.level,
      }));
      const randomScripts: ScriptType[] = getRandomElements(filteredScripts, 6);
      setScripts(randomScripts);
      console.log(randomScripts);
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const getDuration = (level: string) => {
    switch (level) {
      case '1':
        return 1500;
      default:
        return 3000;
    }
  };

  useEffect(() => {
    getScript();
  }, []);

  const startTimer = (duration: number) => {
    setTimerFinished(false);
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        setTimerFinished(true);
      }
    });
  };

  useEffect(() => {
    if (hasPermission) {
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 16000,
        Channels: 1,
        AudioQuality: 'High',
        AudioEncoding: 'aac',
        IncludeBase64: true,
      });

      AudioRecorder.onFinished = data => {
        setRecordingFinished(data.status === 'OK');
        setBase64String(data.base64);
      };
    }
  }, [hasPermission]);

  useEffect(() => {
    if (recording) {
      stopRecording();
    }
  }, [timerFinished]);

  useEffect(() => {
    if (recordingFinished && base64String && !isCancelled) {
      sendPost();
    }
  }, [recordingFinished, base64String]);

  const sendPost = async () => {
    try {
      const response = await axios.post(
        'http://143.248.219.68:3000/users/evaluate-pronunciation',
        {
          audioData: base64String,
          script: scripts[0].content,
        },
      );
      let {score} = response.data;

      if (isNaN(score)) {
        score = 1.0;
      }

      console.log('Score:', score);
      setScores([...scores, score]); // 점수를 배열에 추가

      navigation.navigate('Playing2', {
        scores: [...scores, score],
        scripts: scripts.slice(1),
      });
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  useEffect(() => {
    if (scripts.length > 0) {
      startRecording();
      startTimer(getDuration(scripts[0].level));
    }
  }, [scripts, hasPermission]);

  const startRecording = async () => {
    if (!hasPermission) {
      return Alert.alert('Permission', 'Microphone permission not granted');
    }

    if (recording) {
      return Alert.alert('Recording', 'Already recording');
    }

    try {
      await AudioRecorder.startRecording();
      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      return Alert.alert('Recording', 'Not currently recording');
    }

    try {
      await AudioRecorder.stopRecording();
      setRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [recording]);

  const handleBackPress = async () => {
    progress.stopAnimation();
    Alert.alert(
      '정말 나가시겠습니까?',
      '기록은 저장되지 않습니다',
      [
        {
          text: '취소',
          onPress: () =>
            scripts.length > 0 && startTimer(getDuration(scripts[0].level)),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            if (recording) {
              await stopRecording();
            }
            setIsCancelled(true); // 녹음 취소 상태로 설정
            navigation.navigate('Main');
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    console.log(recording, stopRecording);
  }, [recording, stopRecording]);

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  const barColor = progress.interpolate({
    inputRange: [0, 160 / 220, 200 / 220, 1],
    outputRange: ['#A0EEFF', '#A0EEFF', '#FF5C5C', '#FF5C5C'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={handleBackPress}>
        <Image
          style={styles.backIcon}
          source={require('../assets/image/arrow_back.png')}
        />
      </TouchableOpacity>

      <View style={styles.checkContainer}>
        <View style={styles.checkCircle}>
          <Image
            style={styles.circleImage}
            source={require('../assets/image/circle.png')}
          />
        </View>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.checkCircle} />
        ))}
      </View>

      <View style={styles.timeBarContainer}>
        <Image
          style={styles.clockImage}
          source={require('../assets/image/alarm.png')}
        />
        <View style={styles.barBack} />
        <Animated.View
          style={[
            styles.timeBar,
            {width: animatedWidth, backgroundColor: barColor},
          ]}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{scripts[0]?.content}</Text>
      </View>

      <View style={styles.micContainer}>
        <LottieView
          style={{width: '30%', height: '100%'}}
          source={require('../assets/lottie/soundwave.json')}
          autoPlay
          loop={true}
        />
        <View style={styles.micButton}>
          <Mic />
        </View>
        <LottieView
          style={{width: '30%', height: '100%'}}
          source={require('../assets/lottie/soundwave.json')}
          autoPlay
          loop={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFED8D',
    alignItems: 'center',
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'center',
  },
  backIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    marginTop: 10,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  checkCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#FFFDF1',
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleImage: {
    width: 27,
    height: 27,
  },
  currentQuestionIndicator: {
    width: 35 / 2,
    height: 35 / 2,
    borderRadius: 35 / 4,
    backgroundColor: '#706DFF',
    position: 'absolute',
  },
  timeBarContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    height: height * 0.08,
    width: width * 0.8,
  },
  clockImage: {
    width: 45,
    height: 60,
    position: 'absolute',
    left: 5,
    top: -10,
  },
  barBack: {
    position: 'absolute',
    height: 30,
    width: 220,
    left: 60,
    top: 10,
    borderRadius: 15,
    backgroundColor: '#FFFDF1',
  },
  timeBar: {
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    left: 60,
    top: 10,
  },
  textContainer: {
    width: width * 0.8,
    height: height * 0.35,
    borderRadius: 30,
    backgroundColor: '#FFFDF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 60,
    color: 'black',
    //fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Dongle-Bold',
  },
  micContainer: {
    width: 320,
    height: 120,
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  micButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#FFFDF1',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micImage: {
    width: '100%',
    height: '100%',
  },
});

export default PlayingScreen1;
