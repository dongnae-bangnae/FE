import { useEffect, useState } from "react";
import fonts from "../styles/fonts";

interface MessagePopupProps {
  message: string;
  icon?: string;
}

const MessagePopup = ({ message, icon }: MessagePopupProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed left-1/2 transform -translate-x-1/2"
      style={{
        bottom: "50px",
        width: "330px",
        height: "45px",
        backgroundColor: "#767B7E",
        opacity: "80%",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        zIndex: 9999,
        gap: "10px",
        color: "white",
        fontSize: "13px",
        fontWeight: fonts.weight.regular,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        padding: "0 16px",
      }}
    >
      {icon && (
        <img
          src={icon}
          alt="icon"
          style={{ width: "18px", height: "18px", objectFit: "contain" }}
        />
      )}
      <span>{message}</span>
    </div>
  );
};

export default MessagePopup;
