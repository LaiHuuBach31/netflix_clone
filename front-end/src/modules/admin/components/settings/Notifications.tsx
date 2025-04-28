import { useState } from "react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { NotificationOutlined } from "@ant-design/icons";

// Define the type for the notifications state
interface NotificationsState {
  push: boolean;
  email: boolean;
  sms: boolean;
}

const Notifications = () => {
  // Type the state with the NotificationsState interface
  const [notifications, setNotifications] = useState<NotificationsState>({
    push: true,
    email: false,
    sms: true,
  });

  // Add type for the handleToggle function argument
  const handleToggle = (type: keyof NotificationsState) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type], // Toggle the specified notification type
    }));
  };

  return (
    <SettingSection icon={NotificationOutlined} title={"Notifications"}>
      {/* Push Notifications Toggle */}
      <ToggleSwitch
        label={"Push Notifications"}
        isOn={notifications.push}
        onToggle={() => handleToggle("push")}
      />
      {/* Email Notifications Toggle */}
      <ToggleSwitch
        label={"Email Notifications"}
        isOn={notifications.email}
        onToggle={() => handleToggle("email")}
      />
      {/* SMS Notifications Toggle */}
      <ToggleSwitch
        label={"SMS Notifications"}
        isOn={notifications.sms}
        onToggle={() => handleToggle("sms")}
      />
    </SettingSection>
  );
};

export default Notifications;
