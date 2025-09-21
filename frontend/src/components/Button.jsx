import { Link } from "react-router-dom";

function Button({
  title,
  href,
  to,
  icon,
  onClick,
  type = "button",
  className = "",
  children,
  ...passProps
}) {
  const baseStyle =
    "px-4 py-2 font-medium rounded-lg  focus:outline-none transition";
  const props = { onClick, ...passProps };

  if (href) {
    return (
      <a href={href} className={`${baseStyle} ${className}`} {...props}>
        {icon}
        <div className="mx-2">
          {children || title}
        </div>
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`${baseStyle} ${className}`} {...props}>
        {icon}
        <div className="mx-2">
          {children || title}
        </div>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${className}`} {...props}>
      {icon}
      <div className="mx-2">
        {children || title}
      </div>
    </button>
  );
}

export default Button;
