import { createTheme, type CSSVariablesResolver } from '@mantine/core';

// Adapted from theme-factory's Forest Canopy and Desert Rose palettes.
export const palette = {
  paper: '#f7f3ea',
  paperGlow: '#fffaf2',
  surface: '#fdfaf4',
  ink: '#3d3b32',
  body: '#575a4c',
  muted: '#616657',
  line: '#deddd0',
  primary: '#4b624b',
  primaryDeep: '#304737',
  primarySoft: '#e6eadf',
  accent: '#9b5945',
  accentSoft: '#f1e3d7',
  sand: '#eee6d8',
  gold: '#c5ab76',
  mapWater: '#e9ede2',
  mapGlow: '#f2f3e9',
  mapLand: '#fcf8ec',
  mapBorder: '#bdc7b1',
  dark: '#293c31',
  darkGlow: '#465c48',
  worldLand: '#526751',
  worldBorder: '#344939',
  worldVisited: '#a3ad82',
  onDark: '#f5f1e5',
  onDarkMuted: '#d1d9c7',
  viewerDark: '#202820',
};

export const theme = createTheme({
  primaryColor: 'forest',
  primaryShade: { light: 7, dark: 4 },
  fontSizes: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px' },
  colors: {
    forest: ['#f0f3ea', '#e6eadf', '#d2dcc7', '#b8c8ac', '#9aae8e', '#7f9674', '#667f60', palette.primary, '#3d543e', palette.primaryDeep],
    clay: ['#fbf0e9', palette.accentSoft, '#e8caba', '#dbaf98', '#ca8e72', '#b66f52', palette.accent, '#884c3b', '#744032', '#60352b'],
    gray: ['#f8f6ef', '#efeee5', '#e0dfd3', '#cccebe', '#b1b6a5', '#949c8a', '#7d8573', palette.muted, '#535a4b', palette.ink],
    dark: ['#cbd0c2', '#b0b8a7', '#949e89', '#78856d', '#626f56', '#535f48', '#46543d', '#3b4933', '#303d2a', '#263323'],
  },
  fontFamily: 'Poppins, "PingFang SC", "Microsoft YaHei", sans-serif',
  headings: { fontFamily: 'Lora, "Songti SC", Georgia, serif', fontWeight: '400' },
  defaultRadius: 'md',
  components: {
    Button: { defaultProps: { radius: 'xl', size: 'sm' } },
    ActionIcon: { defaultProps: { radius: 'xl', size: 'lg' } },
    Select: { defaultProps: { radius: 'md', size: 'sm', maxDropdownHeight: 250 } },
    Modal: { defaultProps: { radius: 'lg', centered: true, overlayProps: { backgroundOpacity: 0.65, blur: 5 } } },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: Object.fromEntries(Object.entries(palette).map(([name, value]) => [
    `--atlas-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value,
  ])),
  light: {
    '--mantine-color-body': palette.paper,
    '--mantine-color-text': palette.ink,
    '--mantine-color-dimmed': palette.muted,
  },
  dark: {},
});
