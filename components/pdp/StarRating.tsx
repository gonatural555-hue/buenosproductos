type Props = {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

export default function StarRating({
  rating,
  size = "md",
  className = "",
}: Props) {
  const rounded = Math.round(rating);
  const iconClass = SIZE_CLASS[size];

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`.trim()}
      aria-hidden
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${iconClass} ${i < rounded ? "text-[#F4B400]" : "text-[#E5E7EB]"}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
    </span>
  );
}
