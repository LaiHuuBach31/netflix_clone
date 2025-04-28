import { PlusOutlined } from '@ant-design/icons'
import { Collapse, Space } from 'antd'
import React from 'react'

const QnA = () => {
    return (
        <>
            <Space direction="vertical" className='w-full'>
                <Collapse
                    className='p-3'
                    collapsible="header"
                    items={[
                        {
                            key: '1',
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <h1 className="text-white text-[20px] font-semibold">
                                        What is Netflix?
                                    </h1>
                                    <PlusOutlined className="text-white text-[20px]" />
                                </div>
                            ),
                            children: (
                                <div className="custom-content-reason text-[17px]">
                                    Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.<br /><br />
                                    You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!
                                </div>
                            ),
                        },
                    ]}
                />
                <Collapse
                    className='p-3'
                    collapsible="header"
                    items={[
                        {
                            key: '2',
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <h1 className="text-white text-[20px] font-semibold">
                                        How much does Netflix cost?
                                    </h1>
                                    <PlusOutlined className="text-white text-[20px]" />
                                </div>
                            ),
                            children: (
                                <div className="custom-content-reason text-[17px]">
                                    Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from 70,000 ₫ to 260,000 ₫ a month. No extra costs, no contracts.
                                </div>
                            ),
                        },
                    ]}
                />
                <Collapse
                    className='p-3'
                    collapsible="header"
                    items={[
                        {
                            key: '3',
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <h1 className="text-white text-[20px] font-semibold">
                                        Where can I watch?
                                    </h1>
                                    <PlusOutlined className="text-white text-[20px]" />
                                </div>
                            ),
                            children: (
                                <div className="custom-content-reason text-[17px]">
                                    Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.<br /><br />
                                    You can also download your favorite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere.
                                </div>
                            ),
                        },
                    ]}
                />

                <Collapse
                    className='p-3'
                    collapsible="header"
                    items={[
                        {
                            key: '4',
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <h1 className="text-white text-[20px] font-semibold">
                                        How do I cancel?
                                    </h1>
                                    <PlusOutlined className="text-white text-[20px]" />
                                </div>
                            ),
                            children: (
                                <div className="custom-content-reason text-[17px]">
                                    Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.                  </div>
                            ),
                        },
                    ]}
                />
                <Collapse
                    className='p-3'
                    collapsible="header"
                    items={[
                        {
                            key: '5',
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <h1 className="text-white text-[20px] font-semibold">
                                        What can I watch on Netflix?
                                    </h1>
                                    <PlusOutlined className="text-white text-[20px]" />
                                </div>
                            ),
                            children: (
                                <div className="custom-content-reason text-[17px]">
                                    Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.                  </div>
                            ),
                        },
                    ]}
                />

                <Collapse
                    className='p-3'
                    collapsible="header"
                    items={[
                        {
                            key: '6',
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <h1 className="text-white text-[20px] font-semibold">
                                        Is Netflix good for kids?
                                    </h1>
                                    <PlusOutlined className="text-white text-[20px]" />
                                </div>
                            ),
                            children: (
                                <div className="custom-content-reason text-[17px]">
                                    The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.<br /> <br />
                                    Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don’t want kids to see.
                                </div>
                            ),
                        },
                    ]}
                />
            </Space>
        </>
    )
}

export default QnA