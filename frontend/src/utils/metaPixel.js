import ReactPixel from 'react-facebook-pixel';

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

export const initMetaPixel = () => {
  if (META_PIXEL_ID) {
    ReactPixel.init(META_PIXEL_ID, {}, { autoConfig: true, debug: false });
    ReactPixel.pageView();
  }
}
