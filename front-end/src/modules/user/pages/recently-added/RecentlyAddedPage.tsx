import React from 'react'
import MediaSlider from '../../components/slider/MediaSlider'
import SectionTop from '../../components/section/SectionTop';

const mockRecentlyAdded = [
    {
        id: 1,
        title: 'Stranger Things',
        image: 'https://i.imgur.com/UePbdph.jpg',
    },
    {
        id: 2,
        title: 'Extraction 2',
        image: 'https://i.imgur.com/Nm8YjzD.jpg',
    },
    {
        id: 3,
        title: 'The Witcher',
        image: 'https://i.imgur.com/8UG2K3r.jpg',
    },
    {
        id: 4,
        title: 'Money Heist',
        image: 'https://i.imgur.com/hZ6zP7H.jpg',
    },
    {
        id: 5,
        title: 'The Night Agent',
        image: 'https://i.imgur.com/lMHVYb2.jpg',
    },
    {
        id: 6,
        title: 'Wednesday',
        image: 'https://i.imgur.com/Abt2cEz.jpg',
    },
];

const RecentlyAddedPage = () => {
    return (
        <>
            <SectionTop title="Recently Added" description="Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between. So many titles, so much to experience." />
            <MediaSlider title="New Arrivals" movies={mockRecentlyAdded} slidesPerView={5} />
        </>
    )
}

export default RecentlyAddedPage