import { Provider } from 'react-redux';
import { store } from './src/store';
import { RootSiblingParent } from 'react-native-root-siblings';
import { LogBox } from "react-native"
import MainNavigator from './src/navigation';

import 'react-native-gesture-handler';
import './src/config/firebase';

export default function App() {
  LogBox.ignoreAllLogs(true)
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </RootSiblingParent>
  );
}
