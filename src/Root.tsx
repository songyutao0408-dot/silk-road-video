import React from 'react';
import {AbsoluteFill, Composition, getInputProps} from 'remotion';
import {SafeGuides} from './components/Base';
import {Shot01, shot01} from './shots/Shot01';
import {Shot04, shot04} from './shots/Shot04';
import {FPS, H, W} from './theme';
import {ShotData, shotFrames} from './timing';

const SHOTS: [React.FC, ShotData][] = [[Shot01, shot01], [Shot04, shot04]];
const guides = Boolean((getInputProps() as {guides?: boolean}).guides);

export const Root: React.FC = () => (
  <>
    {SHOTS.map(([Comp, data]) => {
      const Wrapped: React.FC = () => (
        <AbsoluteFill>
          <Comp />
          {guides && <SafeGuides />}
        </AbsoluteFill>
      );
      return (
        <Composition key={data.id} id={`Shot${String(data.id).padStart(2, '0')}`} component={Wrapped}
          width={W} height={H} fps={FPS} durationInFrames={shotFrames(data)} />
      );
    })}
  </>
);
