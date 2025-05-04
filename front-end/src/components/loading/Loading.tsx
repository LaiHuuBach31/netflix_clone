import React from "react";
import { Spin } from "antd"; 
import "./loading.css";

const Loading: React.FC = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <Spin size="large" />
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;