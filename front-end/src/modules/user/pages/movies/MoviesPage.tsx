import React from 'react'
import SectionHeader from '../../components/section/SectionHeader'
import SectionTop from '../../components/section/SectionTop'
import MediaSlider from '../../components/slider/MediaSlider'
import { Button } from 'antd';
import SectionEnd from '../../components/section/SectionEnd';

const movies = [
    {
        id: 1,
        title: 'Lời Thề Nguyện Ánh Trăng',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
    {
        id: 2,
        title: 'Hốn Ma Học Đường (Phần 1)',
        image: 'https://occ-0-3687-58.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABaXp51GeqmxqBq5ors3pR1YbCvPrYSRlEzf_uBel_vEYF0PABMM2cDJy9kUO1SnM9s3EJVYaAbamh2cXCWf8p38osPWcXYFKwSS0e7ADVm94ZbEuKXXZL0VF09Th9zm9hFAEQe5M2MhG2hA3ycdAoHFaroertXe1K1BDTeGrG0KaWcaS76wJcVDLlIV8pE5wtnmnoZ14Wb5CkA4d.webp?r=153',
    },
    {
        id: 3,
        title: 'Đấu Phá Thương Khung Ngoại Truyện',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
    {
        id: 4,
        title: 'Gia đình Tiểu Mẫn',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
    {
        id: 5,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },

    {
        id: 6,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
    {
        id: 7,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
    {
        id: 8,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
    {
        id: 9,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABa5bAzDWiD-KKBZx2hvKqr-gTWoanPQkSfnnhe20YjI3mfL0T7182yQg4wbwLK-NmtUpcEe-UITcIOJ8sFQfqUYE7JkUQyVdvweXJjnBdApRP6Yul3U9_Cm9JxqJiL8W3v9WAokiTFOjem0n-pvt.webp?r=bf9',
    },
];


const MoviesPage = () => {
    return (
        <>
            <SectionTop title="Movies" description="Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between. So many titles, so much to experience." />

            <div className='media-slider mt-[60px] text-[white] text-white !relative mt-[20px]'>
                <MediaSlider title="Drama Movies Based on Books" movies={movies} slidesPerView={5} spaceBetween={10} height={150} />
            </div>

            <div className='media-slider mt-[60px] text-[white] text-white !relative mt-[20px]'>
                <MediaSlider title="Drama Movies Based on Books" movies={movies} slidesPerView={5} spaceBetween={10} height={150} />
            </div>

            <div className='media-slider mt-[60px] text-[white] text-white !relative mt-[20px]'>
                <MediaSlider title="Drama Movies Based on Books" movies={movies} slidesPerView={5} spaceBetween={10} height={150} />
            </div>

           <SectionEnd />
        </>
    )
}

export default MoviesPage