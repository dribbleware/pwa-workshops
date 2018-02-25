import React from 'react';
import { string } from 'prop-types';

const Picture = ({ src, alt, ...props }) => (
  <picture>
    <source srcSet={`${src}?format=webp`} type="image/webp" />
    <img scr={src} alt={alt} {...props} />
  </picture>
)

Picture.propTypes = {
  src: string.isRequired,
  alt: string,
}

export default Picture;
