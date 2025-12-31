import { toast } from "react-toastify";

function DescriptionCopy({ text }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Đã copy mô tả!", { autoClose: 1500 });
  };

  return (
    <p
      onClick={handleCopy}
      className="cursor-pointer truncate w-full hover:opacity-50"
      title="Nhấn để copy"
    >
      {text}
    </p>
  );
}

export default DescriptionCopy;
