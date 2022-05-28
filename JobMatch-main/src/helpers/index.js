import RootSiblings from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

let id = 0;
let elements = [];

export const addSibling = (component) => {
  let sibling = new RootSiblings(component);
  id++;
  elements.push(sibling);
};

export const destroySibling = () => {
  let lastSibling = elements.pop();
  lastSibling && lastSibling.destroy();
};

export const showToast = (msg) => {
  Toast.show(msg, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
        // calls on toast\`s appear animation start
    },
    onShown: () => {
        // calls on toast\`s appear animation end.
    },
    onHide: () => {
        // calls on toast\`s hide animation start.
    },
    onHidden: () => {
        // calls on toast\`s hide animation end.
    }
});
}

export const gererateId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);

export const getMatchedUserInfo = (users, userLoggedIn) => {
   const newUsers = { ...users };
   delete newUsers[userLoggedIn]; 

   const [id, user] = Object.entries(newUsers).flat();
   return { id, ...user };
};