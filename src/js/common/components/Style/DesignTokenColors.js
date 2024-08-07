const primitiveColorNames = {
  blue50: '#E6F3FF',
  blue600: '#0858A1',
  blue700: '#074986',
  blue900: '#042B4E',
  blueUI50: '#E2F2FD',
  blueUI700: '#1073D4',
  blueUI800: '#0E62C2',
  blueUI900: '#0943A3',
  grayUI50: '#EEEEEE',
  grayUI100: '#DADADA',
  grayUI200: '#C5C5C5',
  grayUI300: '#B0B0B0',
  grayUI400: '#9A9A9A',
  grayUI500: '#848484',
  grayUI600: '#6E6E6E',
  grayUI700: '#575757',
  grayUI800: '#4A4A4A',
  greenUI300: '#5DB664',
  redUI400: '#F3363D',
  redUI500: '#EF0716',
  red500: '#CB2649',
  red600: '#AA203D',
  red800: '#74162A',
  steel200: '#C8D4DF',
  white: '#FFFFFF',
};

// New Colors:
// darkGold: A0910F
// darkGreen: 516126
// teal: 06A998
// green: 4F9A49
// lightPurple: 6362E8
// blue: 375FB8
// purple: 5B12B8
// lightBlue: 0276CE
// orange: E16C3D
// red: D1171E
// hotPink: 9E0173
// pink: 8f5573
// brown: 5A401B

// These are semanticColorNames
const DesignTokenColors = {
  alert400: primitiveColorNames.redUI400,
  alert500: primitiveColorNames.redUI500,
  confirmation300: primitiveColorNames.greenUI300,
  info50: primitiveColorNames.blueUI50,
  info700: primitiveColorNames.blueUI700,
  info800: primitiveColorNames.blueUI800,
  info900: primitiveColorNames.blueUI900,
  neutralUI50: primitiveColorNames.grayUI50,
  neutralUI100: primitiveColorNames.grayUI100,
  neutralUI200: primitiveColorNames.grayUI200,
  neutralUI300: primitiveColorNames.grayUI300,
  neutralUI400: primitiveColorNames.grayUI400,
  neutralUI500: primitiveColorNames.grayUI500,
  neutralUI600: primitiveColorNames.grayUI600,
  neutralUI700: primitiveColorNames.grayUI700,
  neutralUI800: primitiveColorNames.grayUI800,
  primary50: primitiveColorNames.blue50,
  primary600: primitiveColorNames.blue600,
  primary700: primitiveColorNames.blue700,
  primary900: primitiveColorNames.blue900,
  secondary200: primitiveColorNames.steel200,
  tertiary500: primitiveColorNames.red500,
  tertiary600: primitiveColorNames.red600,
  tertiary800: primitiveColorNames.red800,
  whiteUI: primitiveColorNames.white,
};

export default DesignTokenColors;
