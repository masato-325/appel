import React from 'react';
import { View, Button, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WebViewScreen({ navigation, route }) {
  const [token, setToken] = React.useState(null);
  const { email, password } = route.params;
  const userState = { email, password};
    console.log('ログインから送られてきた値', userState);
  const formStatus =`
  document.getElementById('login_id').value = "${userState.email}";
  document.getElementById('password').value = "${userState.password}";
  document.getElementById('login_button').click();
  true; 
`;

  // 画面遷移が行われたときにトークンを取得する
  React.useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        console.log('storedToken', storedToken);
        setToken(storedToken);
      }
    };
    fetchToken();
  }, []);

//ログアウト処理
  const logout = async () => {
    try {
      // もしトークンがあればログアウトAPIを叩く
      if (token) {
        const response = await axios.post('http://localhost:8080/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);
        await AsyncStorage.removeItem('userToken');
        setToken(null); // Reset token in state
      }
      // ログアウト後の画面へのナビゲーションなどの処理をここに追加
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  // トークンがあればWebViewを表示し、なければログイン画面にリダイレクト
  // トークンがあればWebViewにトークンを注入
  const injectedJavaScript = token ? `window.localStorage.setItem('token', '${token}');` : "";
  console.log('中身',injectedJavaScript);



// デバック用関数
// Webviewがページのロードを開始したときに呼び出される
  const handleLoadStart = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log('Loading started: ' + nativeEvent.url);
    // urlが/logoutの場合はログアウト処理を行う
    if (nativeEvent.url.includes('/logout')) {
      // include()メソッドは、文字列が指定された文字列を含むかどうかを判断する
      console.log('ログアウトしました');
      logout();//ログアウト処理を追加
    }
  };
  // WebViewがページのロード中に進捗を報告するときに呼び出される
  const handleLoadProgress = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log('Loading progress: ' + nativeEvent.progress);
  };
  // WebViewがページのロードを完了したときに呼び出される
  const handleLoadEnd = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log('Loading finished: ' + nativeEvent.url);
  };
  // WebViewがページのロードでエラーに遭遇したときに呼び出される
  function handleError(syntheticEvent) {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
  }
  // WebViewのナビゲーション状態が変更されたときに呼び出される
  const handleNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    console.log('Navigated to: ' + url);
  };

  return (
    <View style={{ flex: 1 }}>
      {token ? (
        <WebView
          // Authorizationヘッダーをここで設定
          source={{
            uri: "http://localhost:8080/login",
            headers: { 
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }}
          injectedJavaScript={injectedJavaScript+formStatus}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={(event) => {}}
        />
      ) : (
        <View><Text>ログインしてください</Text></View>
      )}
      
    </View>
  );
}

export default WebViewScreen;
