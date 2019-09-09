import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

import { ContextNotInProviderError } from './helpers';

type SetMediaStreamConstraints = Dispatch<
  SetStateAction<MediaStreamConstraints>
>;
const SettingsContext = createContext<MediaStreamConstraints | undefined>(
  undefined,
);
const SetSetgingsContext = createContext<SetMediaStreamConstraints | undefined>(
  undefined,
);

const defaultSettings: MediaStreamConstraints = { video: true, audio: true };

const SettingsProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  return (
    <SetSetgingsContext.Provider value={setSettings}>
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </SetSetgingsContext.Provider>
  );
};

const useSettings = (): MediaStreamConstraints => {
  const settings = useContext(SettingsContext);

  if (settings === undefined) {
    throw new ContextNotInProviderError();
  }

  return settings;
};

const useSetSettings = (): SetMediaStreamConstraints => {
  const setSettings = useContext(SetSetgingsContext);

  if (setSettings === undefined) {
    throw new ContextNotInProviderError();
  }

  return setSettings;
};

const useToggleAudio = () => {
  const setSettings = useSetSettings();

  return () =>
    setSettings(currSettings => ({
      ...currSettings,
      audio: !currSettings.audio,
    }));
};

const useToggleVideo = () => {
  const setSettings = useSetSettings();

  return () =>
    setSettings(currSettings => ({
      ...currSettings,
      video: !currSettings.video,
    }));
};

export { SettingsProvider, useSettings, useToggleAudio, useToggleVideo };
