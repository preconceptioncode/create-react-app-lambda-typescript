//@ts-nocheck
import { css } from "styled-components";

const sizes: any = {
  // desktop: 992,
  tablet: 768,
  phone: 576
};

const models: any = {
  x: 376
};

// Iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc: any, label: any) => {
  acc[label] = (...args: any) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      //@ts-ignore
      ${css(...args)}
    }
  `;

  return acc;
}, {});

export const iDevice = Object.keys(models).reduce((acc: any, label: any) => {
  acc[label] = (...args: any) => css`
    @media (max-width: ${models[label] /
        16}em) and (-webkit-min-device-pixel-ratio: 3) {
      //@ts-ignore
      ${css(...args)}
    }
  `;

  return acc;
}, {});
