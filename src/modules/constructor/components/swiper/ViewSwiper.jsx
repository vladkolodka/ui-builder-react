import {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";

import "swiper/css";

import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import styled from "@emotion/styled";
import {useTheme} from "@mui/material";

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const StyledSwiper = styled(Swiper)`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

function Stepper({index, size, swiper}) {
  const theme = useTheme();

  return <MobileStepper
    steps={size}
    position="static"
    activeStep={index}
    nextButton={
      <Button size="small" onClick={() => swiper.slideNext()} disabled={index === size - 1}>
        Next
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft/>
        ) : (
          <KeyboardArrowRight/>
        )}
      </Button>
    }
    backButton={
      <Button size="small" onClick={() => swiper.slidePrev()} disabled={index === 0}>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight/>
        ) : (
          <KeyboardArrowLeft/>
        )}
        Back
      </Button>
    }
  />;
}

const images = [
  'https://swiperjs.com/demos/images/nature-1.jpg',
  'https://swiperjs.com/demos/images/nature-2.jpg',
  'https://swiperjs.com/demos/images/nature-3.jpg',
  'https://swiperjs.com/demos/images/nature-4.jpg',
  'https://swiperjs.com/demos/images/nature-5.jpg',
  'https://swiperjs.com/demos/images/nature-6.jpg',
  'https://swiperjs.com/demos/images/nature-7.jpg',
  'https://swiperjs.com/demos/images/nature-8.jpg',
  'https://swiperjs.com/demos/images/nature-9.jpg',
  'https://swiperjs.com/demos/images/nature-10.jpg'
]

export default function ViewSwiper() {
  const [swiperRef, setSwiperRef] = useState(null);
  const [index, setIndex] = useState(0);

  const size = swiperRef === null ? 0 : swiperRef.slides.length;
  const galleryId = "id1";

  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: '#' + galleryId,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div style={{'width': '50%', 'margin': '0 auto'}}>
      <StyledSwiper id={galleryId} onSwiper={setSwiperRef} onSlideChange={e => setIndex(e.activeIndex)} spaceBetween={20}>
        {images.map(image => <SwiperSlide key={image}>
          <a
            itemProp="contentUrl"
            href={image}
            data-pswp-width="500"
            data-pswp-height="500"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={image}
              itemProp="thumbnail" alt="Description"
            />
          </a>

          {/*<img src={image}*/}
          {/*     // data-pswp-width={1875}*/}
          {/*     // data-pswp-height={2500}*/}
          {/*/>*/}
        </SwiperSlide>)}

        <Stepper index={index} size={size} swiper={swiperRef}/>
      </StyledSwiper>
    </div>
  );
}
