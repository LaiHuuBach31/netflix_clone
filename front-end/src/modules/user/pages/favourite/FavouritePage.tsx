import React from 'react'
import './favouritePage.css';
import { Button, Col, Rate, Row, Select, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import SectionHeader from '../../components/section/SectionHeader';

const movies = [
  {
    id: 1,
    title: 'Lời Thề Nguyện Ánh Trăng',
    image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    badge: 'Top 5',
  },
  {
    id: 2,
    title: 'Hốn Ma Học Đường (Phần 1)',
    image: 'https://occ-0-3687-58.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABaXp51GeqmxqBq5ors3pR1YbCvPrYSRlEzf_uBel_vEYF0PABMM2cDJy9kUO1SnM9s3EJVYaAbamh2cXCWf8p38osPWcXYFKwSS0e7ADVm94ZbEuKXXZL0VF09Th9zm9hFAEQe5M2MhG2hA3ycdAoHFaroertXe1K1BDTeGrG0KaWcaS76wJcVDLlIV8pE5wtnmnoZ14Wb5CkA4d.webp?r=153',
    badge: 'Hoàn Tất (8t)',
  },
  {
    id: 3,
    title: 'Đấu Phá Thương Khung Ngoại Truyện',
    image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    badge: 'Top 142',
  },
  {
    id: 4,
    title: 'Gia đình Tiểu Mẫn',
    image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    badge: 'Top 9',
  },
  {
    id: 5,
    title: 'Cesium Fallout',
    image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    badge: 'Full',
  },
];

function FavouritePage() {
  return (
    <>
      <div className='favorite' style={{ flex: 1, padding: '0 100px' }}>

        <SectionHeader title="Favorite" showSelect={true} />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {movies.map((movie) => (
            <div key={movie.id} className="relative text-white">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-[220px] object-cover rounded-md"
              />
              <div
                className={`absolute top-1 left-1 px-1.5 py-0.5 text-xs font-bold text-white rounded-sm bg-red-500`}
              >
                {movie.badge}
              </div>
              <CloseCircleOutlined className="absolute top-1 right-1 text-red-500 text-xl cursor-pointer" />
              <p className="text-sm text-center mt-2 font-medium line-clamp-2 min-h-[3rem]">
                {movie.title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default FavouritePage