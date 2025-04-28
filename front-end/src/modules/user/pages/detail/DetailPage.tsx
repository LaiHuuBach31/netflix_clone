import { Button, Rate, Tag } from 'antd'
import React from 'react'
import SectionHeader from '../../components/section/SectionHeader'
import { useParams } from 'react-router-dom';

const DetailPage:React.FC = () => {

    const { id } = useParams();

    return (
        <>
            <div style={{ flex: 1, padding: '0 100px' }}>

                <SectionHeader title="Detail" />

                <div className="text-white py-8 px-6">
                    <div className="flex flex-col md:flex-row gap-6">

                        <div className="w-full md:w-[200px] flex-shrink-0">
                            <div className="relative">
                                <div>
                                    <img src="https://occ-0-3687-58.1.nflxso.net/dnm/api/v6/-klpX4b1RECP-oGX3Uvz90PrgHE/AAAABaXp51GeqmxqBq5ors3pR1YbCvPrYSRlEzf_uBel_vEYF0PABMM2cDJy9kUO1SnM9s3EJVYaAbamh2cXCWf8p38osPWcXYFKwSS0e7ADVm94ZbEuKXXZL0VF09Th9zm9hFAEQe5M2MhG2hA3ycdAoHFaroertXe1K1BDTeGrG0KaWcaS76wJcVDLlIV8pE5wtnmnoZ14Wb5CkA4d.webp?r=153" alt="" />
                                </div>
                                <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                                    Vietsub
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold">
                                    When Life Gives You Tangerines
                                </h1>
                                <p className="text-sm italic text-gray-400">
                                    Legends of the Condor Heroes: The Gallants
                                </p>
                            </div>

                            <p className="text-sm text-gray-300">
                                Under Genghis Khan, the Mongolian army pushes west to destroy the Jin Dynasty,
                                setting its sights on the Song Dynasty next. Amid internal conflicts among martial
                                arts schools, Guo Jing unites the Central Plains' warriors to defend Xiangyang,
                                embodying courage and loyalty in the fight for the nation.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 text-sm">
                                <span><strong>Type:</strong> single</span>
                                <span><strong>Produced:</strong> 2025</span>
                                <span><strong>Country:</strong> Trung Quốc</span>
                                <span><strong>Status:</strong> trailer</span>
                                <span><strong>Date update:</strong> 13/04/2025 17:28:06</span>
                                <span><strong>Episode:</strong> Trailer</span>
                                <span><strong>Genre:</strong> <Tag color="blue">Hành Động</Tag> <Tag color="green">Chính kịch</Tag></span>
                                <span><strong>Duration:</strong> 147 phút</span>
                                <span><strong>Quality:</strong> HD</span>
                                <span><strong>Views:</strong> 0</span>
                            </div>

                            <div className="flex items-center gap-2 text-yellow-400">
                                <Rate allowHalf disabled defaultValue={5} className="text-[18px]" />
                                <span className="text-sm text-white">1.029 Votes</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="primary" danger className="font-bold">THEO DÕI</Button>
                                <Button className="bg-red-600 text-white font-bold hover:bg-red-700">XEM TRAILER</Button>
                                <Button className="bg-red-600 text-white font-bold hover:bg-red-700">XEM NGAY</Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-[#3b3b5b] pt-6">
                        <h3 className="text-white font-bold uppercase text-sm">Bình luận</h3>
                        <p className="text-sm text-gray-400 mt-2">Chưa có bình luận nào</p>
                        <Button className="mt-2 bg-red-600 text-white font-bold">Đăng nhập</Button>
                    </div>

                    <div className="mt-12 border-t border-[#3b3b5b] pt-6">
                        <h3 className="text-white font-bold uppercase text-sm">YOU MIGHT LIKE...</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            Chưa có phim phù hợp
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPage