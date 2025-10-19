// import { Link } from "react-router-dom";
import BannerSlider from "./Home/components/Banner";
import type { BannerImage } from "./Home/components/Banner";
import { Movies } from "./Home/components/Movies";
  
const slides: BannerImage[] = [
  {src: '../public/images/banner1.png', alt: 'Banner 1'},
  {src: '../public/images/banner2.png', alt: 'Banner 2'},
  {src: '../public/images/banner3.png', alt: 'Banner 3'},
  {src: '../public/images/banner4.png', alt: 'Banner 4'},
  {src: '../public/images/banner5.png', alt: 'Banner 5'},
  {src: '../public/images/banner6.png', alt: 'Banner 6'},
  {src: '../public/images/banner7.png', alt: 'Banner 7'},
];

function Home() {
  return (
    <div>
      <BannerSlider images={slides} height="h-130"/>
      <Movies />
    </div>
  );
}

export default Home;
