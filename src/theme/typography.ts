export const fonts = {
  regular: 'JetBrainsMono-Regular',
  medium: 'JetBrainsMono-Medium',
  bold: 'JetBrainsMono-Bold',
  italic: 'JetBrainsMono-Italic',
  mediumItalic: 'JetBrainsMono-MediumItalic',
  boldItalic: 'JetBrainsMono-BoldItalic',
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

  bodyItalic: {
    fontFamily: fonts.italic,
    fontSize: 16,
    fontWeight: '400',
  },

  bodyMediumItalic: {
    fontFamily: fonts.mediumItalic,
    fontSize: 16,
    fontWeight: '500',
  },

  bodyBoldItalic: {
    fontFamily: fonts.boldItalic,
    fontSize: 16,
    fontWeight: '700',
  },

  metadataItalic: {
    fontFamily: fonts.italic,
    fontSize: 14,
    fontWeight: '400',
  },

  metadataMediumItalic: {
    fontFamily: fonts.mediumItalic,
    fontSize: 14,
    fontWeight: '500',
  },

  metadataBoldItalic: {
    fontFamily: fonts.boldItalic,
    fontSize: 14,
    fontWeight: '700',
  },
} as const;
