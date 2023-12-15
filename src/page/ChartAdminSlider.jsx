import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import Slider from "react-slick";

function ChartAdminSlider({ setSlideIndex }) {
  //Untuk mengatur setting pada slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setSlideIndex(next),
  };
  return (
    <div className="flex items-center justify-center h-full">
      <Slider {...settings} className="w-full h-72 mx-auto">
        <ChartDataKaryawan />
        <ChartDataKehadiran />
        <ChartDataKehadiranUser />
      </Slider>
    </div>
  );
}
export default ChartAdminSlider;
