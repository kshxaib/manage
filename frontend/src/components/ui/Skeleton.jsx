import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200/50 rounded-lg ${className}`}
            {...props}
        />
    );
};

export default Skeleton;
