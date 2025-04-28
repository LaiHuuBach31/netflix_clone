import React from 'react'

type SectionIntroProps = {
    title: string;
    description: string;
};

const SectionTop = ({ title, description }: SectionIntroProps) => {
    return (
        <div className="text-white py-8">
            <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
            <p className="text-lg max-w-3xl leading-relaxed">{description}</p>
        </div>
    );
};

export default SectionTop;


