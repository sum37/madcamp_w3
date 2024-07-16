import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {RouteProp} from '@react-navigation/native';

type ScoreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Score'
>;
type ScoreScreenRouterProp = RouteProp<RootStackParamList, 'Score'>;

type Props = {
  navigation: ScoreScreenNavigationProp;
  route: ScoreScreenRouterProp;
};

const transformScore = (score: number): number => {
  if (score > 2.5) return 100;
  if (score < 1.0) return 50;
  if (score >= 1.0 && score <= 1.2) return 60;
  if (score > 1.2 && score <= 1.22) return 65;
  if (score > 1.22 && score <= 1.24) return 67;
  if (score > 1.24 && score <= 1.27) return 70;
  if (score > 1.27 && score <= 1.3) return 73;
  if (score > 1.3 && score <= 1.33) return 75;
  if (score > 1.33 && score <= 1.36) return 77;
  if (score > 1.36 && score <= 1.39) return 80;
  if (score > 1.39 && score <= 1.41) return 83;
  if (score > 1.41 && score <= 1.43) return 85;
  if (score > 1.43 && score <= 1.45) return 87;
  if (score > 1.45 && score <= 1.55) return 90;
  if (score > 1.55 && score <= 1.95) return 93;
  if (score > 1.95 && score <= 2.3) return 95;
  if (score > 2.3 && score <= 2.5) return 97;
  return 0; // 기본값
};

const average = (array: (string | number)[]): number => {
  // 문자열을 숫자로 변환, 숫자는 그대로 유지
  const numbers = array.map(item =>
    typeof item === 'string' ? parseFloat(item) : item,
  );

  // 점수를 변환
  const transformedScores = numbers.map(transformScore);

  // 변환된 점수 배열의 합을 구함
  const total = transformedScores.reduce((acc, curr) => acc + curr, 0);

  // 평균 계산
  return parseFloat((total / transformedScores.length).toFixed(1));
};

const getComment = (score: number): string => {
  if (score >= 95 && score <= 100) return '아나운서 아니세요?';
  if (score >= 90 && score < 95) return '세종대왕님이 기뻐하시네요!';
  if (score >= 85 && score < 90) return '국어 공부를 하셨군요!';
  if (score >= 80 && score < 85) return '발음이 나쁘진 않아요!';
  if (score >= 75 && score < 80) return '한글을 더 공부해볼까요?';
  if (score >= 70 && score < 75) return '한글을 차근차근 배워보아요!';
  return '한글을 더 차근차근 배워보아요!';
};

const ScoreScreen: React.FunctionComponent<Props> = ({navigation, route}) => {
  const [scores, setScores] = useState<string[]>(route.params?.scores || []);

  const transformedScores = scores.map(score =>
    transformScore(parseFloat(score)),
  );

  const averageScore = average(scores);

  return (
    <View style={styles.container}>
      <LottieView
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../assets/lottie/confetti.json')}
        autoPlay
        loop={false}
      />
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{averageScore}</Text>
        <Text style={styles.comment}>{getComment(averageScore)}</Text>
      </View>

      <View style={styles.roundContainer1}>
        <View style={styles.round}>
          <Text style={styles.roundText}>1ROUND</Text>
          <Text style={styles.roundScoreText}>{transformedScores[0]}</Text>
        </View>
        <View style={styles.round}>
          <Text style={styles.roundText}>2ROUND</Text>
          <Text style={styles.roundScoreText}>{transformedScores[1]}</Text>
        </View>
      </View>

      <View style={styles.roundContainer2}>
        <View style={styles.round}>
          <Text style={styles.roundText}>3ROUND</Text>
          <Text style={styles.roundScoreText}>{transformedScores[2]}</Text>
        </View>
        <View style={styles.round}>
          <Text style={styles.roundText}>4ROUND</Text>
          <Text style={styles.roundScoreText}>{transformedScores[3]}</Text>
        </View>
      </View>

      <View style={styles.roundContainer3}>
        <View style={styles.round}>
          <Text style={styles.roundText}>5ROUND</Text>
          <Text style={styles.roundScoreText}>{transformedScores[4]}</Text>
        </View>
        <View style={styles.round}>
          <Text style={styles.roundText}>6ROUND</Text>
          <Text style={styles.roundScoreText}>{transformedScores[5]}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonText}>메인화면</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Ranking', {
              fromScoreScreen: true,
              score: averageScore, // 실제 점수로 대체
            } as const)
          }>
          <Text style={styles.buttonText}>저장하기</Text>
        </TouchableOpacity>
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
  scoreContainer: {
    width: 320,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
    position: 'absolute',
  },
  scoreText: {
    fontSize: 120,
    fontFamily: 'Dongle-Bold',
  },
  comment: {
    fontSize: 40,
    fontFamily: 'Dongle-Bold',
  },
  roundContainer1: {
    flexDirection: 'row',
    height: 80,
    position: 'absolute',
    top: 380,
  },
  roundContainer2: {
    flexDirection: 'row',
    height: 80,
    position: 'absolute',
    top: 480,
  },
  roundContainer3: {
    flexDirection: 'row',
    height: 80,
    top: 580,
    position: 'absolute',
  },
  round: {
    width: 100,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundText: {
    fontSize: 20,
    fontFamily: 'Dongle-Regular',
  },
  roundScoreText: {
    fontSize: 20,
    fontFamily: 'Dongle-Regular',
  },
  buttonContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
  },
  button: {
    height: 60,
    width: 150,
    borderRadius: 30,
    backgroundColor: '#FFFDF1',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 35,
    color: '#706DFF',
    fontFamily: 'Dongle-Bold',
  },
});

export default ScoreScreen;
