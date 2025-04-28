import { RightOutlined } from '@ant-design/icons'
import { Button, Carousel, Input } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Banner: React.FC = () => {
  return (
    <>
      <Carousel
        autoplay
        arrows
        infinite={false}
        appendDots={(dots) => (
          <div style={{ bottom: '-15%' }}>
            <ul className="custom-dot ">{dots}</ul>
          </div>
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-black/40 rounded-[35px]"></div>
          <div>
            <img
              className="rounded-[35px] w-full h-[550px] object-cover"
              src="https://cdn.playbackonline.ca/wp/wp-content/uploads/2020/05/Screen-Shot-2020-05-04-at-1.41.10-PM.png"
              alt=""
            />
          </div>

          <div className="absolute top-0 left-0 w-full h-full flex items-center px-10">
            <div className="w-[50%] text-white">
              <p className="text-[50px] font-bold font-semibold mt-2 mb-3 font-mono ">Unlimited movies, TV shows, and more</p>
              <p className="mb-3 text-[30px] font-bold">
                Starts at 70,000 ₫. Cancel anytime.
              </p>
              <p className="mb-3">
                Ready to watch? Enter your email to create or restart your membership.
              </p>

              <div className="flex">
                <Input
                  placeholder="Email address"
                  className="flex-1 h-12 bg-[rgb(85,84,79,0.5)] placeholder:text-gray-400 placeholder-transparent border-none rounded-full px-4 py-2 focus:border-gray focus:bg-[rgb(85,84,79,0.5)] hover:bg-[rgb(85,84,79,0.5)]"
                  style={{ color: 'inherit' }}
                />

                <Link to="/welcome">
                  <Button
                    type="primary"
                    className="h-12 bg-[rgb(85,84,79,0.5)] text-white font-semibold rounded-full px-6 py-2 ml-2 custom-button-start"
                  >
                    Start <RightOutlined />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-black/40 rounded-[35px]"></div>
          <div>
            <img
              className="rounded-[35px] w-full h-[550px] object-cover"
              src="https://resource.kinhtedothi.vn/2025/03/10/4-17413747552121162435430.jpg"
              alt=""
            />
          </div>

          <div className="absolute top-0 left-0 w-full h-full flex items-center px-10">
            <div className="w-[50%] text-white">
              <img
                src="https://occ-0-3687-58.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABaM2HJhp57FNCb_x9CbHrMUUTkDtz7Bw66308aKPZkWx4O3JAM7s8s1bvNpiFPq6b1yRP0E_0u_8N3x3bzJiwVTVOWbdRTq0.webp?r=1de"
                alt=""
              />
              <p className="text-2xl font-semibold mt-2 mb-3 font-mono">When Life Gives You Tangerines</p>
              <p className="mb-3">
                In Jeju, a spirited girl and a steadfast boy's island story blossoms into a lifelong tale of setbacks and triumphs — proving love endures across time.
              </p>
              <p className="mb-3">
                Ready to watch? Enter your email to create or restart your membership.
              </p>

              <div className="flex">
                <Input
                  placeholder="Email address"
                  className="flex-1 h-12 bg-[rgb(85,84,79,0.5)]  placeholder:text-gray-400 placeholder-transparent border-none rounded-full px-4 py-2 focus:border-gray focus:bg-[rgb(85,84,79,0.5)] hover:bg-[rgb(85,84,79,0.5)]"
                />
                <Button
                  type="primary"
                  className="h-12 bg-[rgb(85,84,79,0.5)] text-white font-semibold rounded-full px-6 py-2 ml-2 custom-button-start"
                >
                  Start <RightOutlined />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </>
  )
}

export default Banner