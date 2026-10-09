export const fonts = {
  regular: 'JetBrainsMono-Regular',
  medium: 'JetBrainsMono-Medium',
  bold: 'JetBrainsMono-Bold',
} as const;

export const typography = {
  remainingAmount: {
    fontFamily: fonts.medium,
    fontSize: 40,
    fontWeight: '500',
  },

  screenHeading: {
    fontFamily: fonts.regular,
    fontSize: 26,
    fontWeight: '400',
  },

  sectionHeading: {
    fontFamily: fonts.medium,
    fontSize: 19,
    fontWeight: '500',
  },

  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    fontWeight: '400',
  },

  bodyImportant: {
    fontFamily: fonts.medium,
    fontSize: 16,
    fontWeight: '500',
  },

  metadata: {
    fontFamily: fonts.regular,
    fontSize: 14,
    fontWeight: '400',
  },
} as const;
