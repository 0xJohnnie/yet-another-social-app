'use client';

import {
  AnchorProps,
  Button,
  ButtonProps,
  createTheme,
  CSSVariablesResolver,
  rem,
} from '@mantine/core';
import { getCookie } from 'cookies-next';

import {
  _accentColor,
  _buttonRadius,
  _buttonSize,
  _darkBackgroundColor,
  _darkBackgroundColorTinted,
  _darkHoverColor,
  _darkTextColor,
  _fontWeight,
  _lightBackgroundColor,
  _lightHoverColor,
  _mainTextColor,
  _secondaryTextColor,
  _variant,
} from '@/utils/constants';

const _fontSize = rem(18);

const AnchorDefaultProps: Partial<AnchorProps> = {
  w: 500,
  underline: 'never',
};

const ButtonDefaultProps: Partial<ButtonProps> = {
  loaderProps: {
    type: 'oval',
  },
  variant: _variant,
  size: _buttonSize, //  "xs" | "sm" | "md" | "lg" | "xl"
};

const isLightTheme = getCookie('themeCookie') === 'light' ?? false;

export const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  defaultRadius: _buttonRadius, //  'xs' | 'sm' | 'md' | 'lg' | 'xl'
  primaryColor: 'dark',
  primaryShade: {
    //   dark:4,
    light: 8,
  },
  defaultGradient: {
    from: 'orange',
    to: 'yellow',
    deg: 45,
  },
  white: '#fefefe',
  black: '#0B0B0B',

  colors: {
    // override dark colors to change them for all components
    ocean: [
      '#7AD1DD',
      '#5FCCDB',
      '#44CADC',
      '#2AC9DE',
      '#1AC2D9',
      '#11B7CD',
      '#09ADC3',
      '#0E99AC',
      '#128797',
      '#147885',
    ],

    pink: [
      '#F0BBDD',
      '#ED9BCF',
      '#EC7CC3',
      '#ED5DB8',
      '#F13EAF',
      '#F71FA7',
      '#FF00A1',
      '#E00890',
      '#C50E82',
      '#AD1374',
    ],

    dark: [
      // 1st shade used in dark mode as text color
      _mainTextColor,
      // 2nd shade used in light mode as button text color .
      //  Dark mode as button bg
      '#f0eaff',
      //  3rd shade in dark mode as uneditable text color & form icon
      '#b199e7',
      //  4th shade UNKNOWN
      '#666980',
      //  5th shade in dark mode as form borders & disabled button color & URL
      '#868AB3',
      //   6th shade in dark mode as button text and border
      '#696969',
      // 7th shade in dark mode as form bg + light mode as active button
      '#222',
      // 8th shade used as bg in dark mode & URL in light mode
      //  '#110055',
      '#01010a',
      // 9th shade in dark mode as active button
      _accentColor,
      //10th shade in dark mode as active button's hover color
      _darkHoverColor,
    ],
    // Default dark mode
    darkDefault: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#01010a',
    ],
    dark2: [
      '#6A226A',
      '#681768',
      '#680C68',
      '#690069',
      '#550955',
      '#460F46',
      '#3A133A',
      '#311431',
      '#291529',
      '#231523',
    ],
    brand: [
      '#F0BBDD',
      '#ED9BCF',
      '#EC7CC3',
      '#ED5DB8',
      '#F13EAF',
      '#F71FA7',
      '#FF00A1',
      '#E00890',
      '#C50E82',
      '#AD1374',
    ],
  },
  components: {
    Button: Button.extend({
      defaultProps: ButtonDefaultProps,

      vars: (theme, props) => {
        if (isLightTheme) {
          return {
            root: {
              '--button-color': _darkTextColor,
              '--button-hover': theme.colors.dark[2],
              borderWidth: 0,
              fontWeight: '400',
            },
          };
        }

        return {
          root: {
            '--button-color': _mainTextColor,
            '--button-hover': _darkHoverColor,
            '--button-bg': _darkBackgroundColorTinted,
            '--button-bd': `1px solid ${_darkTextColor}`,
            fontWeight: _fontWeight,
            fontSize: rem(18),
          },
        };
      },
    }),

    Anchor: {
      defaultProps: AnchorDefaultProps,

      styles: () => ({
        root: {
          color: '#2AC9DE',
          fontWeight: _fontWeight,
          fontSize: _fontSize,
          /*          '&:hover': {
            textDecoration: 'underline',
          }, */
        },
      }),
    },
    // Change color of border colors
    Header: {
      styles: (theme: any) => ({
        root: { borderColor: theme.colors.dark[6] },
        fontWeight: _fontWeight,
        fontSize: _fontSize,
      }),
    },
    Navbar: {
      styles: (theme: any) => ({
        root: { borderColor: theme.colors.dark[6] },
        fontWeight: _fontWeight,
        fontSize: _fontSize,
      }),
    },

    NavLink: {
      styles: (theme: any) => ({
        root: {
          borderColor: theme.colors.dark[6],
          color: _mainTextColor,
          borderRadius: theme.defaultRadius,
          fontWeight: _fontWeight,
          fontSize: _fontSize,
        },
      }),
    },

    Footer: {
      styles: (theme: any) => ({
        root: { borderColor: theme.colors.dark[6] },
      }),
    },
  }, //  End of Components
});

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-color-dark-6': _darkHoverColor,
  },
  light: {
    '--mantine-color-text': _darkTextColor,
    '--mantine-color-body': _lightBackgroundColor,
  },
  dark: {
    '--mantine-color-body': _darkBackgroundColor,
  },
});
