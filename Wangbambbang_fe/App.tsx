import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './src/MainScreen';
import PlayingScreen1 from './src/PlayingScreen1';
import PlayingScreen2 from './src/PlayingScreen2';
import PlayingScreen3 from './src/PlayingScreen3';
import PlayingScreen4 from './src/PlayingScreen4';
import PlayingScreen5 from './src/PlayingScreen5';
import PlayingScreen6 from './src/PlayingScreen6';
import ScoreScreen from './src/ScoreScreen';
import RankingScreen from './src/RankingScreen';
import {RankingProvider} from './src/RankingContext';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';

type ScriptType = {
  content: string;
  level: string;
};

export type RootStackParamList = {
  Main: undefined;
  Ranking:
    | {
        fromScoreScreen?: boolean;
        score?: number;
      }
    | undefined;
  Playing1: {hasPermission: boolean};
  Playing2: {scores: string[]; scripts: ScriptType[]};
  Playing3: {scores: string[]; scripts: ScriptType[]};
  Playing4: {scores: string[]; scripts: ScriptType[]};
  Playing5: {scores: string[]; scripts: ScriptType[]};
  Playing6: {scores: string[]; scripts: ScriptType[]};
  Score: {scores: string[]};
};

const Stack = createStackNavigator<RootStackParamList>();

// 글로벌 텍스트 스타일 설정
const customTextProps = {
  style: {
    fontFamily: 'Dongle-Regular', // 기본 폰트 설정
  },
};

const customTextInputProps = {
  style: {
    fontFamily: 'Dongle-Regular', // 기본 폰트 설정
  },
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);

function App(): React.JSX.Element {
  return (
    <RankingProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Playing1"
            component={PlayingScreen1}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Playing2"
            component={PlayingScreen2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Playing3"
            component={PlayingScreen3}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Playing4"
            component={PlayingScreen4}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Playing5"
            component={PlayingScreen5}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Playing6"
            component={PlayingScreen6}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Score"
            component={ScoreScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Ranking"
            component={RankingScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RankingProvider>
  );
}

export default App;
