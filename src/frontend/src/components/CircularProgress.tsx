import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
  progressColor?: string;
  textColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 10,
  bgColor = "rgba(255, 255, 255, 0.2)",
  progressColor = "#fff",
  textColor = "#fff"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle
        className="circular-progress-bg"
        stroke={bgColor}
        fill="none"
        strokeWidth={strokeWidth}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        className="circular-progress-fg"
        stroke={progressColor}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="2rem"
        fill={textColor}
        fontFamily="'Poppins', sans-serif"
        fontWeight="700"
      >
        {progress}%
      </text>
    </svg>
  );
};

export default CircularProgress;