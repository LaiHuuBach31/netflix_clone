import React from 'react'
import SectionTop from '../../components/section/SectionTop'
import MediaSlider from '../../components/slider/MediaSlider'
import SectionEnd from '../../components/section/SectionEnd';

const movies = [
    {
        id: 1,
        title: 'Lời Thề Nguyện Ánh Trăng',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
    {
        id: 2,
        title: 'Hốn Ma Học Đường (Phần 1)',
        image: 'https://occ-0-3687-58.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABaXp51GeqmxqBq5ors3pR1YbCvPrYSRlEzf_uBel_vEYF0PABMM2cDJy9kUO1SnM9s3EJVYaAbamh2cXCWf8p38osPWcXYFKwSS0e7ADVm94ZbEuKXXZL0VF09Th9zm9hFAEQe5M2MhG2hA3ycdAoHFaroertXe1K1BDTeGrG0KaWcaS76wJcVDLlIV8pE5wtnmnoZ14Wb5CkA4d.webp?r=153',
    },
    {
        id: 3,
        title: 'Đấu Phá Thương Khung Ngoại Truyện',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
    {
        id: 4,
        title: 'Gia đình Tiểu Mẫn',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
    {
        id: 5,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },

    {
        id: 6,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
    {
        id: 7,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
    {
        id: 8,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
    {
        id: 9,
        title: 'Cesium Fallout',
        image: 'https://occ-0-325-395.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABfmu2vuIZlEUD7-cNVoUbcplVDy0q8ps8oDrkCQcReu3HFCoGvhoXWpuAo18EQ_Fknm5Pm7PFUIxHypScZ5PWBHbTdmUIx1OEnIG1vCPjanJMQuYzhxgY0iDn7QaDjHmRBNF.jpg?r=30b',
    },
];


const TVShowPage = () => {
    return (
        <>
            <SectionTop title="TV Shows" description="These days, the small screen has some very big things to offer. From sitcoms to dramas to travel and talk shows, these are all the best programs on TV." />

            <div className='media-slider mt-[60px] text-[white] text-white !relative mt-[20px]'>
                <MediaSlider title="Drama Movies Based on Books" movies={movies} slidesPerView={5} spaceBetween={10} height={150} />
            </div>

            <SectionEnd />

        </>
    )
}

export default TVShowPage