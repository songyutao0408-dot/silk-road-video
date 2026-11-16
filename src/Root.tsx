import React from 'react';
import {AbsoluteFill, Composition, getInputProps, Still} from 'remotion';
import {SafeGuides} from './components/Base';
import {Cover} from './Cover';
import {Shot01, shot01} from './shots/Shot01';
import {Shot02, shot02} from './shots/Shot02';
import {Shot03, shot03} from './shots/Shot03';
import {Shot04, shot04} from './shots/Shot04';
import {Shot05, shot05} from './shots/Shot05';
import {Shot06, shot06} from './shots/Shot06';
import {Shot07, shot07} from './shots/Shot07';
import {Shot08, shot08} from './shots/Shot08';
import {Shot09, shot09} from './shots/Shot09';
import {Shot10, shot10} from './shots/Shot10';
import {Shot11, shot11} from './shots/Shot11';
import {Shot12, shot12} from './shots/Shot12';
import {Shot13, shot13} from './shots/Shot13';
import {FPS, H, W} from './theme';
import {ShotData, shotFrames} from './timing';

const guides = Boolean((getInputProps() as {guides?: boolean}).guides);
const wrap = (Comp: React.FC): React.FC => () => (
  <AbsoluteFill>
    <Comp />
    {guides && <SafeGuides />}
  </AbsoluteFill>
);
const SHOTS: [React.FC, ShotData][] = [
  [wrap(Shot01), shot01],
  [wrap(Shot02), shot02],
  [wrap(Shot03), shot03],
  [wrap(Shot04), shot04],
  [wrap(Shot05), shot05],
  [wrap(Shot06), shot06],
  [wrap(Shot07), shot07],
  [wrap(Shot08), shot08],
  [wrap(Shot09), shot09],
  [wrap(Shot10), shot10],
  [wrap(Shot11), shot11],
  [wrap(Shot12), shot12],
  [wrap(Shot13), shot13],
];
const CoverComp = wrap(Cover);

export const Root: React.FC = () => (
  <>
    {SHOTS.map(([Comp, data]) => (
      <Composition key={data.id} id={`Shot${String(data.id).padStart(2, '0')}`} component={Comp} width={W} height={H} fps={FPS} durationInFrames={shotFrames(data)} />
    ))}
    <Still id="Cover" component={CoverComp} width={W} height={H} />
  </>
);
