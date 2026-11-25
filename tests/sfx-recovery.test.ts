import { afterEach, expect, it, vi } from 'vitest';
import { InterfaceSfx } from '../apps/client/src/web/sfx';

function setup() {
  let state = 'running';
  let completeResume = () => {};
  const parameter = { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} };
  const start = vi.fn();
  const resume = vi.fn(() => new Promise<void>(resolve => {
    completeResume = () => { state = 'running'; resolve(); };
  }));
  const context = {
    get state() { return state; },
    resume,
    suspend: vi.fn(async () => { state = 'suspended'; }),
    sampleRate: 100,
    currentTime: 0,
    destination: {},
    createBuffer: () => ({ getChannelData: () => new Float32Array(500) }),
    createBufferSource: () => ({ connect() {}, start, stop() {} }),
    createBiquadFilter: () => ({ connect() {}, Q: { value: 0 }, frequency: parameter }),
    createGain: () => ({ connect() {}, gain: parameter }),
  };
  vi.stubGlobal('window', { AudioContext: function () { return context; } });
  vi.stubGlobal('document', { visibilityState: 'visible' });
  return { sfx: new InterfaceSfx(), resume, interrupt: () => { state = 'interrupted'; }, finishResume: () => completeResume(), start };
}

afterEach(() => vi.unstubAllGlobals());

it('recovers an interrupted context when the next wheel animation starts', async () => {
  const { sfx, resume, interrupt, finishResume, start } = setup();
  await sfx.unlock();
  interrupt();
  const sound = sfx.spin(4800);
  expect(resume).toHaveBeenCalledOnce();
  expect(start).not.toHaveBeenCalled();
  finishResume();
  await sound;
  expect(start).toHaveBeenCalledOnce();
});

it('does not start stale wheel audio if the wheel lands before audio resumes', async () => {
  const { sfx, interrupt, finishResume, start } = setup();
  await sfx.unlock();
  interrupt();
  const sound = sfx.spin(4800);
  sfx.finish();
  finishResume();
  await sound;
  expect(start).not.toHaveBeenCalled();
});
