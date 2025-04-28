import { Button } from 'antd'
import React from 'react'

const SectionEnd = () => {
    return (
        <>
            <section className="text-white text-center py-20 px-4 mt-[20px]">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    There’s even more to watch.
                </h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10">
                    Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.
                </p>
                <Button className='bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]'>Join Now</Button>
            </section>
        </>
    )
}

export default SectionEnd