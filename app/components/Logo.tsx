export default function Logo({ className = "", size = 40 }: { className?: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M32 12H12C10.8954 12 10 12.8954 10 14V26H8V28H10V30C10 31.1046 10.8954 32 12 32H14C14 31.1046 14.8954 30.4 16 30.4C17.1046 30.4 18 31.1046 18 32H26C26 31.1046 26.8954 30.4 28 30.4C29.1046 30.4 30 31.1046 30 32H32C33.1046 32 34 31.1046 34 30V28H36V22L32 12Z"
                fill="url(#paint0_linear)"
            />
            <path
                d="M32 14L35 21H32V14Z"
                fill="white"
                fillOpacity="0.3"
            />
            <circle cx="16" cy="32" r="2" fill="var(--text-main)" />
            <circle cx="28" cy="32" r="2" fill="var(--text-main)" />
            <defs>
                <linearGradient
                    id="paint0_linear"
                    x1="10"
                    y1="12"
                    x2="36"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF6B6B" />
                    <stop offset="1" stopColor="#EE5253" />
                </linearGradient>
            </defs>
        </svg>
    );
}
