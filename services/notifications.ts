
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  configure = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      // Android only
      channelId: "luna-channel-id", 
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: "luna-channel-id", 
        channelName: "Luna Channel",
        channelDescription: "Cycle reminders and updates", 
        playSound: true,
        soundName: "default",
        importance: 4, // High
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  localNotification = (title: string, message: string) => {
    PushNotification.localNotification({
      channelId: "luna-channel-id",
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
    });
  };

  scheduleNotification = (title: string, message: string, date: Date) => {
    PushNotification.localNotificationSchedule({
      channelId: "luna-channel-id",
      title: title,
      message: message,
      date: date, // new Date(Date.now() + 60 * 1000)
      allowWhileIdle: true,
    });
  };
}

export const notificationService = new NotificationService();
