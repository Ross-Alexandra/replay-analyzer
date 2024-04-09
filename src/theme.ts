const background = '#1F2D3D';
const layer = '#34495ECC';
const subLayer = '#FFFFFF20';
const border = '#34495E';
const tableBorder = '#FFFFFF40';
const text = '#F8F9FA';

const primary = '#3E5F75';
const secondary = '#34495E';
const tertiary = '#9BAABB';

export const colors = {
    background,
    layer,
    subLayer,
    border,
    tableBorder,
    text,
    primary,
    secondary,
    tertiary,
    white: '#FFFFFF',
    black: '#000000'
};

const primaryGradient = [background, primary];
const secondaryGradient = [secondary, tertiary];
const tertiaryGradient = [background, border];

export const gradients = {
    primary: `linear-gradient(180deg, ${primaryGradient.join(',')})`,
    secondary: `radial-gradient(180deg, ${secondaryGradient.join(',')})`,
    tertiary: `linear-gradient(180deg, ${tertiaryGradient.join(',')})`,
};
