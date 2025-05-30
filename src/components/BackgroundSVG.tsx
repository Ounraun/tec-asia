import React from "react";

const BackgroundSVG: React.FC = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 2338"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
    >
      <g filter="url(#filter0_d_198_16)">
        <rect
          x="0"
          y="0"
          width="1440"
          height="2338"
          fill="url(#paint1_radial_198_16)"
        />
        <rect
          x="0"
          y="0"
          width="1440"
          height="376"
          fill="url(#paint2_linear_198_16)"
        />
        <rect
          x="0"
          y="1604.04"
          width="1440"
          height="714.754"
          fill="url(#paint0_linear_198_16)"
        />
        <rect
          x="0"
          y="1822"
          width="1440"
          height="376"
          fill="url(#paint3_linear_198_16)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_198_16"
          x="-124.3"
          y="0.699756"
          width="1705.82"
          height="2336.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="5" />
          <feGaussianBlur stdDeviation="6.65" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.21 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_198_16"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_198_16"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_198_16"
          x1="720"
          y1="2318.79"
          x2="720"
          y2="1604.04"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.185" stopColor="#0E0E0E" stopOpacity="0.9" />
          <stop offset="0.33" stopColor="#0E0E0E" stopOpacity="0.79" />
          <stop offset="1" stopColor="#666666" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_198_16"
          cx="720"
          cy="1169"
          r="720"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0.2" />
          <stop offset="0.965" stopColor="#0E0E0E" stopOpacity="0.74" />
        </radialGradient>
        <linearGradient
          id="paint2_linear_198_16"
          x1="720"
          y1="376"
          x2="720"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.306976" stopColor="#666666" stopOpacity="0" />
          <stop offset="0.307076" stopColor="#0E0E0E" />
          <stop offset="0.417575" stopColor="#0E0E0E" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_198_16"
          x1="720"
          y1="2198"
          x2="720"
          y2="1822"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.306976" stopColor="#666666" stopOpacity="0" />
          <stop offset="0.307076" stopColor="#0E0E0E" />
          <stop offset="0.417575" stopColor="#0E0E0E" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BackgroundSVG;
